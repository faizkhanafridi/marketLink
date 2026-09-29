<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Customer dashboard — full insights.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $customerId = $request->user()->user_id;

        // Order stats
        $totalOrders     = Order::where('customer_id', $customerId)->count();
        $pendingOrders   = Order::where('customer_id', $customerId)
            ->whereIn('order_status', ['placed', 'accepted', 'ready_for_pickup'])
            ->count();
        $completedOrders = Order::where('customer_id', $customerId)
            ->where('order_status', 'completed')
            ->count();
        $cancelledOrders = Order::where('customer_id', $customerId)
            ->where('order_status', 'cancelled')
            ->count();

        // Total expenses
        $totalSpent = Order::where('customer_id', $customerId)
            ->where('order_status', 'completed')
            ->sum('total_amount');

        // Recent orders (last 5)
        $recentOrders = Order::where('customer_id', $customerId)
            ->with(['farmer:id,stall_name', 'items.product:id,name'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Orders by status (pie chart)
        $ordersByStatus = Order::where('customer_id', $customerId)
            ->selectRaw('order_status as status, COUNT(*) as value')
            ->groupBy('order_status')
            ->get();

        // Monthly spending (bar chart)
        $monthlySpending = Order::where('customer_id', $customerId)
            ->where('order_status', 'completed')
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw("DATE_FORMAT(created_at, '%b') as month, SUM(total_amount) as total")
            ->groupBy('month')
            ->orderByRaw('MIN(created_at)')
            ->get();

        // Top purchased products
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.product_id')
            ->where('orders.customer_id', $customerId)
            ->where('orders.order_status', 'completed')
            ->selectRaw('products.name, SUM(order_items.quantity) as total_qty')
            ->groupBy('products.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        // Favorites count
        $favoritesCount = Favorite::where('customer_id', $customerId)->count();

        return response()->json([
            'total_orders'     => $totalOrders,
            'pending_orders'   => $pendingOrders,
            'completed_orders' => $completedOrders,
            'cancelled_orders' => $cancelledOrders,
            'total_spent'      => (float) $totalSpent,
            'recent_orders'    => $recentOrders,
            'orders_by_status' => $ordersByStatus,
            'monthly_spending' => $monthlySpending,
            'top_products'     => $topProducts,
            'favorites_count'  => $favoritesCount,
        ]);
    }

    /**
     * Get orders that are ready for pickup today/soon.
     */
    public function pickupReminders(Request $request): JsonResponse
    {
        $customerId = $request->user()->user_id;

        $reminders = Order::where('customer_id', $customerId)
            ->where('order_status', 'ready_for_pickup')
            ->where(function ($q) {
                $q->whereDate('pickup_date', today())
                  ->orWhereDate('pickup_date', today()->addDay());
            })
            ->with(['farmer:id,stall_name,address,latitude,longitude'])
            ->get();

        return response()->json($reminders);
    }
}
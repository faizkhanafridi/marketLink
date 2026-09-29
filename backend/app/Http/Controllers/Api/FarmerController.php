<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FarmerProfile;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FarmerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(FarmerProfile::with(['market', 'products'])->get());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(
            FarmerProfile::with(['market', 'products.category', 'user'])->findOrFail($id)
        );
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $profile = $request->user()->farmerProfile;
        if (!$profile) {
            return response()->json(['message' => 'Not a farmer'], 403);
        }

        $data = $request->validate([
            'stall_name'        => 'sometimes|string|max:100',
            'contact_person'    => 'sometimes|string|max:100',
            'description'       => 'nullable|string',
            'market_id'         => 'nullable|integer|exists:markets,market_id',
            'operating_days'    => 'nullable|string|max:100',
            'pickup_window'     => 'nullable|string|max:100',
            'address'           => 'nullable|string',
            'latitude'          => 'nullable|numeric|between:-90,90',
            'longitude'         => 'nullable|numeric|between:-180,180',
            'order_cutoff_time' => 'nullable|string|max:100',
        ]);

        $profile->update($data);

        return response()->json([
            'message' => 'Profile updated',
            'profile' => $profile->fresh(),
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $farmerId = $request->user()->farmerProfile->farmer_id;

        $totalOrders     = Order::where('farmer_id', $farmerId)->count();
        $pendingOrders   = Order::where('farmer_id', $farmerId)->where('order_status', 'placed')->count();
        $completedOrders = Order::where('farmer_id', $farmerId)->where('order_status', 'completed')->count();
        $revenueSummary  = Order::where('farmer_id', $farmerId)
            ->where('order_status', 'completed')
            ->sum('total_amount');

        $bestSelling = Product::where('farmer_id', $farmerId)
            ->withCount(['reviews'])
            ->orderByDesc('stock_quantity')
            ->limit(5)
            ->get();

        return response()->json([
            'total_orders'     => $totalOrders,
            'pending_orders'   => $pendingOrders,
            'completed_orders' => $completedOrders,
            'revenue_summary'  => $revenueSummary,
            'best_selling'     => $bestSelling,
        ]);
    }

    /**
     * Farmer analytics for the dashboard charts.
     */
        /**
     * Farmer analytics for the sales dashboard charts.
     */
    public function analytics(Request $request): JsonResponse
    {
        $farmerId = $request->user()->farmerProfile->farmer_id;
        $days     = (int) $request->query('range', 30);
        $from     = Carbon::now()->subDays($days - 1)->startOfDay();

        // ---------- Revenue timeline ----------
        $rows = Order::selectRaw('DATE(created_at) as day, SUM(total_amount) as revenue, COUNT(*) as orders')
            ->where('farmer_id', $farmerId)
            ->where('created_at', '>=', $from)
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $timeline = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $row  = $rows->get($date);
            $timeline[] = [
                'day'     => $date,
                'label'   => Carbon::parse($date)->format($days <= 30 ? 'M d' : 'M j'),
                'revenue' => (float) ($row->revenue ?? 0),
                'orders'  => (int)   ($row->orders  ?? 0),
            ];
        }

        // ---------- Order status breakdown ----------
        $status = Order::where('farmer_id', $farmerId)
            ->selectRaw('order_status, COUNT(*) as total')
            ->groupBy('order_status')
            ->get()
            ->map(fn ($r) => ['status' => $r->order_status, 'total' => (int) $r->total]);

        // ---------- Top products (by review count) ----------
        $topProducts = Product::where('farmer_id', $farmerId)
            ->withCount(['reviews'])
            ->orderByDesc('reviews_count')
            ->limit(6)
            ->get(['product_id', 'name', 'price', 'stock_quantity']);

        // ---------- Rating distribution ----------
        $ratings = Review::where('farmer_id', $farmerId)
            ->selectRaw('rating, COUNT(*) as total')
            ->groupBy('rating')
            ->get()
            ->map(fn ($r) => ['rating' => (int) $r->rating, 'total' => (int) $r->total]);

        // ---------- Top categories (by product count within this farm) ----------
        $topCategories = DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.category_id')
            ->where('products.farmer_id', $farmerId)
            ->selectRaw('categories.name, COUNT(*) as count')
            ->groupBy('categories.name')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->map(fn ($r) => [
                'name'  => $r->name,
                'count' => (int) $r->count,
            ]);

        // ---------- AOV timeline ----------
        $aovRows = Order::selectRaw('DATE(created_at) as day, AVG(total_amount) as avg_value')
            ->where('farmer_id', $farmerId)
            ->where('order_status', 'completed')
            ->where('created_at', '>=', $from)
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $aovTimeline = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $row  = $aovRows->get($date);
            $aovTimeline[] = [
                'label' => Carbon::parse($date)->format($days <= 30 ? 'M d' : 'M j'),
                'value' => (float) ($row->avg_value ?? 0),
            ];
        }

        return response()->json([
            'range'           => $days,
            'timeline'        => $timeline,
            'order_status'    => $status,
            'top_products'    => $topProducts,
            'top_categories'  => $topCategories,
            'ratings'         => $ratings,
            'aov_timeline'    => $aovTimeline,
        ]);
    }

        /**
     * Farmer sales page — detailed transaction and revenue view.
     */
    public function sales(Request $request): JsonResponse
    {
        $farmerId = $request->user()->farmerProfile->farmer_id;
        $days     = (int) $request->query('range', 30);
        $from     = Carbon::now()->subDays($days - 1)->startOfDay();

        // ---------- KPI Summary (for the range) ----------
        $rangeOrders = Order::where('farmer_id', $farmerId)
            ->where('created_at', '>=', $from);

        $totalRevenue = (clone $rangeOrders)
            ->where('order_status', 'completed')
            ->sum('total_amount');

        $totalOrders = (clone $rangeOrders)->count();

        $completedOrders = (clone $rangeOrders)
            ->where('order_status', 'completed')
            ->count();

        $pendingOrders = (clone $rangeOrders)
            ->whereIn('order_status', ['placed', 'accepted', 'ready_for_pickup'])
            ->count();

        $avgOrderValue = $completedOrders > 0
            ? $totalRevenue / $completedOrders
            : 0;

        // ---------- Previous period for comparison ----------
        $prevFrom = Carbon::now()->subDays($days * 2 - 1)->startOfDay();
        $prevTo   = Carbon::now()->subDays($days)->endOfDay();

        $prevRevenue = Order::where('farmer_id', $farmerId)
            ->where('order_status', 'completed')
            ->whereBetween('created_at', [$prevFrom, $prevTo])
            ->sum('total_amount');

        $prevOrders = Order::where('farmer_id', $farmerId)
            ->whereBetween('created_at', [$prevFrom, $prevTo])
            ->count();

        // ---------- Revenue timeline (daily) ----------
        $rows = Order::selectRaw('DATE(created_at) as day, SUM(total_amount) as revenue, COUNT(*) as orders')
            ->where('farmer_id', $farmerId)
            ->where('created_at', '>=', $from)
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $timeline = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $row  = $rows->get($date);
            $timeline[] = [
                'day'     => $date,
                'label'   => Carbon::parse($date)->format($days <= 30 ? 'M d' : 'M j'),
                'revenue' => (float) ($row->revenue ?? 0),
                'orders'  => (int)   ($row->orders  ?? 0),
            ];
        }

        // ---------- Sales by product (top selling) ----------
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.product_id')
            ->where('orders.farmer_id', $farmerId)
            ->where('orders.order_status', 'completed')
            ->where('orders.created_at', '>=', $from)
            ->selectRaw('
                products.product_id,
                products.name,
                products.unit,
                SUM(order_items.quantity) as total_quantity,
                SUM(order_items.subtotal) as total_revenue,
                COUNT(DISTINCT orders.order_id) as order_count
            ')
            ->groupBy('products.product_id', 'products.name', 'products.unit')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get()
            ->map(fn ($r) => [
                'product_id'     => (int) $r->product_id,
                'name'           => $r->name,
                'unit'           => $r->unit,
                'total_quantity' => (int) $r->total_quantity,
                'total_revenue'  => (float) $r->total_revenue,
                'order_count'    => (int) $r->order_count,
            ]);

        // ---------- Sales by category ----------
        $byCategory = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->join('products', 'order_items.product_id', '=', 'products.product_id')
            ->join('categories', 'products.category_id', '=', 'categories.category_id')
            ->where('orders.farmer_id', $farmerId)
            ->where('orders.order_status', 'completed')
            ->where('orders.created_at', '>=', $from)
            ->selectRaw('
                categories.name,
                SUM(order_items.quantity) as quantity,
                SUM(order_items.subtotal) as revenue
            ')
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($r) => [
                'name'     => $r->name,
                'quantity' => (int) $r->quantity,
                'revenue'  => (float) $r->revenue,
            ]);

        // ---------- Recent completed orders ----------
        $recentOrders = Order::with(['customer:user_id,username', 'items.product:product_id,name'])
            ->where('farmer_id', $farmerId)
            ->where('order_status', 'completed')
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get()
            ->map(fn ($o) => [
                'order_id'      => $o->order_id,
                'customer_name' => $o->customer->username ?? 'Customer',
                'total_amount'  => (float) $o->total_amount,
                'items_count'   => $o->items->sum('quantity'),
                'pickup_date'   => $o->pickup_date,
                'completed_at'  => optional($o->updated_at)->toDateTimeString(),
            ]);

        // ---------- Payment method breakdown (all cash-on-pickup for now) ----------
        $paymentMethods = [
            [
                'method' => 'Cash on Pickup',
                'total'  => (float) $totalRevenue,
                'count'  => $completedOrders,
            ],
        ];

        return response()->json([
            'range'             => $days,
            'summary' => [
                'total_revenue'    => (float) $totalRevenue,
                'total_orders'     => $totalOrders,
                'completed_orders' => $completedOrders,
                'pending_orders'   => $pendingOrders,
                'avg_order_value'  => (float) $avgOrderValue,
                'prev_revenue'     => (float) $prevRevenue,
                'prev_orders'      => $prevOrders,
                'revenue_change'   => $prevRevenue > 0
                    ? (($totalRevenue - $prevRevenue) / $prevRevenue) * 100
                    : null,
                'orders_change'    => $prevOrders > 0
                    ? (($totalOrders - $prevOrders) / $prevOrders) * 100
                    : null,
            ],
            'timeline'         => $timeline,
            'top_products'     => $topProducts,
            'by_category'      => $byCategory,
            'recent_orders'    => $recentOrders,
            'payment_methods'  => $paymentMethods,
        ]);
    }


        /**
     * Get only the authenticated farmer's products.
     * This is the secure endpoint for the farmer dashboard — never trusts
     * a client-supplied farmer_id.
     */
        public function myProducts(Request $request): JsonResponse
    {
        $farmerId = $request->user()->farmerProfile->farmer_id;

        $products = Product::with(['category'])
            ->where('farmer_id', $farmerId)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($product) {
                return [
                    'product_id'     => $product->product_id,
                    'farmer_id'      => $product->farmer_id,
                    'category_id'    => $product->category_id,
                    'name'           => $product->name,
                    'description'    => $product->description,
                    'price'          => $product->price,
                    'unit'           => $product->unit,
                    'stock_quantity' => $product->stock_quantity,
                    'image'          => $product->image
                        ? (str_starts_with($product->image, 'http')
                            ? $product->image
                            : url($product->image))
                        : null,
                    'is_available'   => $product->is_available,
                    'category'       => $product->category,
                    'created_at'     => $product->created_at,
                ];
            });

        return response()->json($products);
    }
}
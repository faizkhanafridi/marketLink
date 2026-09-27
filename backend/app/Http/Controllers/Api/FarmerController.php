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
    public function analytics(Request $request): JsonResponse
    {
        $farmerId = $request->user()->farmerProfile->farmer_id;
        $days     = (int) $request->query('range', 30);
        $from     = Carbon::now()->subDays($days - 1)->startOfDay();

        // Revenue timeline
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
                'label'   => Carbon::parse($date)->format($days <= 30 ? 'M d' : 'M j'),
                'revenue' => (float) ($row->revenue ?? 0),
                'orders'  => (int)   ($row->orders  ?? 0),
            ];
        }

        // Order status breakdown
        $status = Order::where('farmer_id', $farmerId)
            ->selectRaw('order_status, COUNT(*) as total')
            ->groupBy('order_status')
            ->get()
            ->map(fn ($r) => ['status' => $r->order_status, 'total' => (int) $r->total]);

        // Top products
        $topProducts = Product::where('farmer_id', $farmerId)
            ->withCount(['reviews'])
            ->orderByDesc('reviews_count')
            ->limit(6)
            ->get(['product_id', 'name', 'price', 'stock_quantity']);

        // Rating distribution
        $ratings = Review::where('farmer_id', $farmerId)
            ->selectRaw('rating, COUNT(*) as total')
            ->groupBy('rating')
            ->get()
            ->map(fn ($r) => ['rating' => (int) $r->rating, 'total' => (int) $r->total]);

        return response()->json([
            'range'        => $days,
            'timeline'     => $timeline,
            'order_status' => $status,
            'top_products' => $topProducts,
            'ratings'      => $ratings,
        ]);
    }
}
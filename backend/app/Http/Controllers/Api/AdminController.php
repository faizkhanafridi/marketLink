<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Category;
use App\Models\FarmerProfile;
use App\Models\Order;
use App\Models\Review;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\NotificationService;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct(
        protected UserRepositoryInterface $userRepo
    ) {}

    public function dashboard(): JsonResponse
    {
        return response()->json([
            'total_farmers'   => User::where('role', 'farmer')->count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_orders'    => Order::count(),
            'total_revenue'   => Order::where('order_status', 'completed')->sum('total_amount'),
            'pending_farmers' => User::where('role', 'farmer')->where('is_approved', false)->count(),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $role = $request->query('role');
        $users = $role ? $this->userRepo->findByRole($role) : $this->userRepo->all();
        return response()->json(UserResource::collection($users));
    }

    public function approveFarmer(int $id): JsonResponse
    {
        $user = $this->userRepo->approveFarmer($id);
    
        // 📬 Notify farmer
        NotificationService::farmerApproved($user);
    
        return response()->json(['message' => 'Farmer approved', 'user' => new UserResource($user)]);
    }

    public function toggleUserStatus(int $id): JsonResponse
    {
        $user = $this->userRepo->toggleStatus($id);
        return response()->json(['message' => 'Status changed', 'user' => new UserResource($user)]);
    }

    public function deleteReview(int $id): JsonResponse
    {
        Review::findOrFail($id)->delete();
        return response()->json(['message' => 'Review deleted']);
    }

    public function reports(): JsonResponse
    {
        return response()->json([
            'total_orders'      => Order::count(),
            'revenue_by_status' => Order::selectRaw('order_status, SUM(total_amount) as revenue')
                ->groupBy('order_status')->get(),
            'most_active_farmers' => FarmerProfile::withCount('orders')
                ->orderByDesc('orders_count')->limit(10)->get(),
        ]);
    }

    public function categories(): JsonResponse
    {
        return response()->json(Category::all());
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => 'required|string|unique:categories,name|max:50']);
        return response()->json(Category::create($data), 201);
    }

    public function deleteCategory(int $id): JsonResponse
    {
        Category::findOrFail($id)->delete();
        return response()->json(['message' => 'Category deleted']);
    }

    public function reviews(): JsonResponse
    {
        $reviews = Review::with(['customer', 'product', 'farmer'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($reviews);
    }

    /**
     * Comprehensive analytics for the admin dashboard.
     */
    public function analytics(Request $request): JsonResponse
    {
        $days = (int) $request->query('range', 30);
        $from = Carbon::now()->subDays($days - 1)->startOfDay();

        // ---------- Revenue timeline ----------
        $revenueRows = Order::selectRaw('DATE(created_at) as day, SUM(total_amount) as revenue, COUNT(*) as orders')
            ->where('created_at', '>=', $from)
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $revenueTimeline = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $row  = $revenueRows->get($date);
            $revenueTimeline[] = [
                'day'     => $date,
                'label'   => Carbon::parse($date)->format($days <= 30 ? 'M d' : 'M j'),
                'revenue' => (float) ($row->revenue ?? 0),
                'orders'  => (int)   ($row->orders  ?? 0),
            ];
        }

        // ---------- User growth ----------
        $farmerRows = User::selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('role', 'farmer')
            ->where('created_at', '>=', $from)
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $customerRows = User::selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->where('role', 'customer')
            ->where('created_at', '>=', $from)
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        $userGrowth = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $userGrowth[] = [
                'label'     => Carbon::parse($date)->format($days <= 30 ? 'M d' : 'M j'),
                'farmers'   => (int) ($farmerRows->get($date)->total ?? 0),
                'customers' => (int) ($customerRows->get($date)->total ?? 0),
            ];
        }

        // ---------- Order status distribution ----------
        $orderStatus = Order::selectRaw('order_status, COUNT(*) as total')
            ->groupBy('order_status')
            ->get()
            ->map(fn ($r) => [
                'status' => $r->order_status,
                'total'  => (int) $r->total,
            ]);

        // ---------- Top categories ----------
        $topCategories = Category::withCount('products')
            ->orderByDesc('products_count')
            ->limit(6)
            ->get()
            ->map(fn ($c) => [
                'name'  => $c->name,
                'count' => (int) $c->products_count,
            ]);

        // ---------- Top farmers by revenue ----------
        $topFarmers = DB::table('orders')
            ->join('farmer_profiles', 'orders.farmer_id', '=', 'farmer_profiles.farmer_id')
            ->selectRaw('farmer_profiles.stall_name, SUM(orders.total_amount) as revenue')
            ->where('orders.order_status', 'completed')
            ->where('orders.created_at', '>=', $from)
            ->groupBy('farmer_profiles.stall_name')
            ->orderByDesc('revenue')
            ->limit(6)
            ->get()
            ->map(fn ($r) => [
                'stall_name' => $r->stall_name,
                'revenue'    => (float) $r->revenue,
            ]);

        // ---------- AOV timeline ----------
        $aovRows = Order::selectRaw('DATE(created_at) as day, AVG(total_amount) as avg_value')
            ->where('created_at', '>=', $from)
            ->where('order_status', 'completed')
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
            'range'            => $days,
            'revenue_timeline' => $revenueTimeline,
            'user_growth'      => $userGrowth,
            'order_status'     => $orderStatus,
            'top_categories'   => $topCategories,
            'top_farmers'      => $topFarmers,
            'aov_timeline'     => $aovTimeline,
        ]);
    }
}
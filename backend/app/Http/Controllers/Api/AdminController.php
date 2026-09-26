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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            'total_orders'     => Order::count(),
            'revenue_by_status'=> Order::selectRaw('order_status, SUM(total_amount) as revenue')
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
}
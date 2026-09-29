<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepo,
        protected ProductRepositoryInterface $productRepo
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'customer') {
            $orders = $this->orderRepo->getCustomerOrders($user->user_id);
        } elseif ($user->role === 'farmer') {
            $orders = $this->orderRepo->getFarmerOrders($user->farmerProfile->farmer_id);
        } else {
            $orders = $this->orderRepo->all();
        }

        return response()->json(OrderResource::collection($orders));
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        if ($request->user()->role !== 'customer') {
            return response()->json(['message' => 'Only customers can place orders'], 403);
        }

        DB::beginTransaction();
        try {
            $totalAmount = 0;
            $itemsData = [];

            foreach ($request->items as $item) {
                $product = $this->productRepo->findOrFail($item['product_id']);

                if (!$product->is_available || $product->stock_quantity < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Product {$product->name} not available or insufficient stock"
                    ], 422);
                }

                $subtotal = $product->price * $item['quantity'];
                $totalAmount += $subtotal;

                $itemsData[] = [
                    'product_id' => $product->product_id,
                    'quantity'   => $item['quantity'],
                    'price'      => $product->price,
                    'subtotal'   => $subtotal,
                ];

                // Optional: deduct stock
                $product->decrement('stock_quantity', $item['quantity']);
            }

            $order = $this->orderRepo->create([
                'customer_id'  => $request->user()->user_id,
                'farmer_id'    => $request->farmer_id,
                'total_amount' => $totalAmount,
                'order_status' => 'placed',
                'pickup_date'  => $request->pickup_date,
                'pickup_slot'  => $request->pickup_slot,
                'notes'        => $request->notes,
            ]);

            $order->items()->createMany($itemsData);

            DB::commit();

            // 📬 Notify farmer about new order
            NotificationService::orderPlaced($order->load('customer', 'farmer.user'));

            return response()->json([
                'message' => 'Order placed successfully',
                'order'   => new OrderResource($order->load('items.product', 'farmer')),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $order = $this->orderRepo->findOrFail($id)->load(['items.product', 'farmer', 'customer']);

        $user = $request->user();
        if ($user->role === 'customer' && $order->customer_id !== $user->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->role === 'farmer' && $order->farmer_id !== $user->farmerProfile?->farmer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(new OrderResource($order));
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate(['status' => 'required|in:accepted,declined,ready_for_pickup,completed,cancelled']);

        $order = $this->orderRepo->findOrFail($id);
        $user = $request->user();

        if ($user->role === 'farmer' && $order->farmer_id !== $user->farmerProfile?->farmer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $updated = $this->orderRepo->updateStatus($id, $request->status);
        $updated->load('customer', 'farmer.user');

        // 📬 Send notification based on new status
        match ($request->status) {
            'accepted'         => NotificationService::orderAccepted($updated),
            'declined'         => NotificationService::orderDeclined($updated),
            'ready_for_pickup' => NotificationService::orderReady($updated),
            'completed'        => NotificationService::orderCompleted($updated),
            'cancelled'        => NotificationService::orderCancelled($updated),
            default            => null,
        };

        return response()->json([
            'message' => 'Status updated',
            'order'   => new OrderResource($updated),
        ]);
    }

    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = $this->orderRepo->findOrFail($id);

        if ($order->customer_id !== $request->user()->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (in_array($order->order_status, ['completed', 'cancelled'])) {
            return response()->json(['message' => 'Cannot cancel this order'], 422);
        }

        $this->orderRepo->updateStatus($id, 'cancelled');

        // 📬 Notify farmer
        NotificationService::orderCancelled($order->load('farmer.user'));

        return response()->json(['message' => 'Order cancelled']);
    }
}
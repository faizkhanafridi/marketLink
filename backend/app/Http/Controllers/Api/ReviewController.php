<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(
        protected ReviewRepositoryInterface $reviewRepo
    ) {}

    public function productReviews(int $productId): JsonResponse
    {
        return response()->json($this->reviewRepo->getProductReviews($productId));
    }

    public function farmerReviews(int $farmerId): JsonResponse
    {
        return response()->json($this->reviewRepo->getFarmerReviews($farmerId));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
        'product_id' => 'nullable|exists:products,product_id',
        'farmer_id'  => 'nullable|exists:farmer_profiles,farmer_id',
        'rating'     => 'required|integer|min:1|max:5',
        'comment'    => 'nullable|string',
        ]);
    
        if ($request->user()->role !== 'customer') {
            return response()->json(['message' => 'Only customers can review'], 403);
        }
    
        // ✅ FIX: Agar product_id diya hai toh farmer_id auto-detect karo
        if (!empty($data['product_id']) && empty($data['farmer_id'])) {
            $product = \App\Models\Product::find($data['product_id']);
            if ($product) {
                $data['farmer_id'] = $product->farmer_id;
            }
        }
    
        // ✅ Validation: Kam se kam ek zaroori
        if (empty($data['product_id']) && empty($data['farmer_id'])) {
            return response()->json([
                'message' => 'Either product_id or farmer_id is required'
            ], 422);
        }
    
        $data['customer_id'] = $request->user()->user_id;
        $review = $this->reviewRepo->create($data);
    
        // 📬 Notify farmer about new review
        $review->load('customer', 'farmer.user');
        NotificationService::newReview($review);
    
        return response()->json([
            'message' => 'Review added',
            'review' => $review->load('farmer'),
        ], 201);
    }

    public function reply(Request $request, int $id): JsonResponse
    {
        $request->validate(['reply' => 'required|string']);

        if ($request->user()->role !== 'farmer') {
            return response()->json(['message' => 'Only farmers can reply'], 403);
        }

        $review = $this->reviewRepo->addFarmerReply($id, $request->reply);

        // 📬 Notify customer
        $review->load('customer');
        NotificationService::reviewReply($review);

        return response()->json(['message' => 'Reply added', 'review' => $review]);
    }
}
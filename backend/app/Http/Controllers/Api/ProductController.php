<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function __construct(
        protected ProductRepositoryInterface $productRepo
    ) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->productRepo->filterProducts($request->all());
        return response()->json(
            ProductResource::collection($products)->response()->getData(true)
        );
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productRepo
            ->findOrFail($id)
            ->load(['farmer', 'category', 'reviews.customer']);

        return response()->json(new ProductResource($product));
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $farmer = $request->user()->farmerProfile;
        if (!$farmer) {
            return response()->json(
                ['message' => 'Only farmers can create products'],
                403
            );
        }

        $data = $request->validated();
        $data['farmer_id'] = $farmer->farmer_id;

        // Normalize the availability boolean
        $data['is_available'] = filter_var(
            $request->input('is_available', true),
            FILTER_VALIDATE_BOOLEAN
        );

        // Convert any uploaded file into a string path BEFORE calling the repo
        $data['image'] = $this->resolveImage($request, null);

        $product = $this->productRepo->create($data);

        return response()->json([
            'message' => 'Product created',
            'product' => new ProductResource($product->load(['farmer', 'category'])),
        ], 201);
    }

    public function update(StoreProductRequest $request, int $id): JsonResponse
    {
        $product = $this->productRepo->findOrFail($id);

        if ($product->farmer_id !== $request->user()->farmerProfile?->farmer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validated();

        if ($request->has('is_available')) {
            $data['is_available'] = filter_var(
                $request->input('is_available'),
                FILTER_VALIDATE_BOOLEAN
            );
        }

        // Keep existing image if none supplied; store a new one if uploaded
        $data['image'] = $this->resolveImage($request, $product->image);

        // If the image changed, delete the old file from storage
        if ($data['image'] !== $product->image && $product->image) {
            $this->deleteStoredImage($product->image);
        }

        $updated = $this->productRepo->update($id, $data);

        return response()->json([
            'message' => 'Product updated',
            'product' => new ProductResource($updated->load(['farmer', 'category'])),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $product = $this->productRepo->findOrFail($id);

        if ($product->farmer_id !== $request->user()->farmerProfile?->farmer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Clean up the stored image if it belongs to us
        if ($product->image) {
            $this->deleteStoredImage($product->image);
        }

        $this->productRepo->delete($id);

        return response()->json(['message' => 'Product deleted']);
    }

    public function markSoldOut(Request $request, int $id): JsonResponse
    {
        $product = $this->productRepo->findOrFail($id);

        if ($product->farmer_id !== $request->user()->farmerProfile?->farmer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->productRepo->markSoldOut($id);

        return response()->json(['message' => 'Marked as sold out']);
    }

    /* ============================================================
       HELPER METHODS
       ============================================================ */

    /**
     * Returns the final image value (a string path or URL) to store:
     *   1. If a file was uploaded → store it, return the public path.
     *   2. If a string was sent → keep it (URL or existing path).
     *   3. Otherwise → keep the existing value (or null on create).
     */
    private function resolveImage(Request $request, ?string $existing): ?string
    {
        // Case 1: File upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');

            $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            if (!in_array($ext, $allowed, true)) {
                $ext = 'jpg';
            }

            $filename = Str::uuid() . '.' . $ext;
            $path = $file->storeAs('products', $filename, 'public');

            return '/storage/' . $path;
        }

        // Case 2: URL string
        $value = $request->input('image');
        if (is_string($value) && trim($value) !== '') {
            return trim($value);
        }

        // Case 3: Nothing → keep existing
        return $existing;
    }

    /**
     * Deletes a previously stored image if it lives in our own /storage directory.
     * External URLs are ignored.
     */
    private function deleteStoredImage(string $image): void
    {
        if (str_starts_with($image, '/storage/')) {
            $path = str_replace('/storage/', '', $image);
            Storage::disk('public')->delete($path);
        }
    }
}
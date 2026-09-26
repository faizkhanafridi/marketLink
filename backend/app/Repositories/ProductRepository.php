<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function filterProducts(array $filters)
    {
        $query = $this->model->with(['farmer', 'category']);

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }
        if (!empty($filters['farmer_id'])) {
            $query->where('farmer_id', $filters['farmer_id']);
        }
        if (!empty($filters['market_id'])) {
            $query->whereHas('farmer', fn($q) => $q->where('market_id', $filters['market_id']));
        }
        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
      if (isset($filters['is_available']) && $filters['is_available'] !== '') {
    $available = filter_var($filters['is_available'], FILTER_VALIDATE_BOOLEAN);
    $query->where('is_available', $available);
}

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function findByFarmer(int $farmerId)
    {
        return $this->model->where('farmer_id', $farmerId)->get();
    }

    public function markSoldOut(int $productId)
    {
        $product = $this->findOrFail($productId);
        $product->is_available = false;
        $product->save();
        return $product;
    }
}   
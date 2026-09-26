<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'product_id'     => $this->product_id,
                        'farmer_id'      => $this->farmer_id,  

            'name'           => $this->name,
            'description'    => $this->description,
            'price'          => $this->price,
            'unit'           => $this->unit,
            'stock_quantity' => $this->stock_quantity,
            
            'image'          => $this->image
            ? (str_starts_with($this->image, 'http')
                ? $this->image
                : url($this->image))
            : null,
            'is_available'   => $this->is_available,
            'category'       => $this->whenLoaded('category'),
            'farmer'         => $this->whenLoaded('farmer'),
        ];
    }
}
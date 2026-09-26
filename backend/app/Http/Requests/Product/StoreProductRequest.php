<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'category_id'    => 'required|exists:categories,category_id',
            'name'           => 'required|string|max:100',
            'description'    => 'nullable|string',
            'price'          => 'required|numeric|min:0',
            'unit'           => 'required|string|max:20',
            'stock_quantity' => 'required|integer|min:0',
            'image'          => 'nullable|string',
            'is_available'   => 'boolean',
        ];
    }
}
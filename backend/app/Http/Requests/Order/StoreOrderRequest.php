<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'farmer_id'    => 'required|exists:farmer_profiles,farmer_id',
            'pickup_date'  => 'required|date|after_or_equal:today',
            'pickup_slot'  => 'required|string|max:50',
            'notes'        => 'nullable|string',
            'items'        => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,product_id',
            'items.*.quantity'   => 'required|integer|min:1',
        ];
    }
}
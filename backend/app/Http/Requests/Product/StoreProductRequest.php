<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Base rules that always apply. The `image` field is validated in
     * withValidator() because its rules depend on whether it's a
     * file upload or a plain string URL.
     */
    public function rules(): array
    {
        return [
            'category_id'    => 'required|exists:categories,category_id',
            'name'           => 'required|string|max:100',
            'description'    => 'nullable|string|max:2000',
            'price'          => 'required|numeric|min:0',
            'unit'           => 'required|string|max:20',
            'stock_quantity' => 'required|integer|min:0',
            'is_available'   => 'nullable',
            // NOTE: no rule for `image` here — handled below
        ];
    }

    /**
     * Add conditional rules for the `image` field:
     *   - If a file is present → validate as an uploaded image
     *   - If a string is present → validate as a URL/path string
     *   - If empty → allow (nullable)
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $value = $this->input('image');

            // Empty → OK
            if ($value === null || $value === '') {
                return;
            }

            // File upload
            if ($this->hasFile('image')) {
                $file = $this->file('image');

                if (!$file->isValid()) {
                    $v->errors()->add('image', 'The uploaded file is invalid.');
                    return;
                }

                $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
                $ext = strtolower($file->getClientOriginalExtension());
                if (!in_array($ext, $allowed, true)) {
                    $v->errors()->add(
                        'image',
                        'Image must be one of: jpg, jpeg, png, webp, gif.'
                    );
                }

                if ($file->getSize() > 5 * 1024 * 1024) {
                    $v->errors()->add('image', 'Image must be under 5 MB.');
                }
                return;
            }

            // Plain string URL
            if (is_string($value)) {
                if (strlen($value) > 500) {
                    $v->errors()->add('image', 'Image URL is too long.');
                }
                return;
            }

            // Anything else (array, object) → reject
            $v->errors()->add(
                'image',
                'Image must be an uploaded file or a URL string.'
            );
        });
    }
}
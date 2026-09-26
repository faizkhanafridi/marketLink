<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function productImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096', // 4MB
        ]);

        $file = $request->file('image');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        // Stored in storage/app/public/products/
        $path = $file->storeAs('products', $filename, 'public');

        return response()->json([
            'message' => 'Image uploaded',
            'path'    => '/storage/' . $path,  // e.g. /storage/products/uuid.jpg
            'url'     => url('/storage/' . $path), // full URL
        ], 201);
    }
}
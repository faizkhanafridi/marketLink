<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\FarmerController;
use App\Http\Controllers\Api\MarketController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/categories', fn() => response()->json(\App\Models\Category::all()));
Route::get('/markets', [MarketController::class, 'index']);
Route::get('/markets/nearby', [MarketController::class, 'nearby']);
Route::get('/markets/{id}', [MarketController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/farmers', [FarmerController::class, 'index']);
Route::get('/farmers/{id}', [FarmerController::class, 'show']);

Route::get('/products/{id}/reviews', [ReviewController::class, 'productReviews']);
Route::get('/farmers/{id}/reviews', [ReviewController::class, 'farmerReviews']);

// Authenticated
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Customer Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/cancel', [OrderController::class, 'cancel']);

     // ============================================
    // CUSTOMER ROUTES
    // ============================================
    Route::middleware('role:customer')->group(function () {
        // Customer Dashboard
        Route::get('/customer/dashboard', [CustomerController::class, 'dashboard']);

        // Pickup Reminders
        Route::get('/customer/pickup-reminders', [CustomerController::class, 'pickupReminders']);

        // AI Chatbot
        Route::post('/chatbot', [ChatbotController::class, 'chat']);
    });

    // Farmer
    Route::middleware('role:farmer')->group(function () {
        Route::get('/farmer/dashboard', [FarmerController::class, 'dashboard']);
      Route::get('/farmer/analytics', [FarmerController::class, 'analytics']);
      Route::get('/farmer/sales', [FarmerController::class, 'sales']);
      
        Route::put('/farmer/profile', [FarmerController::class, 'updateProfile']);

        Route::get('/farmer/products', [FarmerController::class, 'myProducts']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::patch('/products/{id}/sold-out', [ProductController::class, 'markSoldOut']);

        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
        Route::post('/reviews/{id}/reply', [ReviewController::class, 'reply']);

        Route::post('/upload/product-image', [\App\Http\Controllers\Api\UploadController::class, 'productImage']);
    });

    // Admin
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
                Route::get('/analytics', [AdminController::class, 'analytics']);

        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{id}/approve', [AdminController::class, 'approveFarmer']);
        Route::patch('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        Route::get('/reviews', [AdminController::class, 'reviews']);
        Route::delete('/reviews/{id}', [AdminController::class, 'deleteReview']);
        Route::delete('/reviews/{id}', [AdminController::class, 'deleteReview']);
        Route::get('/reports', [AdminController::class, 'reports']);

        Route::get('/categories', [AdminController::class, 'categories']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);

        Route::post('/markets', [MarketController::class, 'store']);
        Route::put('/markets/{id}', [MarketController::class, 'update']);
        Route::delete('/markets/{id}', [MarketController::class, 'destroy']);
    });
});
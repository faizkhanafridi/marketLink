<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Order placed by customer → notify farmer
     */
    public static function orderPlaced($order)
    {
        $farmer = $order->farmer;
        $farmerUser = $farmer?->user;

        if ($farmerUser) {
            AppNotification::send(
                $farmerUser->user_id,
                'order_placed',
                'New Order Received! 🎉',
                "You have a new order #{$order->order_id} from {$order->customer->username}. Total: ₹{$order->total_amount}",
                [
                    'order_id' => $order->order_id,
                    'customer_name' => $order->customer->username,
                    'total_amount' => $order->total_amount,
                    'pickup_date' => $order->pickup_date,
                ]
            );
        }
    }

    /**
     * Order accepted by farmer → notify customer
     */
    public static function orderAccepted($order)
    {
        AppNotification::send(
            $order->customer_id,
            'order_accepted',
            'Order Accepted ✅',
            "Your order #{$order->order_id} has been accepted by {$order->farmer->stall_name}. Pickup: {$order->pickup_date} ({$order->pickup_slot})",
            [
                'order_id' => $order->order_id,
                'farmer_name' => $order->farmer->stall_name,
            ]
        );
    }

    /**
     * Order ready for pickup → notify customer
     */
    public static function orderReady($order)
    {
        AppNotification::send(
            $order->customer_id,
            'order_ready',
            'Order Ready for Pickup! 📦',
            "Your order #{$order->order_id} is ready. Please pick it up during your slot: {$order->pickup_slot}",
            [
                'order_id' => $order->order_id,
                'pickup_date' => $order->pickup_date,
                'pickup_slot' => $order->pickup_slot,
            ]
        );
    }

    /**
     * Order completed
     */
    public static function orderCompleted($order)
    {
        AppNotification::send(
            $order->customer_id,
            'order_completed',
            'Order Completed ✨',
            "Order #{$order->order_id} has been completed. Thank you for supporting local farmers!",
            ['order_id' => $order->order_id]
        );
    }

    /**
     * Order cancelled by customer → notify farmer
     */
    public static function orderCancelled($order)
    {
        $farmerUser = $order->farmer?->user;

        if ($farmerUser) {
            AppNotification::send(
                $farmerUser->user_id,
                'order_cancelled',
                'Order Cancelled ❌',
                "Order #{$order->order_id} has been cancelled by the customer.",
                ['order_id' => $order->order_id]
            );
        }
    }

    /**
     * Order declined by farmer → notify customer
     */
    public static function orderDeclined($order)
    {
        AppNotification::send(
            $order->customer_id,
            'order_declined',
            'Order Declined',
            "Unfortunately, your order #{$order->order_id} was declined by {$order->farmer->stall_name}.",
            ['order_id' => $order->order_id]
        );
    }

    /**
     * New review → notify farmer
     */
    public static function newReview($review)
    {
        if ($review->farmer_id) {
            $farmer = $review->farmer;
            $farmerUser = $farmer?->user;

            if ($farmerUser) {
                AppNotification::send(
                    $farmerUser->user_id,
                    'new_review',
                    'New Review Received ⭐',
                    "You received a {$review->rating}-star review from {$review->customer->username}.",
                    [
                        'review_id' => $review->review_id,
                        'rating' => $review->rating,
                    ]
                );
            }
        }
    }

    /**
     * Farmer replied to review → notify customer
     */
    public static function reviewReply($review)
    {
        AppNotification::send(
            $review->customer_id,
            'review_reply',
            'Farmer Replied to Your Review 💬',
            "The farmer has responded to your review.",
            [
                'review_id' => $review->review_id,
                'reply' => $review->farmer_reply,
            ]
        );
    }

    /**
     * Farmer approved by admin → notify farmer
     */
    public static function farmerApproved($user)
    {
        AppNotification::send(
            $user->user_id,
            'farmer_approved',
            'Account Approved! 🎊',
            "Congratulations! Your farmer account has been approved. You can now list products.",
            []
        );
    }

    /**
     * System announcement (from admin)
     */
    public static function systemAnnouncement(int $userId, string $title, string $message)
    {
        AppNotification::send(
            $userId,
            'system',
            $title,
            $message,
            []
        );
    }
}
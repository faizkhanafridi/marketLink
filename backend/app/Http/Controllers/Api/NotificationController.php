<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\NotificationRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationRepositoryInterface $notificationRepo
    ) {}

    /**
     * Get user's notifications (latest first)
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->user_id;
        $limit = $request->query('limit', 20);

        $notifications = $this->notificationRepo->getUserNotifications($userId, $limit);
        $unreadCount = $this->notificationRepo->getUnreadCount($userId);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Get unread count only (for bell icon)
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = $this->notificationRepo->getUnreadCount($request->user()->user_id);

        return response()->json(['unread_count' => $count]);
    }

    /**
     * Mark a specific notification as read
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = $this->notificationRepo->markAsRead($id, $request->user()->user_id);

        return response()->json([
            'message' => 'Marked as read',
            'notification' => $notification,
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->notificationRepo->markAllAsRead($request->user()->user_id);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Delete a notification
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->notificationRepo->deleteNotification($id, $request->user()->user_id);

        return response()->json(['message' => 'Notification deleted']);
    }

    /**
     * Clear all notifications
     */
    public function clearAll(Request $request): JsonResponse
    {
        $this->notificationRepo->clearAll($request->user()->user_id);

        return response()->json(['message' => 'All notifications cleared']);
    }
}
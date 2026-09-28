<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    /**
     * Broadcast notification to all users / specific role
     */
    public function broadcast(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:150',
            'message' => 'required|string',
            'target' => 'required|in:all,customers,farmers,specific',
            'user_ids' => 'required_if:target,specific|array',
            'user_ids.*' => 'exists:users,user_id',
        ]);

        $users = match ($data['target']) {
            'all' => User::where('is_active', true)->pluck('user_id'),
            'customers' => User::where('role', 'customer')->where('is_active', true)->pluck('user_id'),
            'farmers' => User::where('role', 'farmer')->where('is_active', true)->pluck('user_id'),
            'specific' => collect($data['user_ids']),
        };

        $sent = 0;
        foreach ($users as $userId) {
            NotificationService::systemAnnouncement($userId, $data['title'], $data['message']);
            $sent++;
        }

        return response()->json([
            'message' => "Notification sent to {$sent} user(s)",
            'sent_count' => $sent,
        ]);
    }

    /**
     * Get all notifications sent (admin view)
     */
    public function index(Request $request): JsonResponse
    {
        $type = $request->query('type', 'system');

        $notifications = AppNotification::where('type', $type)
            ->with('user:user_id,username,email,role')
            ->orderByDesc('created_at')
            ->paginate($request->query('per_page', 20));

        return response()->json($notifications);
    }
}
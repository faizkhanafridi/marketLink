<?php

namespace App\Repositories;

use App\Models\AppNotification;
use App\Repositories\Contracts\NotificationRepositoryInterface;

class NotificationRepository extends BaseRepository implements NotificationRepositoryInterface
{
    public function __construct(AppNotification $model)
    {
        parent::__construct($model);
    }

    public function getUserNotifications(int $userId, int $limit = 20)
    {
        return $this->model
            ->forUser($userId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    public function getUnreadCount(int $userId)
    {
        return $this->model->forUser($userId)->unread()->count();
    }

    public function markAsRead(int $id, int $userId)
    {
        $notification = $this->model
            ->where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        return $notification->markAsRead();
    }

    public function markAllAsRead(int $userId)
    {
        return $this->model
            ->forUser($userId)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function deleteNotification(int $id, int $userId)
    {
        $notification = $this->model
            ->where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        return $notification->delete();
    }

    public function clearAll(int $userId)
    {
        return $this->model->forUser($userId)->delete();
    }
}
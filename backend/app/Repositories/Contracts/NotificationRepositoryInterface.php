<?php

namespace App\Repositories\Contracts;

interface NotificationRepositoryInterface extends BaseRepositoryInterface
{
    public function getUserNotifications(int $userId, int $limit = 20);
    public function getUnreadCount(int $userId);
    public function markAsRead(int $id, int $userId);
    public function markAllAsRead(int $userId);
    public function deleteNotification(int $id, int $userId);
    public function clearAll(int $userId);
}
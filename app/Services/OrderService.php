<?php

namespace App\Services;

use App\Models\Order;

class OrderService
{
    /**
     * Get all orders for a specific user with items and books.
     */
    public function getUserOrders($userId)
    {
        return Order::with('items.book')
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    /**
     * Cancel an order for a user, verifying own-user permission, pending state,
     * and ensuring it's cancelled within 24 hours of creation.
     */
    public function cancelOrder($userId, Order $order)
    {
        if ($order->user_id !== $userId) {
            return [
                'success' => false,
                'error' => 'Bạn không có quyền thực hiện hành động này.',
                'code' => 403
            ];
        }

        if ($order->status !== 'pending') {
            return [
                'success' => false,
                'error' => 'Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xử lý!'
            ];
        }

        if ($order->created_at->diffInHours(now()) >= 24) {
            return [
                'success' => false,
                'error' => 'Đơn hàng đã vượt quá 24 giờ kể từ lúc đặt, không thể tự hủy!'
            ];
        }

        $order->update(['status' => 'cancelled']);

        return [
            'success' => true
        ];
    }

    /**
     * Get paginated list of all orders for admin.
     */
    public function getPaginatedOrdersForAdmin(int $perPage = 10)
    {
        return Order::with(['user', 'items.book'])->latest()->paginate($perPage);
    }

    /**
     * Update order status.
     */
    public function updateOrderStatus(Order $order, string $status)
    {
        return $order->update(['status' => $status]);
    }

    /**
     * Delete an order.
     */
    public function deleteOrder(Order $order)
    {
        return $order->delete();
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        // Lấy tất cả đơn hàng của user đang đăng nhập, kèm theo chi tiết từng cuốn sách
        $orders = Order::with('items.book')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();
            $cart = \App\Models\Cart::with('items.book')->where('user_id', Auth::id())->first();

        return Inertia::render('Home/Orders/Index', [
            'orders' => $orders,
            'cart' => $cart
        ]);
    }
    public function cancel(Order $order)
    {
        // 1. Kiểm tra chính chủ
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền thực hiện hành động này.');
        }

        // 2. Chỉ cho phép hủy nếu đang "Chờ xử lý"
        if ($order->status !== 'pending') {
            return back()->with('error', 'Chỉ có thể hủy đơn hàng đang ở trạng thái Chờ xử lý!');
        }

        // 3. THÊM ĐIỀU KIỆN NÀY: Kiểm tra đã qua 24h chưa
        if ($order->created_at->diffInHours(now()) >= 24) {
            return back()->with('error', 'Đơn hàng đã vượt quá 24 giờ kể từ lúc đặt, không thể tự hủy!');
        }

        // 4. Đổi trạng thái thành đã hủy
        $order->update(['status' => 'cancelled']);

        return back()->with('success', 'Đã hủy đơn hàng thành công!');
    }
}

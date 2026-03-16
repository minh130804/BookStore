<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller {
    public function index() {
        // Lấy đơn hàng kèm thông tin người mua và chi tiết sản phẩm
        $orders = Order::with(['user', 'items.book'])->latest()->paginate(10);
        return Inertia::render('Admin/Orders/Index', ['orders' => $orders]);
    }

    public function update(Request $request, Order $order) {
        $order->update(['status' => $request->status]);
        return back()->with('success', 'Đã cập nhật trạng thái đơn hàng!');
    }

    public function destroy(Order $order) {
        $order->delete();
        return back()->with('success', 'Đã xóa đơn hàng!');
    }
}

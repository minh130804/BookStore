<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index()
    {
        // Lấy đơn hàng kèm thông tin người mua và chi tiết sản phẩm từ Service
        $orders = $this->orderService->getPaginatedOrdersForAdmin(10);
        return Inertia::render('Admin/Orders/Index', ['orders' => $orders]);
    }

    public function update(Request $request, Order $order)
    {
        $this->orderService->updateOrderStatus($order, $request->status);
        return back()->with('success', 'Đã cập nhật trạng thái đơn hàng!');
    }

    public function destroy(Order $order)
    {
        $this->orderService->deleteOrder($order);
        return back()->with('success', 'Đã xóa đơn hàng!');
    }
}

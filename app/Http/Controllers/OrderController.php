<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;
    protected $cartService;

    public function __construct(OrderService $orderService, CartService $cartService)
    {
        $this->orderService = $orderService;
        $this->cartService = $cartService;
    }

    public function index()
    {
        // Lấy tất cả đơn hàng của user đang đăng nhập từ Service
        $orders = $this->orderService->getUserOrders(Auth::id());
        $cart = $this->cartService->getCartForUser(Auth::id());

        return Inertia::render('Home/Orders/Index', [
            'orders' => $orders,
            'cart' => $cart
        ]);
    }

    public function cancel(Order $order)
    {
        $result = $this->orderService->cancelOrder(Auth::id(), $order);

        if ($result['success']) {
            return back()->with('success', 'Đã hủy đơn hàng thành công!');
        }

        if (isset($result['code']) && $result['code'] === 403) {
            abort(403, $result['error']);
        }

        return back()->with('error', $result['error']);
    }
}

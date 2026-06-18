<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    // Hiển thị trang Giỏ hàng
    public function index()
    {
        // Tìm giỏ hàng của user đang đăng nhập, lấy kèm thông tin chi tiết từng cuốn sách từ Service
        $cart = $this->cartService->getCartForUser(Auth::id());

        return Inertia::render('Home/Cart/Index', [
            'cart' => $cart
        ]);
    }

    // Thêm sách vào giỏ hàng
    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $this->cartService->addToCart(Auth::id(), $request->book_id, $request->quantity);

        return redirect()->back()->with('success', 'Đã thêm sách vào giỏ hàng thành công!');
    }

    // Xóa một sản phẩm khỏi giỏ hàng
    public function destroy(CartItem $cartItem)
    {
        // Kiểm tra bảo mật thông qua Service
        $deleted = $this->cartService->deleteCartItem(Auth::id(), $cartItem);

        if ($deleted) {
            return redirect()->back()->with('success', 'Đã xóa mặt hàng khỏi giỏ.');
        }

        return redirect()->back()->with('error', 'Bạn không có quyền thực hiện thao tác này.');
    }
}

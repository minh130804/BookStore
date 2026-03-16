<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    // Hiển thị trang Giỏ hàng
    public function index()
    {
        // Tìm giỏ hàng của user đang đăng nhập, lấy kèm thông tin chi tiết từng cuốn sách
        $cart = Cart::with('items.book')->where('user_id', Auth::id())->first();

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

        $user = Auth::user();

        // 1. Tìm giỏ hàng của user này, nếu chưa có thì tạo mới
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // 2. Kiểm tra xem cuốn sách này đã có trong giỏ hàng chưa
        $cartItem = CartItem::where('cart_id', $cart->id)
                            ->where('book_id', $request->book_id)
                            ->first();

        if ($cartItem) {
            // Nếu có rồi thì cộng dồn số lượng
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Nếu chưa có thì tạo mới chi tiết giỏ hàng
            CartItem::create([
                'cart_id' => $cart->id,
                'book_id' => $request->book_id,
                'quantity' => $request->quantity
            ]);
        }

        return redirect()->back()->with('success', 'Đã thêm sách vào giỏ hàng thành công!');
    }
    // Xóa một sản phẩm khỏi giỏ hàng
    public function destroy(CartItem $cartItem)
    {
        // Kiểm tra bảo mật: Đảm bảo sản phẩm này nằm trong giỏ hàng của chính user đang đăng nhập
        if ($cartItem->cart->user_id === Auth::id()) {
            $cartItem->delete();
            return redirect()->back()->with('success', 'Đã xóa mặt hàng khỏi giỏ.');
        }

        return redirect()->back()->with('error', 'Bạn không có quyền thực hiện thao tác này.');
    }
}

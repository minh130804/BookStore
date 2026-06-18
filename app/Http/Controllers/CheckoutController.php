<?php

namespace App\Http\Controllers;

use App\Services\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected $checkoutService;

    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    // --- 1. HIỂN THỊ GIAO DIỆN THANH TOÁN ---
    public function index()
    {
        $cart = $this->checkoutService->getCartForCheckout(Auth::id());
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Giỏ hàng của bạn đang trống!');
        }

        return Inertia::render('Home/Checkout/Index', [
            'cart' => $cart
        ]);
    }

    // --- 2. XỬ LÝ LƯU ĐƠN HÀNG VÀ CHUYỂN HƯỚNG ---
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:255',
            'payment_method' => 'required|in:cod,vnpay',
        ]);

        try {
            $order = $this->checkoutService->processCheckout(Auth::id(), $validated);

            if ($request->payment_method === 'vnpay') {
                $vnp_Url = $this->checkoutService->createVnPayUrl($order);
                return Inertia::location($vnp_Url); 
            }

            return redirect()->route('my-orders')->with('success', 'Đặt hàng thành công! Đơn hàng của bạn đang chờ xử lý.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage() ?: 'Giỏ hàng trống!');
        }
    }

    // --- 3. HÀM RETURN (KHÁCH XEM) ---
    public function vnpayReturn(Request $request)
    {
        $result = $this->checkoutService->verifyVnPayReturn($request->all());

        if ($result['is_valid']) {
            if ($result['is_success']) {
                return redirect()->route('my-orders')->with('success', 'Giao dịch thành công! Cảm ơn bạn đã thanh toán.');
            } else {
                return redirect()->route('my-orders')->with('error', 'Giao dịch thất bại hoặc đã bị hủy.');
            }
        } else {
            return redirect()->route('my-orders')->with('error', 'Chữ ký không hợp lệ! Vui lòng thử lại.');
        }
    }

    // --- 4. HÀM IPN (MÁY CHỦ VNPAY GỌI) ---
    public function vnpayIpn(Request $request)
    {
        $result = $this->checkoutService->verifyVnPayIpn($request->all());

        return response()->json([
            'RspCode' => $result['rsp_code'],
            'Message' => $result['message']
        ]);
    }
}
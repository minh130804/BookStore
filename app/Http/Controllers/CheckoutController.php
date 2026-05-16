<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    // --- 1. HIỂN THỊ GIAO DIỆN THANH TOÁN ---
    public function index()
    {
        $cart = Cart::with('items.book')->where('user_id', Auth::id())->first();
        
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
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:255',
            'payment_method' => 'required|in:cod,vnpay',
        ]);

        $cart = Cart::with('items.book')->where('user_id', Auth::id())->first();
        if (!$cart || $cart->items->isEmpty()) {
            return back()->with('error', 'Giỏ hàng trống!');
        }

        $totalPrice = 0;
        foreach ($cart->items as $item) {
            $price = $item->book->discount_price ?? $item->book->price;
            $totalPrice += $price * $item->quantity;
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_address' => $request->customer_address,
            'total_price' => $totalPrice,
            'status' => 'pending', 
            'payment_method' => $request->payment_method, 
        ]);

        foreach ($cart->items as $item) {
            $price = $item->book->discount_price ?? $item->book->price;
            
            $order->items()->create([
                'book_id' => $item->book_id,
                'quantity' => $item->quantity,
                'price' => $price,
            ]);

            $book = Book::find($item->book_id);
            if ($book && $book->stock >= $item->quantity) {
                $book->decrement('stock', $item->quantity);
            }
        }

        $cart->items()->delete();

        // NẾU LÀ VNPAY -> GỌI HÀM TẠO URL VÀ CHUYỂN TRANG
        if ($request->payment_method === 'vnpay') {
            $vnp_Url = $this->createVnPayUrl($order);
            return Inertia::location($vnp_Url); 
        }

        return redirect()->route('my-orders')->with('success', 'Đặt hàng thành công! Đơn hàng của bạn đang chờ xử lý.');
    }

    // --- 3. HÀM TẠO URL VNPAY (ĐÃ FIX TOÀN BỘ LỖI BẰNG HARDCODE) ---
    private function createVnPayUrl($order)
    {
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        // Gắn cứng thông tin xịn để bypass lỗi cache của Railway
        $vnp_TmnCode = "PJWU445Q"; 
        $vnp_HashSecret = "O4JC7ULA6DOV65WIIMX9KDV8TUG6SM98"; 
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "https://bookstorehaiha.io.vn/vnpay/return";

        $vnp_Amount = intval(round((float)$order->total_price)) * 100; 

        // Gắn cứng IP để chống lỗi proxy đa IP trên Railway
        $vnp_IpAddr = "119.17.253.84";

        $startTime = date("YmdHis");
        $expireTime = date('YmdHis', strtotime('+15 minutes', strtotime($startTime)));

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $startTime,
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => "vn",
            "vnp_OrderInfo" => "ThanhToanDonHang_" . $order->id,
            "vnp_OrderType" => "billpayment",
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $order->id . "_" . time(),
            "vnp_ExpireDate" => $expireTime
        );

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        
        // Dùng urlencode chuẩn theo tài liệu VNPAY
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return $vnp_Url;
    }

    // --- 4. HÀM NHẬN KẾT QUẢ TỪ VNPAY ---
    public function vnpayReturn(Request $request)
    {
        // Gắn cứng chữ ký xịn
        $vnp_HashSecret = "O4JC7ULA6DOV65WIIMX9KDV8TUG6SM98"; 
        
        $inputData = array();
        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        
        // Dùng urlencode chuẩn
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        
        $orderId = explode('_', $request->vnp_TxnRef)[0];
        $order = Order::find($orderId);

        if ($secureHash == $vnp_SecureHash) {
            if ($request->vnp_ResponseCode == '00') {
                if ($order) $order->update(['status' => 'processing']); 
                return redirect()->route('my-orders')->with('success', 'Giao dịch thành công! Cảm ơn bạn đã thanh toán qua VNPAY.');
            } else {
                if ($order) $order->update(['status' => 'cancelled']); 
                return redirect()->route('my-orders')->with('error', 'Giao dịch thất bại hoặc đã bị hủy.');
            }
        } else {
            return redirect()->route('my-orders')->with('error', 'Chữ ký không hợp lệ! Vui lòng thử lại.');
        }
    }
}
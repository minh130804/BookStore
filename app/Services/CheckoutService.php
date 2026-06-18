<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Cart;
use App\Models\Book;
use Illuminate\Support\Facades\DB;

class CheckoutService
{
    private $vnp_TmnCode;
    private $vnp_HashSecret;
    private $vnp_Url;
    private $vnp_Returnurl;

    public function __construct()
    {
        $this->vnp_TmnCode = config('services.vnpay.tmn_code');
        $this->vnp_HashSecret = config('services.vnpay.hash_secret');
        $this->vnp_Url = config('services.vnpay.url');
        $this->vnp_Returnurl = config('services.vnpay.return_url');
    }

    /**
     * Get cart details for the user checking out.
     */
    public function getCartForCheckout($userId)
    {
        return Cart::with('items.book')->where('user_id', $userId)->first();
    }

    /**
     * Process checkout: calculates final total price, creates Order and items,
     * decrements stock, and clears items from cart inside a database transaction.
     */
    public function processCheckout($userId, array $data)
    {
        return DB::transaction(function () use ($userId, $data) {
            $cart = Cart::with('items.book')->where('user_id', $userId)->first();
            if (!$cart || $cart->items->isEmpty()) {
                throw new \Exception('Giỏ hàng trống!');
            }

            $totalPrice = 0;
            foreach ($cart->items as $item) {
                $price = $item->book->discount_price ?? $item->book->price;
                $totalPrice += $price * $item->quantity;
            }

            $order = Order::create([
                'user_id' => $userId,
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'customer_address' => $data['customer_address'],
                'total_price' => $totalPrice,
                'status' => 'pending', 
                'payment_method' => $data['payment_method'], 
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

            return $order;
        });
    }

    /**
     * Generate VNPay sandbox checkout URL for an Order.
     */
    public function createVnPayUrl(Order $order)
    {
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        $vnp_Amount = intval(round((float)$order->total_price)) * 100; 
        $vnp_IpAddr = "119.17.253.84"; 

        $startTime = date("YmdHis");
        $expireTime = date('YmdHis', strtotime('+15 minutes', strtotime($startTime)));

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $this->vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => $startTime,
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => "vn",
            "vnp_OrderInfo" => "ThanhToanDonHang_" . $order->id,
            "vnp_OrderType" => "billpayment",
            "vnp_ReturnUrl" => $this->vnp_Returnurl,
            "vnp_TxnRef" => $order->id . "_" . time(),
            "vnp_ExpireDate" => $expireTime
        );

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $this->vnp_Url . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $this->vnp_HashSecret);
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        return $vnp_Url;
    }

    /**
     * Verify VNPay returned params and check if transaction succeeded.
     */
    public function verifyVnPayReturn(array $allParams)
    {
        $inputData = array();
        foreach ($allParams as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);
        if (isset($inputData['vnp_SecureHashType'])) {
            unset($inputData['vnp_SecureHashType']); 
        }

        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $this->vnp_HashSecret);
        $vnp_TxnRef = $allParams['vnp_TxnRef'] ?? '';
        $orderId = explode('_', $vnp_TxnRef)[0];
        $order = Order::find($orderId);

        $isValid = ($secureHash === $vnp_SecureHash);
        $isSuccess = ($isValid && isset($allParams['vnp_ResponseCode']) && $allParams['vnp_ResponseCode'] == '00');

        return [
            'is_valid' => $isValid,
            'is_success' => $isSuccess,
            'order' => $order
        ];
    }

    /**
     * Process VNPay IPN background call.
     */
    public function verifyVnPayIpn(array $allParams)
    {
        $inputData = array();
        foreach ($allParams as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);
        if (isset($inputData['vnp_SecureHashType'])) {
            unset($inputData['vnp_SecureHashType']); 
        }

        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $this->vnp_HashSecret);
        
        $isValid = ($secureHash === $vnp_SecureHash);
        $order = null;
        $rspCode = '97';
        $message = 'Invalid signature';

        if ($isValid) {
            $vnp_TxnRef = $inputData['vnp_TxnRef'] ?? '';
            $orderId = explode('_', $vnp_TxnRef)[0];
            $order = Order::find($orderId);
            
            if ($order) {
                $responseCode = $inputData['vnp_ResponseCode'] ?? '';
                if ($responseCode == '00') {
                    $order->update(['status' => 'processing']); 
                } else {
                    $order->update(['status' => 'cancelled']); 
                }
                $rspCode = '00';
                $message = 'Confirm Success';
            } else {
                $rspCode = '01';
                $message = 'Order not found';
            }
        }

        return [
            'is_valid' => $isValid,
            'rsp_code' => $rspCode,
            'message' => $message,
            'order' => $order
        ];
    }
}

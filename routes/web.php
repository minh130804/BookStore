<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\BookController as AdminBookController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\AuthorController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\GeminiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use Illuminate\Support\Facades\DB; // Thêm dòng này để dùng Database


Route::get('/ai/chat', function (Request $request) {
    $userMessage = mb_strtolower(trim($request->query('message', '')));
   $apiKey = env('GROQ_API_KEY');

    try {
        // 1. LẤY TOÀN BỘ DỮ LIỆU SÁCH (Bao gồm cả description để AI đọc)
        $books = DB::table('books')
            ->join('categories', 'books.category_id', '=', 'categories.id')
            ->select('books.title', 'books.discount_price', 'books.description', 'categories.name as category_name')
            ->get();
        
        // 2. TẠO DANH SÁCH DỮ LIỆU CHI TIẾT CHO AI
        $bookDataContext = "";
        foreach ($books as $book) {
            $bookDataContext .= "Sách: " . $book->title . "\n";
            $bookDataContext .= "- Giá: " . number_format($book->discount_price, 0, ',', '.') . "đ\n";
            $bookDataContext .= "- Thể loại: " . $book->category_name . "\n";
            $bookDataContext .= "- Mô tả chi tiết: " . ($book->description ?? 'Đang cập nhật nội dung') . "\n\n";
        }

        $categories = DB::table('categories')->pluck('name')->toArray();
        $categoryList = implode(', ', $categories);

        // 3. GỌI AI VỚI "BỘ NÃO" LÀ DESCRIPTION
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->withoutVerifying()
        ->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => [
                [
                    'role' => 'system', 
                    'content' => "BẠN LÀ CHUYÊN VIÊN TƯ VẤN SÁCH TẠI BOOKSTORE.
                    
                    DỮ LIỆU CỬA HÀNG:
                    $bookDataContext
                    
                    THỂ LOẠI HIỆN CÓ: $categoryList

                    QUY TẮC TƯ VẤN:
                    1. Khi khách hỏi 'chi tiết', 'nội dung' hoặc muốn biết thêm về 1 cuốn sách: Hãy tìm trong phần 'Mô tả chi tiết' ở trên và tóm tắt lại thật hay cho khách.
                    2. Nếu khách hỏi thể loại không có trong danh sách '$categoryList', hãy báo: 'Xin lỗi quý khách, thể loại này không có trong cửa hàng'.
                    3. Luôn dạ thưa, xưng Shop, trả lời thân thiện và gợi ý khách mua hàng.
                    4. Nếu khách hỏi giá, báo đúng giá tiền.
                    5. Tuyệt đối không tự bịa ra nội dung nếu sách đó không có trong danh sách."
                ],
                ['role' => 'user', 'content' => $userMessage],
            ],
            'temperature' => 0.3, 
        ]);

        if ($response->successful()) {
            return response()->json(['reply' => $response->json()['choices'][0]['message']['content']]);
        }
        return response()->json(['reply' => 'Dạ, Shop đang bận xíu, bạn chờ vài giây nhé!']);

    } catch (\Exception $e) {
        return response()->json(['reply' => "Dạ Shop đây, hiện hệ thống đang gặp chút sự cố, bạn cần hỏi về cuốn sách nào ạ?"]);
    }
});


// --- TRANG CHỦ & CHI TIẾT SÁCH (AI CŨNG XEM ĐƯỢC) ---
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/books', [HomeController::class, 'index'])->name('books.index');
Route::get('/tat-ca-san-pham', [HomeController::class, 'allBooks'])->name('books.all');
Route::get('/book/{book}', [HomeController::class, 'show'])->name('book.show');
Route::get('/gioi-thieu', function () {
    return \Inertia\Inertia::render('Home/About');
})->name('about');

// --- KHU VỰC DÀNH RIÊNG CHO ADMIN ---
Route::prefix('admin')->name('admin.')->group(function () {

    // 1. Route Đăng nhập (Không bọc middleware để khách có thể thấy form)
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->name('login.post');

    // 2. Các Route bắt buộc phải có quyền Admin mới được vào
    Route::middleware(['admin'])->group(function () {
        
        // Bảng điều khiển
        Route::get('/', function () {
            // 1. Thống kê các con số tổng quát
            $totalOrders = \App\Models\Order::count();
            // Chỉ tính doanh thu của những đơn đã giao thành công
            $totalRevenue = \App\Models\Order::where('status', 'delivered')->sum('total_price');
            $totalBooks = \App\Models\Book::count();
            // Chỉ đếm số lượng tài khoản là Khách hàng (user)
            $totalUsers = \App\Models\User::where('role', 'user')->count();

            // 2. Lấy 5 đơn hàng mới đặt gần đây nhất
            $recentOrders = \App\Models\Order::latest()->take(5)->get();

            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'totalOrders' => $totalOrders,
                    'totalRevenue' => $totalRevenue,
                    'totalBooks' => $totalBooks,
                    'totalUsers' => $totalUsers,
                ],
                'recentOrders' => $recentOrders
            ]); 
        })->name('dashboard');

        // Đăng xuất Admin
        Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

        // Quản lý Sách
        Route::get('/books', [AdminBookController::class, 'index'])->name('books.index');
        Route::get('/books/create', [AdminBookController::class, 'create'])->name('books.create');
        Route::post('/books', [AdminBookController::class, 'store'])->name('books.store');
        Route::get('/books/{book}/edit', [AdminBookController::class, 'edit'])->name('books.edit');
        Route::post('/books/{book}', [AdminBookController::class, 'update'])->name('books.update');
        Route::delete('/books/{book}', [AdminBookController::class, 'destroy'])->name('books.destroy');
        
        // Quản lý Thể loại, Tác giả, Đơn hàng, Tài khoản
        Route::resource('categories', CategoryController::class)->except(['show']);
        Route::resource('authors', AuthorController::class)->except(['show']);
        Route::resource('orders', AdminOrderController::class)->only(['index', 'update', 'destroy']);
        Route::resource('users', UserController::class);
    });
});
 
// --- KHU VỰC KHÁCH HÀNG (BẮT BUỘC ĐĂNG NHẬP) ---
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Thông tin cá nhân
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Giỏ hàng
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'store'])->name('cart.store');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
    
    // Thanh toán
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/my-orders', [OrderController::class, 'index'])->name('my-orders');
    Route::put('/my-orders/{order}/cancel', [OrderController::class, 'cancel'])->name('my-orders.cancel');
    Route::get('/vnpay/return', [CheckoutController::class, 'vnpayReturn'])->name('vnpay.return');
});
// --- ROUTE TEST VNPAY ĐỘC LẬP CHỐNG LỖI INERTIA ---   
// Route dành cho AI Chatbot
 
  
// Load các route mặc định của Laravel Breeze 
require __DIR__.'/auth.php';     
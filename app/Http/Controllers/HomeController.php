<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Cart;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;    

class HomeController extends Controller
{
   public function index(Request $request)
    {
        $query = Book::with(['category', 'author'])->latest();
        
        // 1. Nếu khách hàng có gõ từ khóa tìm kiếm
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('author', function($q2) use ($request) {
                      $q2->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        // 2. THÊM ĐOẠN NÀY: Nếu khách hàng bấm chọn 1 danh mục
        if ($request->category) {
            $query->where('category_id', $request->category);
        }
        
        // Dùng withQueryString() để giữ nguyên URL khi chuyển trang
        $books = $query->paginate(12)->withQueryString(); 
        $categories = Category::all();
        $cart = Auth::check() ? Cart::with('items.book')->where('user_id', Auth::id())->first() : null;

        return Inertia::render('Home/Index', [
            'books' => $books, 
            'categories' => $categories, 
            'cart' => $cart,
            // 3. Trả về cả biến category để bôi đậm menu đang chọn
            'filters' => $request->only(['search', 'category']) 
        ]);
    }
    // Thêm hàm này vào dưới hàm index()
    public function show(Book $book)
    {
        // Load thêm thông tin thể loại và tác giả của cuốn sách này
        $book->load(['category', 'author']);

        // Lấy 4 cuốn sách gợi ý cùng thể loại (loại trừ cuốn đang xem)
        $relatedBooks = Book::with(['author'])
            ->where('category_id', $book->category_id)
            ->where('id', '!=', $book->id)
            ->inRandomOrder()
            ->take(4)
            ->get();
            $cart = \Illuminate\Support\Facades\Auth::check() ? \App\Models\Cart::with('items.book')->where('user_id', \Illuminate\Support\Facades\Auth::id())->first() : null;

        return Inertia::render('Home/Show', [
            'book' => $book,
            'relatedBooks' => $relatedBooks,
            'cart' => $cart
        ]);
    }
}

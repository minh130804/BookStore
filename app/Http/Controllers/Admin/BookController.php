<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\Author;
use App\Services\BookService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    protected $bookService;

    public function __construct(BookService $bookService)
    {
        $this->bookService = $bookService;
    }

    public function index()
    {
        // Lấy sách từ Service, phân trang 10 cuốn/trang
        $books = $this->bookService->getPaginatedBooksForAdmin(10);

        return Inertia::render('Admin/Books/Index', [
            'books' => $books
        ]);
    }

    // Hiển thị form thêm sách
    public function create()
    {
        // Lấy danh sách thể loại và tác giả để hiển thị vào thẻ <select>
        $categories = Category::all();
        $authors = Author::all();

        return Inertia::render('Admin/Books/Create', [
            'categories' => $categories,
            'authors' => $authors
        ]);
    }

    // Xử lý lưu dữ liệu từ form gửi lên
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'author_id' => 'required|exists:authors,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Tối đa 2MB
        ]);

        // Lưu dữ liệu vào CSDL thông qua Service
        $this->bookService->storeBook($validated, $request->file('image'));

        return redirect()->route('admin.books.index')->with('success', 'Thêm sách thành công!');
    }

    // Hiển thị form Sửa sách
    public function edit(Book $book)
    {
        $categories = Category::all();
        $authors = Author::all();
        
        return Inertia::render('Admin/Books/Edit', [
            'book' => $book,
            'categories' => $categories,
            'authors' => $authors
        ]);
    }

    // Xử lý cập nhật dữ liệu
    public function update(Request $request, Book $book)
    {
        $request->validate([
            'title' => 'required',
            'price' => 'required|numeric',
            // 'image' không được để 'required' ở đây vì khi edit khách có thể không đổi ảnh
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

        // Cập nhật thông qua Service
        $data = $request->only([
            'title', 'price', 'category_id', 'author_id', 'description', 'stock', 'discount_price'
        ]);
        
        $this->bookService->updateBook($book, $data, $request->file('image'));

        return redirect()->route('admin.books.index')->with('success', 'Cập nhật thành công!');
    }

    // Xử lý Xóa sách
    public function destroy(Book $book)
    {
        // Xóa sách qua Service (bao gồm xóa file ảnh)
        $this->bookService->deleteBook($book);

        return redirect()->route('admin.books.index')->with('success', 'Xóa sách thành công!');
    }
}

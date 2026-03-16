<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Storage;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Category;
use App\Models\Author;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    // Thêm hàm này vào trên cùng của class BookController
    public function index()
    {
        // Lấy sách, sắp xếp mới nhất lên đầu, kèm thông tin Category và Author, phân trang 10 cuốn/trang
        $books = Book::with(['category', 'author'])->latest()->paginate(10);

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
        // 1. Cập nhật validate, cho phép trường 'image' là file ảnh
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

        // 2. Xử lý Upload file ảnh
        if ($request->hasFile('image')) {
            // Hàm store() sẽ tự động tạo tên file ngẫu nhiên và lưu vào thư mục 'storage/app/public/books'
            $imagePath = $request->file('image')->store('books', 'public');
            
            // Cập nhật lại đường dẫn để lưu vào Database
            $validated['image'] = $imagePath; 
        }

        // 3. Lưu dữ liệu vào CSDL
        Book::create($validated);

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

    // 1. Giữ lại đường dẫn ảnh cũ làm mặc định
    $imagePath = $book->image;

    // 2. Chỉ khi người dùng chọn FILE MỚI thì mới xử lý upload và ghi đè biến $imagePath
    if ($request->hasFile('image')) {
        // (Tùy chọn) Xóa ảnh cũ trong thư mục storage để tránh rác server
        if ($book->image && file_exists(storage_path('app/public/' . $book->image))) {
            unlink(storage_path('app/public/' . $book->image));
        }

        // Lưu ảnh mới
        $imagePath = $request->file('image')->store('books', 'public');
    }

    // 3. Cập nhật vào database
    $book->update([
        'title' => $request->title,
        'price' => $request->price,
        'category_id' => $request->category_id,
        'author_id' => $request->author_id,
        'description' => $request->description,
        'image' => $imagePath, // Nếu không có file mới, $imagePath vẫn là giá trị cũ
    ]);

    return redirect()->route('admin.books.index')->with('success', 'Cập nhật thành công!');
}

    // Xử lý Xóa sách
    public function destroy(Book $book)
    {
        // Xóa ảnh vật lý khỏi ổ cứng trước
        if ($book->image) {
            Storage::disk('public')->delete($book->image);
        }
        
        // Xóa dữ liệu trong DB
        $book->delete();

        return redirect()->route('admin.books.index')->with('success', 'Xóa sách thành công!');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        // Lấy toàn bộ sách, kèm theo thông tin thể loại và tác giả
        $books = Book::with(['category', 'author'])->latest()->get();

        // Trả về file giao diện React kèm dữ liệu
        return Inertia::render('Home/Index', [
            'books' => $books
        ]);
    }
}
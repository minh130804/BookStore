<?php

namespace App\Http\Controllers;

use App\Services\BookService;
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
        // Lấy toàn bộ sách, kèm theo thông tin thể loại và tác giả từ Service
        $books = $this->bookService->getLatestWithRelations();

        // Trả về file giao diện React kèm dữ liệu
        return Inertia::render('Home/Index', [
            'books' => $books
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Services\BookService;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;    
use Inertia\Inertia;

class HomeController extends Controller
{
    protected $bookService;
    protected $cartService;

    public function __construct(BookService $bookService, CartService $cartService)
    {
        $this->bookService = $bookService;
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category']);
        $books = $this->bookService->searchAndPaginateHomeBooks($filters);
        
        $categories = Category::all();
        $cart = Auth::check() ? $this->cartService->getCartForUser(Auth::id()) : null;

        return Inertia::render('Home/Index', [
            'books' => $books, 
            'categories' => $categories, 
            'cart' => $cart,
            'filters' => $filters 
        ]);
    }

    public function show(Book $book)
    {
        $book = $this->bookService->getBookDetails($book);
        $relatedBooks = $this->bookService->getRelatedBooks($book, 4);
        $cart = Auth::check() ? $this->cartService->getCartForUser(Auth::id()) : null;

        return Inertia::render('Home/Show', [
            'book' => $book,
            'relatedBooks' => $relatedBooks,
            'cart' => $cart
        ]);
    }
}

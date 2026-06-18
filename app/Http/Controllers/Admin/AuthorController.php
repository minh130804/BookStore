<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Services\AuthorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller
{
    protected $authorService;

    public function __construct(AuthorService $authorService)
    {
        $this->authorService = $authorService;
    }

    public function index()
    {
        $authors = $this->authorService->getPaginatedAuthors(10);
        return Inertia::render('Admin/Authors/Index', ['authors' => $authors]);
    }

    public function create()
    {
        return Inertia::render('Admin/Authors/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $this->authorService->storeAuthor($validated);
        return redirect()->route('admin.authors.index')->with('success', 'Thêm tác giả thành công!');
    }

    public function edit(Author $author)
    {
        return Inertia::render('Admin/Authors/Edit', ['author' => $author]);
    }

    public function update(Request $request, Author $author)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $this->authorService->updateAuthor($author, $validated);
        return redirect()->route('admin.authors.index')->with('success', 'Cập nhật tác giả thành công!');
    }

    public function destroy(Author $author)
    {
        $this->authorService->deleteAuthor($author);
        return redirect()->route('admin.authors.index')->with('success', 'Xóa tác giả thành công!');
    }
}

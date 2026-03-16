<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index()
    {
        $authors = Author::latest()->paginate(10);
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

        Author::create($validated);
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

        $author->update($validated);
        return redirect()->route('admin.authors.index')->with('success', 'Cập nhật tác giả thành công!');
    }

    public function destroy(Author $author)
    {
        $author->delete();
        return redirect()->route('admin.authors.index')->with('success', 'Xóa tác giả thành công!');
    }
}

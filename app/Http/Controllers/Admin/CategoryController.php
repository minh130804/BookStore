<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $categories = $this->categoryService->getPaginatedCategories(10);
        return Inertia::render('Admin/Categories/Index', ['categories' => $categories]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $this->categoryService->storeCategory($validated);
        return redirect()->route('admin.categories.index')->with('success', 'Thêm thể loại thành công!');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', ['category' => $category]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $this->categoryService->updateCategory($category, $validated);
        return redirect()->route('admin.categories.index')->with('success', 'Cập nhật thể loại thành công!');
    }

    public function destroy(Category $category)
    {
        $this->categoryService->deleteCategory($category);
        return redirect()->route('admin.categories.index')->with('success', 'Xóa thể loại thành công!');
    }
}

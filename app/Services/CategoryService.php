<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    /**
     * Get paginated category list.
     */
    public function getPaginatedCategories(int $perPage = 10)
    {
        return Category::latest()->paginate($perPage);
    }

    /**
     * Create a category.
     */
    public function storeCategory(array $data)
    {
        return Category::create($data);
    }

    /**
     * Update a category.
     */
    public function updateCategory(Category $category, array $data)
    {
        return $category->update($data);
    }

    /**
     * Delete a category.
     */
    public function deleteCategory(Category $category)
    {
        return $category->delete();
    }
}

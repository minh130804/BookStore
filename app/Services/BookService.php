<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Support\Facades\Storage;

class BookService
{
    /**
     * Get all books with category and author, latest first.
     */
    public function getLatestWithRelations()
    {
        return Book::with(['category', 'author'])->latest()->get();
    }

    /**
     * Search, filter by category, and paginate books for the home page.
     */
    public function searchAndPaginateHomeBooks(array $filters)
    {
        $query = Book::with(['category', 'author'])->latest();
        
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhereHas('author', function($q2) use ($search) {
                      $q2->where('name', 'like', '%' . $search . '%');
                  });
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }
        
        return $query->paginate(12)->withQueryString();
    }

    /**
     * Load category and author relations for a specific book.
     */
    public function getBookDetails(Book $book)
    {
        $book->load(['category', 'author']);
        return $book;
    }

    /**
     * Get related books of the same category (excluding the current book).
     */
    public function getRelatedBooks(Book $book, int $limit = 4)
    {
        return Book::with(['author'])
            ->where('category_id', $book->category_id)
            ->where('id', '!=', $book->id)
            ->inRandomOrder()
            ->take($limit)
            ->get();
    }

    /**
     * Get paginated books for admin.
     */
    public function getPaginatedBooksForAdmin(int $perPage = 10)
    {
        return Book::with(['category', 'author'])->latest()->paginate($perPage);
    }

    /**
     * Create a new book, handling image upload if provided.
     */
    public function storeBook(array $data, $imageFile = null)
    {
        if ($imageFile) {
            $imagePath = $imageFile->store('books', 'public');
            $data['image'] = $imagePath;
        }
        return Book::create($data);
    }

    /**
     * Update an existing book, replacing old image file if new one is provided.
     */
    public function updateBook(Book $book, array $data, $imageFile = null)
    {
        $imagePath = $book->image;

        if ($imageFile) {
            if ($book->image && file_exists(storage_path('app/public/' . $book->image))) {
                unlink(storage_path('app/public/' . $book->image));
            }
            $imagePath = $imageFile->store('books', 'public');
        }

        $book->update([
            'title' => $data['title'] ?? $book->title,
            'price' => $data['price'] ?? $book->price,
            'category_id' => $data['category_id'] ?? $book->category_id,
            'author_id' => $data['author_id'] ?? $book->author_id,
            'description' => $data['description'] ?? $book->description,
            'image' => $imagePath,
            'stock' => $data['stock'] ?? $book->stock,
            'discount_price' => $data['discount_price'] ?? $book->discount_price,
        ]);

        return $book;
    }

    /**
     * Delete a book and its associated image from physical storage.
     */
    public function deleteBook(Book $book)
    {
        if ($book->image) {
            Storage::disk('public')->delete($book->image);
        }
        return $book->delete();
    }
}

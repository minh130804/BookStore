<?php

namespace App\Services;

use App\Models\Author;

class AuthorService
{
    /**
     * Get paginated author list.
     */
    public function getPaginatedAuthors(int $perPage = 10)
    {
        return Author::latest()->paginate($perPage);
    }

    /**
     * Create an author.
     */
    public function storeAuthor(array $data)
    {
        return Author::create($data);
    }

    /**
     * Update an author.
     */
    public function updateAuthor(Author $author, array $data)
    {
        return $author->update($data);
    }

    /**
     * Delete an author.
     */
    public function deleteAuthor(Author $author)
    {
        return $author->delete();
    }
}

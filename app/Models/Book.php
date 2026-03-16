<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'image', 'description', 'price', 'discount_price', 'stock', 'category_id', 'author_id'
    ];

    // Khai báo mối quan hệ N-1 với Category
    public function category() {
        return $this->belongsTo(Category::class);
    }

    // Khai báo mối quan hệ N-1 với Author
    public function author() {
        return $this->belongsTo(Author::class);
    }
}

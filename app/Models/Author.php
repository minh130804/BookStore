<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Author extends Model
{
    use HasFactory;

    // Cấp phép lưu tự động cho tên và tiểu sử tác giả
    protected $fillable = [
        'name', 
        'bio'
    ];
}

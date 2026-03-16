<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('books', function (Blueprint $table) {
        $table->id();
        $table->string('title'); // Tiêu đề sách
        $table->string('image')->nullable(); // Ảnh bìa sách
        $table->longText('description')->nullable(); // Mô tả tóm tắt nội dung
        $table->decimal('price', 15, 2); // Giá bán
        $table->decimal('discount_price', 15, 2)->nullable(); // Giảm giá
        $table->integer('stock')->default(0); // Số lượng tồn kho
        
        // Khóa ngoại
        $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
        $table->foreignId('author_id')->constrained('authors')->onDelete('cascade');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};

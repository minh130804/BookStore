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
    // Bảng lưu thông tin chung của đơn hàng
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('customer_name'); // Họ tên người nhận
        $table->string('customer_phone', 20); // Số điện thoại giao hàng
        $table->text('customer_address'); // Địa chỉ giao hàng
        $table->decimal('total_price', 15, 2); // Tổng tiền
        $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending'); // Trạng thái đơn
        $table->timestamps();
    });

    // Bảng lưu chi tiết từng cuốn sách trong đơn hàng
    Schema::create('order_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
        $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
        $table->integer('quantity'); // Số lượng đặt
        $table->decimal('price', 15, 2); // Giá tiền tại thời điểm mua
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders_tables');
    }
};

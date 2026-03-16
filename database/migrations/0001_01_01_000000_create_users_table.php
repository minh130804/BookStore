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
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // Họ và tên
        $table->string('username')->unique(); // Tên tài khoản đăng nhập
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password'); // Mật khẩu
        $table->string('phone', 20)->nullable(); // Số điện thoại
        $table->text('address')->nullable(); // Địa chỉ
        $table->enum('role', ['admin', 'user'])->default('user'); // Phân quyền
        $table->rememberToken();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

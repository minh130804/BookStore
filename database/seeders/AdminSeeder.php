<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Tài khoản Admin mặc định
        User::updateOrCreate(
            ['email' => 'admin@bookstore.com'], 
            [
                'username' => 'admin_master', // <-- THÊM TRƯỜNG NÀY
                'name' => 'Quản trị viên Hệ thống',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        
        User::updateOrCreate(
            ['email' => 'minh@bookstore.com'], 
            [
                'username' => 'lequangminh', // <-- THÊM TRƯỜNG NÀY
                'name' => 'Lê Quang Minh', 
                'password' => Hash::make('12345678'),
                'role' => 'admin', 
                'email_verified_at' => now(),
            ]
        );
        
        $this->command->info('Hệ thống đã cập nhật 2 tài khoản Admin thành công!');
    }
}
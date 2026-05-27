<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Tối ưu hóa: Nhận diện tự động qua Load Balancer
        // Nếu tín hiệu ngầm báo đây là HTTPS (trên Server), tự động ép link HTTPS
        // Nếu chạy ở máy tính (Local), lệnh này sẽ bị bỏ qua -> Giữ nguyên HTTP
        if (request()->header('x-forwarded-proto') === 'https') {
            URL::forceScheme('https');
        }
    }
}
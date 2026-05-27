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

        // Lấy tên miền hiện tại đang truy cập
        $host = request()->getHost();

        // Nếu tên miền KHÔNG PHẢI là máy tính cá nhân (localhost / 127.0.0.1)
        // Thì chắc chắn đang ở trên mây -> Ép toàn bộ sang HTTPS
        if ($host !== 'localhost' && $host !== '127.0.0.1') {
            URL::forceScheme('https');
        }
    }
}
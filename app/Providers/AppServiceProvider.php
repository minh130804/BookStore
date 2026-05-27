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

        // Local có APP_URL là http://localhost:8000 -> Bỏ qua
        // Server có APP_URL là https://bookstorehaiha.io.vn -> Kích hoạt ép HTTPS
        if (str_starts_with(config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }
    }
}
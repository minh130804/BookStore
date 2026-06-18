<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    protected $adminAuthService;

    public function __construct(AdminAuthService $adminAuthService)
    {
        $this->adminAuthService = $adminAuthService;
    }

    public function create()
    {
        // Kiểm tra cổng admin qua Service
        if ($this->adminAuthService->isAdminLoggedIn()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Auth/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Đăng nhập qua cổng admin thông qua Service
        $result = $this->adminAuthService->login($credentials, $request);

        if ($result['success']) {
            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors(['email' => $result['error']]);
    }

    public function destroy(Request $request)
    {
        $this->adminAuthService->logout();
        // Không dùng invalidate() ở đây để tránh làm mất session của Khách hàng đang mua sắm
        return redirect('/admin/login');
    }
}
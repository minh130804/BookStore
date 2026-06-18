<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

class AdminAuthService
{
    /**
     * Check if admin user is currently logged in.
     */
    public function isAdminLoggedIn()
    {
        return Auth::guard('admin')->check() && Auth::guard('admin')->user()->role === 'admin';
    }

    /**
     * Attempt login, verifying admin guard and admin role, and regenerating session.
     */
    public function login(array $credentials, $request)
    {
        if (Auth::guard('admin')->attempt($credentials)) {
            if (Auth::guard('admin')->user()->role === 'admin') {
                $request->session()->regenerate();
                return [
                    'success' => true
                ];
            } else {
                Auth::guard('admin')->logout();
                return [
                    'success' => false,
                    'error' => 'Tài khoản này không có quyền quản trị!'
                ];
            }
        }

        return [
            'success' => false,
            'error' => 'Email hoặc mật khẩu không chính xác.'
        ];
    }

    /**
     * Log out admin user.
     */
    public function logout()
    {
        Auth::guard('admin')->logout();
    }
}

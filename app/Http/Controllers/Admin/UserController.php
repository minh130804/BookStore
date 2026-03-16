<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Lấy danh sách tài khoản, phân trang 10 người/trang
        $users = User::latest()->paginate(10);
        return Inertia::render('Admin/Users/Index', ['users' => $users]);
    }

    public function destroy(User $user)
    {
        // Không cho phép admin tự xóa chính mình
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Bạn không thể tự xóa tài khoản của mình!');
        }

        $user->delete();
        return back()->with('success', 'Đã xóa tài khoản thành công!');
    }
}

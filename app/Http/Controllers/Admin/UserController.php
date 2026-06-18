<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        // Lấy danh sách tài khoản từ Service, phân trang 10 người/trang
        $users = $this->userService->getPaginatedUsers(10);
        return Inertia::render('Admin/Users/Index', ['users' => $users]);
    }

    public function destroy(User $user)
    {
        $result = $this->userService->deleteUser($user, auth()->id());

        if ($result['success']) {
            return back()->with('success', 'Đã xóa tài khoản thành công!');
        }

        return back()->with('error', $result['error']);
    }
}

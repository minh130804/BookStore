<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    /**
     * Get paginated user list.
     */
    public function getPaginatedUsers(int $perPage = 10)
    {
        return User::latest()->paginate($perPage);
    }

    /**
     * Delete user account, protecting against self-deletion.
     */
    public function deleteUser(User $user, int $currentUserId)
    {
        if ($user->id === $currentUserId) {
            return [
                'success' => false,
                'error' => 'Bạn không thể tự xóa tài khoản của mình!'
            ];
        }

        $user->delete();

        return [
            'success' => true
        ];
    }
}

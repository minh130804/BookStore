import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ users }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AdminLayout>

        
            <Head title="Quản lý Tài khoản" />
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Danh sách Tài khoản Khách hàng</h1>

                {flash?.success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{flash.success}</div>}
                {flash?.error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{flash.error}</div>}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Tên & Username</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Vai trò</th>
                                <th className="py-3 px-4 text-center font-semibold text-gray-700">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{user.id}</td>
                                    <td className="py-3 px-4">
                                        <p className="font-bold text-gray-800">{user.name}</p>
                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline">Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ categories }) {
    const { flash } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa thể loại này? Các sách thuộc thể loại này cũng sẽ bị xóa theo!')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AdminLayout>

        
            <Head title="Quản lý Thể loại" />

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Danh sách Thể loại</h1>
                    <Link href="/admin/categories/create" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                        + Thêm thể loại
                    </Link>
                </div>

                {flash?.success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{flash.success}</div>}

                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
                            <th className="py-3 px-4 text-left font-semibold text-gray-700">Tên Thể loại</th>
                            <th className="py-3 px-4 text-left font-semibold text-gray-700">Mô tả</th>
                            <th className="py-3 px-4 text-center font-semibold text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.data.length === 0 ? (
                            <tr><td colSpan="4" className="py-6 text-center text-gray-500">Chưa có thể loại nào.</td></tr>
                        ) : (
                            categories.data.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">{category.id}</td>
                                    <td className="py-3 px-4 font-medium text-gray-800">{category.name}</td>
                                    <td className="py-3 px-4 text-gray-600">{category.description || 'N/A'}</td>
                                    <td className="py-3 px-4 text-center">
                                        <Link href={`/admin/categories/${category.id}/edit`} className="text-blue-500 mr-3 hover:underline">Sửa</Link>
                                        <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:underline">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
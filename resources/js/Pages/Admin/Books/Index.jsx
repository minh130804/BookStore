import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';


export default function Index({ books }) {
    const { flash } = usePage().props;
    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa cuốn sách này không?')) {
            router.delete(`/admin/books/${id}`);
        }
    };

    return (
        
        <AdminLayout>
            
            <Head title="Quản lý Sách - Admin" />

            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Danh sách Sách</h1>
                    <Link 
                        href="/admin/books/create" 
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                    >
                        + Thêm sách mới
                    </Link>
                </div>

                {/* Thông báo thành công nếu có (ví dụ khi vừa thêm/xóa xong chuyển về trang này) */}
                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-200 rounded-md">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Ảnh bìa</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Tên sách</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Thể loại</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Giá bán</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Tồn kho</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {books.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-6 text-center text-gray-500">
                                        Chưa có cuốn sách nào. Hãy thêm sách mới!
                                    </td>
                                </tr>
                            ) : (
                                books.data.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm text-gray-700">{book.id}</td>
                                        <td className="py-3 px-4">
                                            {book.image ? (
                                                <img 
                                                    // Laravel lưu đường dẫn dạng "books/tên-ảnh.jpg" trong DB, 
                                                    // ta cần thêm "/storage/" ở đầu để hiển thị ảnh
                                                    src={`/storage/${book.image}`} 
                                                    alt={book.title} 
                                                    className="w-16 h-20 object-cover rounded border"
                                                />
                                            ) : (
                                                <div className="w-16 h-20 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded border">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-gray-800">{book.title}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {book.category ? book.category.name : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-red-600 font-semibold">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{book.stock}</td>
                                        <td className="py-3 px-4 text-center">
        <Link href={`/admin/books/${book.id}/edit`} className="text-blue-500 hover:underline mr-3">
            Sửa
        </Link>
        <button onClick={() => handleDelete(book.id)} className="text-red-500 hover:underline">
            Xóa
        </button>
    </td>
                                    </tr> 
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang đơn giản (nếu số sách > 10 cuốn) */}
                {books.links && books.links.length > 3 && (
                    <div className="mt-4 flex justify-end">
                        {books.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`px-3 py-1 border mx-1 rounded text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            ></Link>
                        ))}
                    </div>
                )}
            </div>
        
        </AdminLayout>
    );
}
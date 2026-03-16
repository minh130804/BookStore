import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ book, categories, authors }) {
    // Nếu sách đã có ảnh, hiển thị ảnh đó làm preview mặc định
    const [preview, setPreview] = useState(book.image ? `/storage/${book.image}` : null);

    // Điền sẵn dữ liệu cũ của sách vào form
    const { data, setData, post, processing, errors } = useForm({
        title: book.title || '',
        price: book.price || '',
        discount_price: book.discount_price || '',
        stock: book.stock || '',
        description: book.description || '',
        category_id: book.category_id || '',
        author_id: book.author_id || '',
        image: null, // Chỉ chứa dữ liệu nếu người dùng chọn ảnh MỚI
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(book.image ? `/storage/${book.image}` : null); // Quay về ảnh cũ nếu hủy chọn
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Gửi request POST đến route update
        post(`/admin/books/${book.id}`);
    };

    return (
        <AdminLayout>

        
            <Head title={`Sửa sách: ${book.title}`} />

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Cập nhật Sách</h1>
                    <Link href="/admin/books" className="text-gray-500 hover:text-gray-700 underline">
                        &larr; Quay lại danh sách
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                    {/* Tên sách */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên sách</label>
                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                               className="block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                        {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Giá, Khuyến mãi, Tồn kho */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Giá bán</label>
                            <input type="number" value={data.price} onChange={e => setData('price', e.target.value)}
                                   className="block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                            {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Giá khuyến mãi</label>
                            <input type="number" value={data.discount_price} onChange={e => setData('discount_price', e.target.value)}
                                   className="block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tồn kho</label>
                            <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)}
                                   className="block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thể loại & Tác giả */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Thể loại</label>
                            <select value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                <option value="">-- Chọn thể loại --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tác giả</label>
                            <select value={data.author_id} onChange={e => setData('author_id', e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                <option value="">-- Chọn tác giả --</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
                        <textarea rows="4" value={data.description} onChange={e => setData('description', e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"></textarea>
                    </div>

                    {/* Ảnh bìa */}
                    <div className="bg-gray-50 p-4 border rounded-md">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Thay đổi ảnh bìa (bỏ trống nếu muốn giữ nguyên ảnh cũ)</label>
                        <input type="file" accept="image/*" onChange={handleImageChange}
                               className="block w-full border border-gray-300 p-2 rounded-md bg-white" />
                        
                        {preview && (
                            <div className="mt-4 inline-block">
                                <img src={preview} alt="Preview" className="h-48 w-auto object-cover rounded border" />
                            </div>
                        )}
                    </div>

                    {/* Nút Submit */}
                    <div className="mt-8 pt-4 border-t flex justify-end">
                        <button type="submit" disabled={processing}
                                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'Đang lưu...' : 'Cập nhật Sách'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ categories, authors }) {
    // Lấy thông báo từ backend (nếu có)
    const { flash } = usePage().props;
    
    // State để lưu trữ đường dẫn ảnh xem trước
    const [preview, setPreview] = useState(null);

    // Khởi tạo form với các trường dữ liệu
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        price: '',
        discount_price: '',
        stock: '',
        description: '',
        category_id: '',
        author_id: '',
        image: null,
    });

    // Xử lý khi người dùng chọn file ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        
        // Tạo URL ảo để hiển thị ảnh ngay lập tức
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    // Xử lý gửi form
    const submit = (e) => {
        e.preventDefault();
        post('/admin/books', {
            onSuccess: () => {
                reset(); // Xóa trắng form
                setPreview(null); // Xóa ảnh xem trước
            },
        });
    };

    return (
        <AdminLayout>

        
            <Head title="Thêm sách mới - Admin" />

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Thêm Sách Mới</h1>

                {/* Thông báo thành công */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 border border-green-200 rounded-md">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                    {/* Tên sách */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên sách <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={data.title} 
                            onChange={e => setData('title', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200" 
                            placeholder="Nhập tên sách..."
                        />
                        {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Giá bán */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                            <input 
                                type="number" 
                                value={data.price} 
                                onChange={e => setData('price', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200" 
                            />
                            {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                        </div>

                        {/* Giá khuyến mãi */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Giá khuyến mãi (VNĐ)</label>
                            <input 
                                type="number" 
                                value={data.discount_price} 
                                onChange={e => setData('discount_price', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200" 
                            />
                            {errors.discount_price && <div className="text-red-500 text-sm mt-1">{errors.discount_price}</div>}
                        </div>

                        {/* Tồn kho */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Số lượng tồn kho <span className="text-red-500">*</span></label>
                            <input 
                                type="number" 
                                value={data.stock} 
                                onChange={e => setData('stock', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200" 
                            />
                            {errors.stock && <div className="text-red-500 text-sm mt-1">{errors.stock}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thể loại */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Thể loại <span className="text-red-500">*</span></label>
                            <select 
                                value={data.category_id} 
                                onChange={e => setData('category_id', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                            >
                                <option value="">-- Chọn thể loại --</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
                        </div>

                        {/* Tác giả */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Tác giả <span className="text-red-500">*</span></label>
                            <select 
                                value={data.author_id} 
                                onChange={e => setData('author_id', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                            >
                                <option value="">-- Chọn tác giả --</option>
                                {authors.map(author => (
                                    <option key={author.id} value={author.id}>{author.name}</option>
                                ))}
                            </select>
                            {errors.author_id && <div className="text-red-500 text-sm mt-1">{errors.author_id}</div>}
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả nội dung sách</label>
                        <textarea 
                            rows="4"
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200" 
                            placeholder="Nhập giới thiệu tóm tắt về cuốn sách..."
                        ></textarea>
                        {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                    </div>

                    {/* Upload Ảnh Bìa */}
                    <div className="bg-gray-50 p-4 border rounded-md">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh bìa sách</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-600
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-md file:border-0
                                      file:text-sm file:font-medium
                                      file:bg-blue-100 file:text-blue-700
                                      hover:file:bg-blue-200 border border-gray-300 p-2 rounded-md bg-white cursor-pointer" 
                        />
                        {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                        
                        {/* Khung hiển thị ảnh xem trước */}
                        {preview && (
                            <div className="mt-4 p-2 bg-white border rounded shadow-sm inline-block">
                                <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Ảnh xem trước:</p>
                                <img src={preview} alt="Preview" className="h-48 w-auto object-cover rounded border border-gray-200" />
                            </div>
                        )}
                    </div>

                    {/* Nút Submit */}
                    <div className="mt-8 pt-4 border-t flex justify-end">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md shadow hover:bg-blue-700 transition duration-150 disabled:opacity-50"
                        >
                            {processing ? 'Đang lưu...' : 'Lưu Sách'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
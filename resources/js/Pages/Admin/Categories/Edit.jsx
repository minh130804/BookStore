import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ category }) {
    // Điền sẵn dữ liệu cũ của category vào form
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        description: category.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Gửi request PUT lên server để cập nhật
        put(`/admin/categories/${category.id}`);
    }; 

    return (
        <AdminLayout>
            <Head title={`Sửa Thể loại: ${category.name}`} />
            
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Sửa Thể loại</h1>
                    <Link href="/admin/categories" className="text-gray-500 hover:underline">
                        &larr; Quay lại danh sách
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Tên thể loại */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Tên thể loại <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            value={data.name} 
                            onChange={e => setData('name', e.target.value)}
                            className="w-full rounded border-gray-300 p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200" 
                        />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">Mô tả</label>
                        <textarea 
                            rows="4" 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)}
                            className="w-full rounded border-gray-300 p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200"
                        ></textarea>
                    </div>

                    {/* Nút Cập nhật */}
                    <div className="mt-6">
                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Đang cập nhật...' : 'Cập nhật Thể loại'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
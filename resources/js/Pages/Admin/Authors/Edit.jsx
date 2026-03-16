import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ author }) {
    const { data, setData, put, processing, errors } = useForm({
        name: author.name || '',
        bio: author.bio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/authors/${author.id}`);
    };

    return (
        <AdminLayout>

        
            <Head title={`Sửa Tác giả: ${author.name}`} />
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Sửa Tác giả</h1>
                    <Link href="/admin/authors" className="text-gray-500 hover:underline">&larr; Quay lại</Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Tên tác giả <span className="text-red-500">*</span></label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                               className="w-full rounded border-gray-300 p-2 border" />
                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">Tiểu sử</label>
                        <textarea rows="4" value={data.bio} onChange={e => setData('bio', e.target.value)}
                                  className="w-full rounded border-gray-300 p-2 border"></textarea>
                    </div>

                    <button type="submit" disabled={processing} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        Cập nhật Tác giả
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
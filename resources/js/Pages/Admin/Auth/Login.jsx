import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <Head title="Đăng nhập Quản trị" />

            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-blue-600">ADMIN<span className="text-gray-900">PANEL</span></h1>
                    <p className="text-gray-500 mt-2">Đăng nhập hệ thống quản trị BookStore</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Quản trị</label>
                        <input 
                            type="email" 
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500" 
                            required 
                        />
                        {errors.email && <div className="text-red-500 text-sm mt-1 font-medium">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                        <input 
                            type="password" 
                            value={data.password} 
                            onChange={e => setData('password', e.target.value)}
                            className="w-full rounded-md border-gray-300 p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500" 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
                    >
                        {processing ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}
                    </button>
                    
                    <div className="text-center mt-4">
                        <a href="/" className="text-sm text-gray-500 hover:underline">&larr; Quay lại trang khách hàng</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
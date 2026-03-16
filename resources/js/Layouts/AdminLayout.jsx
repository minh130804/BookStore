import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;

    // Danh sách các menu chức năng
    const menuItems = [
        { name: 'Bảng điều khiển', link: '/admin', icon: '📊' },
        { name: 'Quản lý Đơn hàng', link: '/admin/orders', icon: '🛒' },
        { name: 'Quản lý Sách', link: '/admin/books', icon: '📚' },
        { name: 'Quản lý Thể loại', link: '/admin/categories', icon: '📑' },
        { name: 'Quản lý Tác giả', link: '/admin/authors', icon: '✍️' },
        { name: 'Quản lý Tài khoản', link: '/admin/users', icon: '👥' },
    ];

    // Lấy URL hiện tại để bôi đậm menu đang chọn
    const currentPath = window.location.pathname;

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* THANH SIDEBAR BÊN TRÁI - TÔNG MÀU XANH DƯƠNG */}
            <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-xl z-20 transition-all duration-300">
                {/* Logo AdminPanel */}
                <div className="h-16 flex items-center justify-center border-b border-blue-800 bg-blue-950">
                    <h1 className="text-2xl font-black text-white tracking-wider">
                        ADMIN<span className="text-blue-300">PANEL</span>
                    </h1>
                </div>
                
                {/* Menu Nav */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map(item => {
                        // Logic xác định menu đang active
                        const isActive = currentPath === item.link || currentPath.startsWith(item.link + '/');
                        return (
                            <Link 
                                key={item.name} 
                                href={item.link} 
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-semibold">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Thông tin Admin ở dưới cùng */}
                <div className="p-4 border-t border-blue-800 bg-blue-950 text-sm">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-blue-300 shadow-sm">
                            {auth?.admin?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-white truncate">{auth?.admin?.name || 'Admin'}</p>
                            <p className="text-xs text-blue-200 truncate">Quản trị viên</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* KHU VỰC NỘI DUNG BÊN PHẢI */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Thanh Topbar */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Hệ thống Quản lý BookStore</h2>
                    
                    <div className="flex items-center space-x-6">
                       
                        
                        <div className="h-6 w-px bg-gray-300"></div>

                        {/* Nút Đăng xuất (Đã chỉnh sang đường dẫn tĩnh cho an toàn) */}
                        <Link 
                            href="/admin/logout" 
                            method="post" 
                            as="button" 
                            className="bg-red-50 text-red-600 px-5 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-colors shadow-sm"
                        >
                            Đăng xuất
                        </Link>
                    </div>
                </header>

                {/* Phần nội dung chính (Đổ dữ liệu từ các trang con vào đây) */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
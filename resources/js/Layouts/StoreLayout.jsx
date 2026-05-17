import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function StoreLayout({ children, cart, filters }) {

    const { auth, flash, categories } = usePage().props;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/', { search: searchTerm }, { preserveState: true });
    };

    const handleDelete = (itemId) => {
        if (confirm('Bỏ cuốn sách này khỏi giỏ hàng?')) {
            router.delete(`/cart/${itemId}`, { preserveScroll: true });
        }
    };

    const totalItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    const totalAmount = cart?.items?.reduce((total, item) => total + ((item.book.discount_price || item.book.price) * item.quantity), 0) || 0;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* HEADER */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-20 flex items-center justify-between">
                        {/* Logo & Menu */}
                        <div className="flex items-center space-x-10">
                            <Link href="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter">
                                Book<span className="text-gray-900">Store</span>.
                            </Link>
                            <nav className="hidden md:flex space-x-8 items-center z-50">
                                <Link href="/" className="text-gray-900 font-bold hover:text-blue-600 transition">Trang chủ</Link>

                                {/* Nút Danh mục (Dropdown) */}
                                <div className="relative group">
                                    <button className="text-gray-900 font-bold hover:text-blue-600 transition flex items-center py-8">
                                        Danh mục
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 mt-0.5 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>

                                    {/* Khung xổ xuống (Bình thường tàng hình, di chuột vào sẽ hiện) */}
                                    <div className="absolute left-0 top-full w-64 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                                        <div className="py-2">
                                            <Link href="/" className="block px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors border-b border-gray-50">
                                                Tất cả sách
                                            </Link>
                                            {/* Render động danh sách từ CSDL */}
                                            {categories && categories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/?category=${category.id}`}
                                                    className="block px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Link href="/gioi-thieu" className="text-gray-900 font-bold hover:text-blue-600 transition">Giới thiệu</Link>
                            </nav>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex items-center space-x-6">
                            <form onSubmit={handleSearch} className="hidden lg:block relative">
                                <input
                                    type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm sách, tác giả..."
                                    className="bg-gray-100 border-transparent rounded-full px-5 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-72 text-sm transition-all"
                                />
                                <button type="submit" className="absolute right-4 top-3 text-gray-400 hover:text-blue-600">🔍</button>
                            </form>

                            {/* User Menu - Đã sửa thành chữ rõ ràng */}
                            {auth.user ? (
                                <div className="hidden md:flex items-center space-x-4">
                                    <div className="text-sm text-right">
                                        <p className="text-gray-500 text-xs">Xin chào,</p>
                                        <p className="font-bold text-gray-800">{auth.user.name}</p>
                                    </div>

                                    <div className="h-6 w-px bg-gray-300"></div>

                                    {/* NÚT XEM PROFILE MỚI THÊM VÀO ĐÂY */}
                                    <Link href={route('profile.edit')} className="text-sm font-bold text-gray-700 hover:text-blue-600 transition">
                                        Xem Profile
                                    </Link>

                                    <Link href="/my-orders" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                                        Đơn hàng của tôi
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="text-sm font-bold text-red-500 hover:text-red-700 transition">
                                        Đăng xuất
                                    </Link>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center space-x-3">
                                    <Link href="/login" className="text-gray-700 font-bold hover:text-blue-600">Đăng nhập</Link>
                                    <Link href="/register" className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-gray-800 transition shadow-md">Đăng ký</Link>
                                </div>
                            )}

                            {/* Nút Giỏ hàng Mini Cart */}
                            <div className="relative">
                                <button onClick={() => setIsCartOpen(!isCartOpen)} className="text-gray-700 hover:text-blue-600 relative p-2 bg-gray-100 rounded-full transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                                            {totalItems}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown Giỏ hàng */}
                                {isCartOpen && (
                                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                        <div className="bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                                            <h3 className="font-bold text-gray-800">Giỏ hàng ({totalItems})</h3>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {!cart || cart.items.length === 0 ? (
                                                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                                    <span className="text-4xl mb-2">🛒</span>
                                                    <p>Giỏ hàng trống.</p>
                                                </div>
                                            ) : (
                                                <ul className="divide-y divide-gray-50">
                                                    {cart.items.map((item) => (
                                                        <li key={item.id} className="p-4 hover:bg-gray-50 transition relative group flex items-start">
                                                            <img src={item.book.image ? `/storage/${item.book.image}` : ''} alt={item.book.title} className="w-14 h-20 object-cover rounded shadow-sm flex-shrink-0" />
                                                            <div className="ml-4 flex-1 pr-6">
                                                                <p className="text-sm font-bold text-gray-800 line-clamp-2">{item.book.title}</p>
                                                                <div className="flex justify-between mt-2 items-center">
                                                                    <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">x{item.quantity}</span>
                                                                    <span className="text-sm font-bold text-red-600">{formatPrice(item.book.discount_price || item.book.price)}</span>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => handleDelete(item.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors" title="Xóa">
                                                                ✖
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        {cart && cart.items.length > 0 && (
                                            <div className="p-5 bg-white border-t border-gray-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-gray-500 font-semibold">Tổng cộng:</span>
                                                    <span className="text-xl font-black text-red-600">{formatPrice(totalAmount)}</span>
                                                </div>
                                                <Link href="/cart" className="block w-full bg-blue-600 text-white text-center font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md">
                                                    Thanh toán ngay
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Thông báo Flash toàn cục */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg flex items-center shadow-sm">
                        <span className="mr-2">✅</span> {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-lg flex items-center shadow-sm">
                        <span className="mr-2">❌</span> {flash.error}
                    </div>
                </div>
            )}

            {/* PHẦN NỘI DUNG CHÍNH SẼ ĐƯỢC CHÈN VÀO ĐÂY */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-gray-300 py-16 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-3xl font-black text-white tracking-tighter mb-6 block">BookStore.</Link>
                        <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">Hệ thống phân phối sách trực tuyến hàng đầu. Chúng tôi cam kết mang đến những cuốn sách chất lượng nhất với giá thành hợp lý.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Về chúng tôi</h4>
                        <ul className="space-y-4">
                            <li><Link href="/gioi-thieu" className="hover:text-white transition">Giới thiệu BookStore</Link></li>
                            <li><Link href="#" className="hover:text-white transition">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ khách hàng</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center"><span className="mr-3 text-gray-500">📍</span> 123 Đường Tôn Đức Thắng, Hà Nội</li>
                            <li className="flex items-center"><span className="mr-3 text-gray-500">📞</span> 1900 1000</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
                    &copy; 2026 BookStore Team. All rights reserved.Hải Hà
                </div>
            </footer>
        </div>
    );
}
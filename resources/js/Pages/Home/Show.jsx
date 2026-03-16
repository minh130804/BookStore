import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';

export default function Show({ book, relatedBooks, cart }) {
    const { auth } = usePage().props;
    const [quantity, setQuantity] = useState(1);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleAddToCart = () => {
        if (!auth.user) {
            alert('Bạn cần đăng nhập để thêm vào giỏ hàng!');
            router.get('/login');
            return;
        }
        router.post('/cart/add', {
            book_id: book.id,
            quantity: quantity
        }, { preserveScroll: true });
    };

    return (
        <StoreLayout cart={cart}>
            <Head title={`${book.title} - BookStore`} />

            {/* Thanh điều hướng Breadcrumb */}
            <nav className="mb-8 text-sm font-medium text-gray-500">
                <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                <span className="mx-2">/</span>
                <Link href={`/?category=${book.category_id}`} className="hover:text-blue-600">{book.category?.name || 'Danh mục'}</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{book.title}</span>
            </nav>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Cột trái: Ảnh sách */}
                    <div className="bg-gray-50 p-10 flex items-center justify-center relative">
                        {book.discount_price && (
                            <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
                                Giảm {Math.round((1 - book.discount_price / book.price) * 100)}%
                            </div>
                        )}
                        {book.image ? (
                            <img src={`/storage/${book.image}`} alt={book.title} className="w-2/3 object-cover rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="text-gray-400">Không có ảnh</div>
                        )}
                    </div>

                    {/* Cột phải: Thông tin */}
                    <div className="p-10 md:p-12 flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{book.title}</h1>
                        
                        <div className="flex items-center space-x-4 mb-6 text-sm">
                            <p className="text-gray-600">Tác giả: <span className="font-bold text-gray-900">{book.author?.name || 'Đang cập nhật'}</span></p>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <p className="text-gray-600">Tình trạng: {book.stock > 0 ? <span className="font-bold text-green-600">Còn {book.stock} cuốn</span> : <span className="font-bold text-red-600">Hết hàng</span>}</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                            {book.discount_price ? (
                                <div className="flex items-end space-x-4">
                                    <span className="text-4xl font-black text-red-600">{formatPrice(book.discount_price)}</span>
                                    <span className="text-lg font-semibold text-gray-400 line-through mb-1">{formatPrice(book.price)}</span>
                                </div>
                            ) : (
                                <span className="text-4xl font-black text-red-600">{formatPrice(book.price)}</span>
                            )}
                        </div>

                        <div className="prose text-gray-600 mb-8 line-clamp-4">
                            <p>{book.description || 'Chưa có bài viết mô tả cho cuốn sách này.'}</p>
                        </div>

                        {book.stock > 0 && (
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <div className="flex items-center border-2 border-gray-200 rounded-full bg-white w-fit">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-5 py-3 text-gray-600 hover:text-blue-600 font-bold text-xl transition">-</button>
                                    <span className="px-4 font-bold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(q => Math.min(book.stock, q + 1))} className="px-5 py-3 text-gray-600 hover:text-blue-600 font-bold text-xl transition">+</button>
                                </div>
                                <button onClick={handleAddToCart} className="flex-1 bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    <span>Thêm vào giỏ hàng</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
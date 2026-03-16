import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';

export default function Index({ cart }) {
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleDelete = (itemId) => {
        if (confirm('Bạn có chắc chắn muốn bỏ cuốn sách này khỏi giỏ hàng?')) {
            router.delete(`/cart/${itemId}`, { preserveScroll: true });
        }
    };

    const totalAmount = cart?.items?.reduce((total, item) => total + ((item.book.discount_price || item.book.price) * item.quantity), 0) || 0;

    return (
        <StoreLayout cart={cart}>
            <Head title="Giỏ hàng của bạn - BookStore" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Giỏ hàng của bạn</h1>
                <p className="text-gray-500 mt-2">Đừng bỏ lỡ những cuốn sách tuyệt vời này!</p>
            </div>

            {!cart || cart.items.length === 0 ? (
                <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <span className="text-8xl block mb-6">🛒</span>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-gray-500 mb-8">Có vẻ như bạn chưa chọn cuốn sách nào. Hãy dạo một vòng cửa hàng nhé!</p>
                    <Link href="/" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 transition">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cột trái: Danh sách mặt hàng */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {cart.items.map((item) => (
                                    <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center sm:items-start relative group">
                                        <img 
                                            src={item.book.image ? `/storage/${item.book.image}` : ''} 
                                            alt={item.book.title} 
                                            className="w-24 h-36 object-cover rounded-lg shadow-md mb-4 sm:mb-0"
                                        />
                                        <div className="sm:ml-6 flex-1 text-center sm:text-left">
                                            <Link href={`/book/${item.book.id}`} className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                                                {item.book.title}
                                            </Link>
                                            <p className="text-red-600 font-black text-lg mt-2">
                                                {formatPrice(item.book.discount_price || item.book.price)}
                                            </p>
                                        </div>
                                        
                                        <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col items-center sm:items-end justify-between h-full">
                                            <div className="flex items-center border border-gray-200 rounded-full bg-gray-50 px-4 py-2">
                                                <span className="text-gray-500 text-sm mr-2">Số lượng:</span>
                                                <span className="font-bold text-gray-900">{item.quantity}</span>
                                            </div>
                                            <div className="mt-4 font-black text-xl text-gray-900">
                                                {formatPrice((item.book.discount_price || item.book.price) * item.quantity)}
                                            </div>
                                        </div>

                                        {/* Nút Xóa */}
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors bg-white p-2 rounded-full shadow-sm sm:shadow-none opacity-100 sm:opacity-0 group-hover:opacity-100"
                                            title="Xóa khỏi giỏ hàng"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Cột phải: Box Thanh toán */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>
                            <div className="space-y-4 mb-6 text-gray-600">
                                <div className="flex justify-between">
                                    <span>Tạm tính ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm)</span>
                                    <span className="font-semibold text-gray-900">{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí giao hàng</span>
                                    <span className="font-semibold text-green-600">Miễn phí</span>
                                </div>
                            </div>
                            <div className="border-t pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-900 font-bold">Tổng cộng</span>
                                    <span className="text-3xl font-black text-red-600">{formatPrice(totalAmount)}</span>
                                </div>
                                <p className="text-xs text-right text-gray-400 mt-1">(Đã bao gồm VAT)</p>
                            </div>
                            <Link href="/checkout" className="block w-full bg-blue-600 text-white text-center font-bold py-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all">
                                TIẾN HÀNH ĐẶT HÀNG
                            </Link>
                            <div className="mt-4 text-center">
                                <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline">
                                    &larr; Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StoreLayout>
    );
}
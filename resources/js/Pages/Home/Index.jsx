import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import GeminiChatbot from '@/Components/GeminiChatbot';

export default function Index({ books, cart, filters }) {
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // XỬ LÝ DỮ LIỆU AN TOÀN: Đảm bảo luôn lấy được mảng sản phẩm dù có phân trang hay không
    const bookList = books?.data || (Array.isArray(books) ? books : []);
    const totalBooks = books?.total || bookList.length;

    return (
        <StoreLayout cart={cart} filters={filters}>
            <Head title="Trang chủ - BookStore" />

            {!filters?.search && !filters?.category && (
                <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl mb-12 relative flex items-center min-h-[350px]">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-90"></div>
                    <div className="relative z-10 p-10 md:p-16 w-full md:w-2/3">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500 text-white text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">Siêu Khuyến Mãi</span>
                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                            Thế giới tri thức <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Nằm trong tay bạn</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-8 max-w-lg">Khám phá hàng ngàn tựa sách hấp dẫn với ưu đãi lên đến 50%. Giao hàng hỏa tốc toàn quốc.</p>
                        <button className="bg-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg">
                            Khám phá ngay
                        </button>
                    </div>
                    <div className="absolute right-10 bottom-0 hidden md:block opacity-80 text-[200px] leading-none transform rotate-12">
                        📚
                    </div>
                </div>
            )}

            <div className="w-full">
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-2xl font-black text-gray-900">
                        {filters?.search ? `Kết quả cho: "${filters.search}"` : (filters?.category ? 'Sách theo danh mục' : 'Sách Mới Cập Nhật')}
                    </h2>
                    {/* Sửa lại cách hiển thị tổng số lượng */}
                    <span className="text-sm font-bold text-gray-500">{totalBooks} Sản phẩm</span>
                </div>

                {/* Kiểm tra mảng bookList an toàn */}
                {bookList.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
                        <span className="text-6xl block mb-4">📭</span>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy cuốn sách nào</h3>
                        <p className="text-gray-500">Vui lòng thử lại với từ khóa hoặc chọn danh mục khác trên thanh menu.</p>
                    </div>
                ) : (
                    /* Để 4 cột (lg:grid-cols-4) cho cân đối với số lượng 8 hoặc 12 sản phẩm */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {bookList.map((book) => (
                            <Link href={`/book/${book.id}`} key={book.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
                                <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                    {book.image ? (
                                        <img src={`/storage/${book.image}`} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <span className="text-gray-400">Không có ảnh</span>
                                    )}
                                    {book.discount_price && (
                                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                                            -{Math.round((1 - book.discount_price / book.price) * 100)}%
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1 bg-white">
                                    <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide line-clamp-1">
                                        {book.category?.name || 'Chưa phân loại'}
                                    </p>
                                    <h3 className="text-md font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors" title={book.title}>
                                        {book.title}
                                    </h3>
                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <div>
                                            {book.discount_price ? (
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-red-600 leading-none mb-1">{formatPrice(book.discount_price)}</span>
                                                    <span className="text-xs font-semibold text-gray-400 line-through">{formatPrice(book.price)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-lg font-black text-red-600">{formatPrice(book.price)}</span>
                                            )}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Phân trang: Kiểm tra an toàn sự tồn tại của links */}
                {books?.links && books.links.length > 3 && (
                    <div className="mt-12 flex justify-center space-x-2">
                        {books.links.map((link, index) => (
                            <Link 
                                key={index} 
                                href={link.url || '#'} 
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${link.active ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'} ${!link.url && 'opacity-50 cursor-not-allowed'}`} 
                                dangerouslySetInnerHTML={{ __html: link.label }} 
                            />
                        ))}
                    </div>
                )}
            </div>
            <GeminiChatbot />
        </StoreLayout>
    ); 
}
import React from 'react';
import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ books, categories, cart, filters }) {
    return (
        <StoreLayout cart={cart} filters={filters}>
            <Head title="Tất cả sản phẩm" />
            
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Tất cả sản phẩm</h1>
                            <p className="text-gray-500 mt-2">Khám phá kho tàng tri thức của chúng tôi</p>
                        </div>
                        <span className="text-sm font-bold text-gray-400">Hiển thị {books.data.length} sản phẩm</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {books.data.map((book) => (
                            <div key={book.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100">
                                <Link href={`/books/${book.id}`}>
                                    <div className="aspect-[3/4] overflow-hidden bg-gray-200">
                                        <img 
                                            src={book.image ? `/storage/${book.image}` : '/images/default-book.jpg'} 
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </Link>
                                <div className="p-5">
                                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">{book.category?.name}</p>
                                    <Link href={`/books/${book.id}`}>
                                        <h3 className="font-bold text-gray-900 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">{book.title}</h3>
                                    </Link>
                                    <p className="text-sm text-gray-500 mb-4">{book.author?.name}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black text-red-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                                        </span>
                                        <Link href={`/books/${book.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Phân trang đơn giản */}
                    <div className="mt-16 flex justify-center gap-2">
                        {books.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
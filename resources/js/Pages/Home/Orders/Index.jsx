import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';

export default function Index({ orders, cart, filters }) {
    const { flash } = usePage().props;

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' - ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    // HÀM XỬ LÝ HỦY ĐƠN HÀNG
    const handleCancel = (orderId) => {
        if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
            router.put(`/my-orders/${orderId}/cancel`, {}, { preserveScroll: true });
        }
    };
    const canCancel = (dateString) => {
        const orderDate = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - orderDate) / (1000 * 60 * 60); // Đổi milliseconds ra giờ
        return diffInHours < 24;
    };

    // COMPONENT HIỂN THỊ TRẠNG THÁI
    const OrderStatus = ({ status }) => {
        const statusConfig = {
            'pending': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
            'processing': { label: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            'shipped': { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200' },
            'delivered': { label: 'Đã giao thành công', color: 'bg-green-100 text-green-700 border-green-200' },
            'cancelled': { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' },
        };
        const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
        
        return (
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${config.color}`}>
                {config.label}
            </span>
        );
    };

    return (
        <StoreLayout cart={cart} filters={filters}>
            <Head title="Lịch sử mua hàng - BookStore" />

            <div className="max-w-5xl mx-auto">
                {/* Tiêu đề trang */}
                <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Đơn hàng của tôi</h1>
                        <p className="text-gray-500 mt-2">Quản lý và theo dõi trạng thái các đơn hàng bạn đã đặt.</p>
                    </div>
                </div>

                {/* Hiển thị thông báo (Flash Message) */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center shadow-sm">
                        <span className="mr-2 text-xl">✅</span> <span className="font-semibold">{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center shadow-sm">
                        <span className="mr-2 text-xl">❌</span> <span className="font-semibold">{flash.error}</span>
                    </div>
                )}

                {/* Danh sách đơn hàng */}
                {orders.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
                        <span className="text-7xl block mb-6">📦</span>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Bạn chưa có đơn hàng nào</h3>
                        <p className="text-gray-500 mb-8">Hãy dạo quanh cửa hàng và chọn cho mình những cuốn sách thật hay nhé!</p>
                        <Link href="/" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 transition">
                            Khám phá sách ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                
                                {/* Header của thẻ Đơn hàng */}
                                <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mã đơn hàng</p>
                                            <p className="font-black text-blue-600 text-lg">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Ngày đặt</p>
                                            <p className="font-bold text-gray-800">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tổng tiền</p>
                                            <p className="font-black text-red-600">{formatPrice(order.total_price)}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end space-y-3">
                                        <OrderStatus status={order.status} />
                                        
                                        {/* NÚT HỦY ĐƠN HÀNG (Chỉ hiện khi đơn đang chờ xử lý) */}
                                        {order.status === 'pending' && (
                                            canCancel(order.created_at) ? (
                                                <button 
                                                    onClick={() => handleCancel(order.id)}
                                                    className="text-sm font-bold text-red-500 hover:text-red-700 hover:underline flex items-center"
                                                    title="Chỉ có thể hủy khi đơn hàng đang chờ xử lý và trong vòng 24h"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Hủy đơn hàng
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">
                                                    Đã quá 24h (Không thể tự hủy)
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                                
                                {/* Danh sách sách trong đơn hàng đó */}
                                <div className="p-6">
                                    <ul className="divide-y divide-gray-50">
                                        {order.items.map(item => (
                                            <li key={item.id} className="py-4 flex items-center group">
                                                <img 
                                                    src={item.book.image ? `/storage/${item.book.image}` : ''} 
                                                    alt={item.book.title} 
                                                    className="w-16 h-24 object-cover rounded-lg border border-gray-100 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform"
                                                />
                                                <div className="ml-6 flex-1">
                                                    <Link href={`/book/${item.book.id}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
                                                        {item.book.title}
                                                    </Link>
                                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                                        <span className="bg-gray-100 px-2 py-1 rounded font-semibold text-gray-700">Số lượng: {item.quantity}</span>
                                                        <span className="mx-3">•</span>
                                                        <span className="font-semibold">{formatPrice(item.price)} / cuốn</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 font-black text-gray-900 text-lg">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
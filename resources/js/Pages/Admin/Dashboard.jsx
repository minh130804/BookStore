import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats, recentOrders }) {
    // Hàm định dạng tiền tệ VNĐ
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Mảng cấu hình 4 thẻ thống kê
    const cards = [
        { title: 'Tổng Doanh Thu', icon: '💰', count: formatPrice(stats.totalRevenue), link: '/admin/orders', color: 'bg-green-500', text: 'Đã giao thành công' },
        { title: 'Tổng Đơn Hàng', icon: '🛒', count: stats.totalOrders, link: '/admin/orders', color: 'bg-blue-500', text: 'Đơn hàng trên hệ thống' },
        { title: 'Sách Trong Kho', icon: '📚', count: stats.totalBooks, link: '/admin/books', color: 'bg-purple-500', text: 'Đầu sách đang bán' },
        { title: 'Khách Hàng', icon: '👥', count: stats.totalUsers, link: '/admin/users', color: 'bg-orange-500', text: 'Tài khoản đăng ký' },
    ];

    // Badge hiển thị trạng thái đơn hàng (tái sử dụng)
    const OrderStatus = ({ status }) => {
        const statusConfig = {
            'pending': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' },
            'processing': { label: 'Đang chuẩn bị', color: 'bg-blue-100 text-blue-700' },
            'shipped': { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700' },
            'delivered': { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
            'cancelled': { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
        };
        const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
        
        return <span className={`px-2 py-1 text-xs font-bold rounded ${config.color}`}>{config.label}</span>;
    };

    return (
        <AdminLayout>
            <Head title="Bảng điều khiển - Admin" />
            
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-800">Bảng điều khiển</h1>
                <p className="text-gray-500 mt-2">Tổng quan tình hình hoạt động của cửa hàng BookStore.</p>
            </div>

            {/* 4 THẺ THỐNG KÊ (CARDS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <Link key={index} href={card.link} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex items-center border border-gray-100 group">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl ${card.color} group-hover:scale-110 transition-transform shadow-sm`}>
                            {card.icon}
                        </div>
                        <div className="ml-4">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{card.title}</h3>
                            <p className="text-2xl font-black text-gray-800 mt-1">{card.count}</p>
                            <p className="text-xs text-gray-400 mt-1">{card.text}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* BẢNG ĐƠN HÀNG MỚI NHẤT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Đơn hàng mới nhất</h2>
                    <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:text-blue-800">Xem tất cả &rarr;</Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-white border-b border-gray-100">
                            <tr>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Mã ĐH</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Khách hàng</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng tiền</th>
                                <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">Chưa có đơn hàng nào phát sinh.</td>
                                </tr>
                            ) : (
                                recentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-bold text-blue-600">#{order.id}</td>
                                        <td className="py-4 px-6">
                                            <p className="font-bold text-gray-800">{order.customer_name}</p>
                                            <p className="text-xs text-gray-400">{order.customer_phone}</p>
                                        </td>
                                        <td className="py-4 px-6 font-black text-gray-800">{formatPrice(order.total_price)}</td>
                                        <td className="py-4 px-6">
                                            <OrderStatus status={order.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
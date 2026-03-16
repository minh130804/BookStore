import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ orders }) {
    const { flash } = usePage().props;

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Hàm cập nhật trạng thái đơn hàng
    const handleStatusChange = (orderId, newStatus) => {
        router.put(`/admin/orders/${orderId}`, { status: newStatus }, { preserveScroll: true });
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
            router.delete(`/admin/orders/${id}`);
        }
    };

    return (
        <AdminLayout>
            
            <Head title="Quản lý Đơn hàng" />
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Danh sách Đơn hàng</h1>

                {flash?.success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{flash.success}</div>}

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Mã ĐH</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Khách hàng</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Chi tiết Sách</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Tổng tiền</th>
                                <th className="py-3 px-4 text-left font-semibold text-gray-700">Trạng thái</th>
                                <th className="py-3 px-4 text-center font-semibold text-gray-700">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.data.length === 0 ? (
                                <tr><td colSpan="6" className="py-6 text-center text-gray-500">Chưa có đơn hàng nào.</td></tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 font-bold text-blue-600">#{order.id}</td>
                                        <td className="py-3 px-4">
                                            <p className="font-bold text-gray-800">{order.customer_name}</p>
                                            <p className="text-sm text-gray-500">{order.customer_phone}</p>
                                            <p className="text-xs text-gray-400 w-48 truncate" title={order.customer_address}>{order.customer_address}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                                {order.items.map(item => (
                                                    <li key={item.id} className="truncate w-48" title={item.book.title}>
                                                        {item.book.title} (x{item.quantity})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-red-600">{formatPrice(order.total_price)}</td>
                                        <td className="py-3 px-4">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`text-sm font-bold rounded border-gray-300 shadow-sm focus:ring-blue-500 p-1 
                                                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                                    ${order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : ''}
                                                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                                                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                                                `}
                                            >
                                                <option value="pending">Chờ xử lý</option>
                                                <option value="processing">Đang chuẩn bị</option>
                                                <option value="shipped">Đang giao hàng</option>
                                                <option value="delivered">Đã giao thành công</option>
                                                <option value="cancelled">Đã hủy</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button onClick={() => handleDelete(order.id)} className="text-red-500 hover:underline">Xóa</button>
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
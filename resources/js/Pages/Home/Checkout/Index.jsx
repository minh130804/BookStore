import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';

export default function Checkout({ cart }) {
    // Inertia useForm giúp quản lý state và gửi dữ liệu lên server dễ dàng
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        payment_method: 'cod', // Mặc định là Thanh toán khi nhận hàng
    });

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const totalAmount = cart?.items?.reduce((total, item) => total + ((item.book.discount_price || item.book.price) * item.quantity), 0) || 0;

    const submit = (e) => {
        e.preventDefault();
        // Gửi dữ liệu lên route POST /checkout
        post('/checkout');
    };

    if (!cart || cart.items.length === 0) {
        return (
            <StoreLayout cart={cart}>
                <div className="max-w-3xl mx-auto text-center py-20">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h2>
                    <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold">Quay lại mua sắm</Link>
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout cart={cart}>
            <Head title="Thanh toán - BookStore" />

            <div className="max-w-6xl mx-auto py-8">
                <h1 className="text-3xl font-black text-gray-900 mb-8">Thanh toán đơn hàng</h1>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-8">
                    {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG & PHƯƠNG THỨC THANH TOÁN */}
                    <div className="lg:w-2/3 space-y-8">
                        
                        {/* Box 1: Thông tin nhận hàng */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">1. Thông tin người nhận</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="Nhập họ tên người nhận" />
                                    {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                                    <input type="tel" value={data.customer_phone} onChange={e => setData('customer_phone', e.target.value)} required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="Nhập số điện thoại liên hệ" />
                                    {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.customer_address} onChange={e => setData('customer_address', e.target.value)} required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="Số nhà, tên đường, phường/xã, quận/huyện..." />
                                    {errors.customer_address && <p className="text-red-500 text-xs mt-1">{errors.customer_address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Box 2: Phương thức thanh toán */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">2. Phương thức thanh toán</h2>
                            <div className="space-y-4">
                                
                                {/* Lựa chọn 1: COD */}
                                <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${data.payment_method === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="payment_method" value="cod"
                                        checked={data.payment_method === 'cod'}
                                        onChange={e => setData('payment_method', e.target.value)}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                                    <div className="ml-4 flex items-center">
                                        <span className="text-3xl mr-4">💵</span>
                                        <div>
                                            <p className="font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                                            <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi sách được giao đến tận tay bạn.</p>
                                        </div>
                                    </div>
                                </label>

                                {/* Lựa chọn 2: VNPAY */}
                                <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${data.payment_method === 'vnpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input type="radio" name="payment_method" value="vnpay"
                                        checked={data.payment_method === 'vnpay'}
                                        onChange={e => setData('payment_method', e.target.value)}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                                    <div className="ml-4 flex items-center">
                                        <span className="text-3xl mr-4 text-blue-800 font-black tracking-tighter italic">VNPAY</span>
                                        <div>
                                            <p className="font-bold text-gray-900">Thanh toán trực tuyến qua VNPAY</p>
                                            <p className="text-sm text-gray-500">Sử dụng thẻ ATM, Visa/MasterCard hoặc quét mã QR ứng dụng ngân hàng.</p>
                                        </div>
                                    </div>
                                </label>

                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>
                            
                            <ul className="mb-6 space-y-4 max-h-60 overflow-y-auto pr-2">
                                {cart.items.map(item => (
                                    <li key={item.id} className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.book.title}</p>
                                            <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">{formatPrice((item.book.discount_price || item.book.price) * item.quantity)}</p>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t border-gray-100 pt-6 space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span className="font-semibold">{formatPrice(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí giao hàng</span>
                                    <span className="font-semibold text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-4">
                                    <span className="font-bold text-gray-900">Tổng cộng</span>
                                    <span className="text-3xl font-black text-red-600">{formatPrice(totalAmount)}</span>
                                </div>
                            </div>

                            <button disabled={processing} type="submit" className="w-full mt-8 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition disabled:opacity-75 flex items-center justify-center">
                                {processing ? 'Đang xử lý...' : (data.payment_method === 'vnpay' ? 'ĐẾN CỔNG VNPAY' : 'HOÀN TẤT ĐẶT HÀNG')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </StoreLayout>
    );
}
import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title="Giới thiệu - BookStore" />

            {/* HEADER ĐƠN GIẢN CHO TRANG PHỤ */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter">
                        Book<span className="text-gray-900">Store</span>.
                    </Link>
                    <Link href="/" className="text-gray-500 font-semibold hover:text-blue-600 transition flex items-center">
                        <span className="mr-2">&larr;</span> Quay lại cửa hàng
                    </Link>
                </div>
            </header>

            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-16">
                
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Về Chúng Tôi</h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16">
                    <div className="h-64 bg-gradient-to-r from-blue-600 to-indigo-800 flex items-center justify-center p-10 text-center">
                        <p className="text-2xl md:text-3xl font-light text-white leading-relaxed">"Sứ mệnh của chúng tôi là mang tri thức nhân loại đến với mọi nhà thông qua những trang sách."</p>
                    </div>
                    <div className="p-10 md:p-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Câu chuyện của BookStore</h2>
                        <div className="prose prose-lg text-gray-600 space-y-6">
                            <p>
                                Được thành lập vào năm 2026 như một dự án đầy tâm huyết của chúng tôi, BookStore bắt đầu từ một ý tưởng giản đơn: Làm thế nào để tạo ra một không gian mua sắm sách trực tuyến thân thiện, hiện đại và dễ sử dụng nhất cho người Việt?
                            </p>
                            <p>
                                Trải qua quá trình nghiên cứu và phát triển bằng công nghệ hiện đại nhất (Laravel & ReactJS), BookStore không chỉ dừng lại ở một đồ án học thuật, mà đã trở thành một nền tảng thực sự, nơi kết nối hàng ngàn độc giả với những tác phẩm giá trị.
                            </p>
                            <p>
                                Tại BookStore, chúng tôi tự hào cung cấp một kho tàng đa dạng các thể loại sách từ văn học, kỹ năng sống, khoa học công nghệ cho đến sách thiếu nhi. Mọi cuốn sách đều được chọn lọc kỹ lưỡng, đảm bảo bản quyền và chất lượng in ấn tốt nhất.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🚀</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Tốc độ hỏa tốc</h3>
                        <p className="text-gray-500">Giao hàng nhanh chóng trên toàn quốc. Đóng gói cẩn thận 3 lớp.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🛡️</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">100% Bản quyền</h3>
                        <p className="text-gray-500">Nói không với sách lậu. Ủng hộ chất xám của tác giả và nhà xuất bản.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">💖</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Tận tâm phục vụ</h3>
                        <p className="text-gray-500">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ 24/7 qua hotline.</p>
                    </div>
                </div>

            </main>

            {/* Tái sử dụng Footer từ trang chủ */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-auto text-center border-t border-gray-800">
                 &copy; 2026 BookStore 
            </footer>
        </div>
    );
}
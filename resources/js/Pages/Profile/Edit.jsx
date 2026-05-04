import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    // Lấy thông tin user để hiển thị Avatar và Tên trên Banner
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800">
                    Hồ sơ cá nhân
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* BƯỚC 1: HEADER BANNER & AVATAR */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 border border-gray-100">
                        {/* Ảnh bìa (Cover Image) dùng gradient màu xanh của BookStore */}
                        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        
                        <div className="px-8 pb-6 flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16">
                            {/* Avatar lấy chữ cái đầu của tên */}
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ffffff&color=4f46e5&size=128&bold=true`}
                                alt="Avatar"
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                            />
                            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1 pb-2">
                                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{user.name}</h3>
                                <p className="text-gray-500 font-medium mt-1">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* BƯỚC 2: BỐ CỤC LƯỚI (GRID) CHO CÁC FORM */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* CỘT TRÁI: Thông tin cá nhân (Chiếm 2 phần) */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 shadow-sm sm:rounded-2xl border border-gray-100 transition hover:shadow-md">
                                {/* Bỏ class max-w-xl để form tràn đều ra khung */}
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* CỘT PHẢI: Bảo mật & Khu vực nguy hiểm (Chiếm 1 phần) */}
                        <div className="space-y-8">
                            {/* Đổi mật khẩu */}
                            <div className="bg-white p-8 shadow-sm sm:rounded-2xl border border-gray-100 transition hover:shadow-md">
                                <UpdatePasswordForm className="w-full" />
                            </div>

                            {/* Xóa tài khoản - Phủ nền đỏ nhạt để cảnh báo */}
                            <div className="bg-red-50 p-8 shadow-sm sm:rounded-2xl border border-red-100 transition hover:shadow-md">
                                <DeleteUserForm className="w-full" />
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
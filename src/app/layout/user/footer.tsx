import React from "react";

const Footer = () => {
  return (
    <div className="left-0 w-full z-50 flex flex-col items-center justify-center shadow-md py-8 px-4 bg-gray-100">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-4 text-center tracking-wide">
        Bạn có đã khách sạn?
      </h1>
      <p className="text-center text-gray-600 max-w-3xl leading-relaxed">
        Hãy liên hệ chúng tôi để được đăng tải thông tin khách sạn của bạn lên
        trang web và được cấp quyền chủ khách sạn cho tài khoản.
      </p>
      <div className="mt-6 space-y-4 text-center">
        <div className="text-gray-700 flex justify-center">
          <div className="flex items-center text-left w-full max-w-md">
            <span className="font-semibold text-gray-800 w-28">
              Số điện thoại:
            </span>
            <span className="text-gray-900">0935348140</span>
          </div>
        </div>
        <div className="text-gray-700 flex justify-center">
          <div className="flex items-center text-left w-full max-w-md">
            <span className="font-semibold text-gray-800 mr-2">Zalo:</span>
            <span className="text-gray-900">0935348140 - Phan Tuấn Cảnh</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

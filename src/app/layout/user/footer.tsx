import { Box, Container, Grid, List, ListItem, Typography } from "@mui/material";
import {
  MailOutline,
  PhoneOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";

import { FaYoutube, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import { SiZalo } from "react-icons/si";

import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full z-50 bg-gray-100 py-8 px-36 shadow-md">
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-800">
          {/* Về chúng tôi */}
          <div className="col-span-1">
            <Typography variant="h5" className="font-bold text-2xl mb-4">
              Về chúng tôi
            </Typography>

            <Typography
              variant="body2"
              className="text-justify pr-16 pt-5 text-xl"
            >
              Hoteluxury mang đến trải nghiệm đặt phòng khách sạn cao cấp với
              dịch vụ hoàn hảo và tiện nghi sang trọng. Chúng tôi cung cấp lựa
              chọn đa dạng từ các khách sạn đẳng cấp trên toàn quốc, giúp bạn
              tận hưởng kỳ nghỉ trọn vẹn. Hãy để Hoteluxury đồng hành cùng bạn!
            </Typography>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div className="col-span-1">
            <Typography variant="h5" className="font-bold text-2xl mb-4">
              Hỗ trợ khách hàng
            </Typography>
            <List className="space-y-2">
              <ListItem className="px-0">
                <Link href="#" className="hover:text-blue-500 text-xl">
                  Câu hỏi thường gặp
                </Link>
              </ListItem>
              <ListItem className="px-0">
                <Link href="#" className="hover:text-blue-500 text-xl">
                  Hướng dẫn đặt phòng
                </Link>
              </ListItem>
              <ListItem className="px-0">
                <Link href="#" className="hover:text-blue-500 text-xl">
                  Chính sách hủy đặt phòng
                </Link>
              </ListItem>
            </List>
          </div>

          {/* Chính sách */}
          <div className="col-span-1">
            <Typography variant="h5" className="font-bold text-2xl mb-4">
              Chính sách
            </Typography>
            <List className="space-y-2">
              <ListItem className="px-0">
                <Link href="#" className="hover:text-blue-500 text-xl">
                  Chính sách bảo mật
                </Link>
              </ListItem>
              <ListItem className="px-0">
                <Link href="#" className="hover:text-blue-500 text-xl">
                  Điều khoản sử dụng
                </Link>
              </ListItem>
              <ListItem className="px-0">
                <Link href="#" className="hover:text-blue-500 text-xl">
                  Quy định về hoàn tiền
                </Link>
              </ListItem>
            </List>
          </div>

          {/* Liên hệ */}
          <div className="col-span-1">
            <Typography variant="h5" className="font-bold text-2xl mb-4">
              Liên hệ
            </Typography>
            <List className="space-y-2">
              <ListItem className="flex items-start px-0 text-xl">
                <PhoneOutlined className="mr-2 text-green-500 mt-1" />
                0348094985 - 0935348140
              </ListItem>
              <ListItem className="flex items-start px-0 text-xl">
                <MailOutline className="mr-2 text-blue-500 mt-1" />
                hoteluxurybooking@gmail.com
              </ListItem>
              <ListItem className="flex items-start px-0 text-xl">
                <LocationOnOutlined className="mr-2 text-red-500 mt-1" />1 Võ
                Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí
                Minh
              </ListItem>
            </List>
          </div>
        </div>

        <div className="mt-8 text-gray-600 text-xl border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-xl">
              © 2024 Công ty HoteLuxury. Mọi quyền được bảo lưu.
            </div>
            <div className="flex space-x-6">
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube className="w-10 h-10 hover:text-red-600 rounded-full bg-gray-200 p-2" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="w-10 h-10 hover:text-blue-600 rounded-full bg-gray-200 p-2" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="w-10 h-10 hover:text-pink-600 rounded-full bg-gray-200 p-2" />
              </Link>
              <Link
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok className="w-10 h-10 hover:text-black rounded-full bg-gray-200 p-2" />
              </Link>
              <Link
                href="https://zalo.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiZalo className="w-10 h-10 hover:text-green-500 rounded-full bg-gray-200 p-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

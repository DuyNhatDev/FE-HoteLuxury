"use client"
import apiService from "@/services/api";
import { useEffect } from "react";

interface Response {
  message: string;
}

const HomePage: React.FC = () => {
    useEffect (() =>{
        const fetchData = async () => {
        try {
          const response = await apiService.get<Response>('/');
          console.log(response.data.message);
        } catch (error) {
            console.error("Error fetching roles data:", error);
        }
      };

      fetchData();
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white shadow-lg rounded-lg py-12 px-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Trang chủ
            </h2>
          </div>
        </div>
    )   
}
export default HomePage;
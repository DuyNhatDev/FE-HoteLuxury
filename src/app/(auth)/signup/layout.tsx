import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children} 
    </div>
  );
}

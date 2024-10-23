import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
};

export default function LoginLayout({
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

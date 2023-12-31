import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientProvider from "./clientProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopBar from "@/app/navigation/topbar/TopBar";
import SpeedComponent from "@/app/navigation/speed/SpeedComponent";
const inter = Inter({ subsets: ["latin"] });
import "react-perfect-scrollbar/dist/css/styles.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import SlidingMenuConfig from "./navigation/sidebar/SlidingMenuConfig";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const getUserTheme = async (id: string) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/detail/${id}/theme`
  );
  const { data } = await req.json();
  return data;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = (await getServerSession(authOptions)) as any;
  const theme = data?.user?.id
    ? await getUserTheme(data?.user?.id)
    : { theme: 1 };

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen flex-col">
          <ClientProvider theme={theme?.theme}>
            <TopBar />
            <SlidingMenuConfig />
            <SpeedComponent />
            <div className="p-5">{children}</div>
          </ClientProvider>
          <ToastContainer />
        </div>
      </body>
    </html>
  );
}

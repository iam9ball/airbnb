import { Metadata } from "next";
import {Nunito} from "next/font/google";
import "./globals.css"
import NavBar from "./components/navbar/NavBar";
import Modal from "./components/modals/Modal";

const font = Nunito ({
  subsets: ["latin"],
  
})
export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Modal isOpen/>
        <NavBar/>
        {children}
        </body>
    </html>
  );
}

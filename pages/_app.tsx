import "../styles/globals.css";
import type { AppProps } from "next/app";
import clsx from "clsx";
import { Inter } from "@next/font/google";
import Navbar from "../components/Navbar";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  // const [cartOpen, setCartOpen] = useState(false);
  // const [cart, setCart] = useState(null);

  return (
    <div className={clsx(inter.className, "bg-slate-50 text-slate-900")}>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

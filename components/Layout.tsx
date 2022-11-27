import Link from "next/link";
import { useState } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [cartId, setCartId] = useState(null);

  return (
    <div>
      <Navbar />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;

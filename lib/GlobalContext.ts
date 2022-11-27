import { useState, useEffect, createContext } from "react";

// export const useCartId = () => {
//     const [cartId, setCartId] = useState<string | null>(null);

//     useEffect(() => {
//         const cartId = localStorage.getItem("cartId");
//         if (cartId) {
//         setCartId(cartId);
//         } else {
//         const newCartId = uuid();
//         localStorage.setItem("cartId", newCartId);
//         setCartId(newCartId);
//         }
//     }, []);

//     return cartId;
//     }

const GlobalContext = createContext({
  cartId: "",
  checkoutUrl: "",

  update: (data) => {},
});

export default GlobalContext;

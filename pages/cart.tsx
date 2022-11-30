import Link from "next/link";
import Image from "next/image";
import { gql } from "graphql-request";
import { GetServerSideProps } from "next";

import request from "lib/shopify";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "lib/GlobalContext";

export default function Cart() {
  let cartId: string;
  let checkoutUrl: string;

  const global = useContext(GlobalContext);

  function updateCart(cartId: string, checkoutUrl: string) {
    global.update({
      cartId,
      checkoutUrl,
    });
  }

  const [cart, setCart] = useState(null);
  // console.log("cart", global);

  if (typeof window !== "undefined") {
    cartId = localStorage.getItem("cartId");
    // checkoutUrl = localStorage.getItem("checkoutId");
    checkoutUrl = `https://checkout.shopify.com/${
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL
    }/cart/c/${cartId.split("/").pop()}`;
  }

  // post to /api/loadCart

  useEffect(() => {
    async function loadCart() {
      const res = await fetch("/api/loadCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId }),
      });
      const data = await res.json();

      console.log("cart", data.cart);

      setCart(data.cart);
    }
    loadCart();
  }, []);

  return (
    <main className="min-h-screen mx-auto container pt-24 px-8">
      <h1 className="text-2xl font-semibold pb-16">Checkout</h1>
      <section className="flex flex-col justify-between">
        <ul className="flex flex-col gap-8">
          {cart ? (
            cart.lines.edges.map((item, i) => (
              <ProductItemCart item={item} key={i} />
            ))
          ) : (
            <p>Loading...</p>
          )}
        </ul>

        <aside className="flex flex-col mt-16 md:mt-0 justify-between max-h-92 bg-slate-300 rounded-xl p-8">
          <h2 className="text-2xl font-semibold">Order summery</h2>
          {/* <p>
            Subtotal:{" "}
            {cart &&
              cart.estimatedCost.amount +
                " " +
                cart.cart.subtotalPriceV2.currencyCode}
          </p> */}
          {/* <p>
            Tax:{" "}
            {cart &&
              cart.cart.totalTaxV2.amount +
                " " +
                cart.cart.totalTaxV2.currencyCode}
          </p> */}
          <div className="">
            <p className=" font-semibold">
              Total:{" "}
              {cart &&
                parseFloat(cart.estimatedCost.totalAmount.amount).toFixed(2) +
                  " €"}
            </p>
            <div className="flex items-center pt-4">
              {cart && (
                <Link
                  className="py-4 px-8 bg-indigo-500 hover:bg-indigo-700 rounded-xl text-white"
                  href={cart.checkoutUrl}
                >
                  Checkout
                </Link>
              )}
            </div>
          </div>
        </aside>
      </section>

      {/* <pre className="py-24">
        <code>{JSON.stringify(cart, null, 2)}</code>
      </pre> */}
    </main>
  );
}

const ProductItemCart = (item) => {
  const product = item.item.node;
  const [quantity, setQuantity] = useState(product.quantity);
  return (
    <li key={item.id} className="">
      {/* <pre>
        <code>{JSON.stringify(item.item.node, null, 2)}</code>
      </pre> */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-8">
          <Image
            src={product.merchandise.image.originalSrc}
            alt={product.merchandise.product.title || "product image"}
            width={400}
            height={400}
            className="rounded-xl h-64 w-64 "
          />
          <div className="flex flex-col">
            <h3 className=" font-semibold">
              {product.merchandise.product.title}
            </h3>
            <p className="text-slate-500">{product.merchandise.title}</p>
            <p className="pt-2">
              {product.merchandise.priceV2.amount +
                " " +
                product.merchandise.priceV2.currencyCode}
            </p>
          </div>
        </div>
        <div className="">
          {/* sync input with usestate quantity */}
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-8 md:w-16 mx-4"
          />
          <span>
            {parseFloat(product.merchandise.priceV2.amount) * quantity + " €"}
          </span>
        </div>
      </div>
      <hr className="my-8" />
    </li>
  );
};

// request cart data

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { cartId } = context.query;

//   const data = await request({
//     query: gql`
//       query GetCart($cartId: ID!) {
//         node(id: $cartId) {
//           ... on Cart {
//             id
//             lines(first: 100) {
//               edges {
//                 node {
//                   id
//                   quantity
//                   merchandise {
//                     ... on ProductVariant {
//                       product {
//                         title
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     `,
//     variables: { cartId },
//   });

//   return {
//     props: {
//       data,
//     },
//   };
// }

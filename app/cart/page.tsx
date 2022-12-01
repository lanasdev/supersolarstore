import ProductItemCart from "./ProductItemCart";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { gql } from "graphql-request";

import request from "lib/shopify";

export const dynamic = "auto";

async function getCart(cartId) {
  // get cart from shopify
  const data = await request({
    query: gql`
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          checkoutUrl
          estimatedCost {
            totalAmount {
              amount
            }
          }
          lines(first: 100) {
            edges {
              node {
                quantity
                estimatedCost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    title

                    product {
                      title
                    }
                    image {
                      originalSrc
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
        }
      }
    `,
    variables: { cartId },
  });

  if (!data) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return data;
}

export default async function Cart() {
  const nextCookies = cookies();
  const cookiesCartId = nextCookies.get("cartId");
  const cartId = "gid://shopify/Cart/5d6c7ba2981ded986656cb6d6dc1e9b2";

  let checkoutUrl: string;

  const data = await getCart(cartId);
  const cart = data.cart;

  //   const [cart, setCart] = useState(data);
  // console.log("cart", data);

  //   if (typeof window !== "undefined") {
  //     cartId = localStorage.getItem("cartId");
  //     // checkoutUrl = localStorage.getItem("checkoutId");
  //     checkoutUrl = `https://checkout.shopify.com/${
  //       process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL
  //     }/cart/c/${cartId.split("/").pop()}`;
  //   }

  return (
    <main className="min-h-screen mx-auto container pt-24 px-8">
      <h1 className="text-2xl font-semibold pb-16">Warenkorb</h1>
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

        <aside className="flex flex-col md:flex-row mt-16 md:mt-0 justify-between max-h-92 bg-slate-300 rounded-xl p-8">
          <h2 className="text-2xl font-semibold">Zusammenfassung </h2>
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
            <p className=" pt-8 font-semibold">
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

      <pre className="py-24">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </main>
  );
}

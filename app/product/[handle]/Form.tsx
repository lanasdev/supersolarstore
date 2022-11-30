"use client";

import { useState, useEffect } from "react";
import { Star } from "phosphor-react";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import request from "lib/shopify";
import { gql } from "graphql-request";
import { mediaFieldsByType } from "lib/fragments";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Tags from "components/Tags";
export const Form = ({ product }) => {
  const router = useRouter();
  // const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState(
    product.variants.edges[0].node
  );
  const [quantity, setQuantity] = useState(1);

  // console.log(product.variants.edges[0].node);

  let checkoutUrl = "";
  let cartId = "";
  let cart;
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // check if there is a cart in local storage

    if (window.localStorage.getItem("cartId")) {
      cartId = window.localStorage.getItem("cartId");
      checkoutUrl = window.localStorage.getItem("checkoutUrl");
    } else {
      const resCart = await fetch("/api/createCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      cart = await resCart.json();
      checkoutUrl = cart.checkoutUrl;
      cartId = cart.cartId;

      window.localStorage.setItem("cartId", cartId);
      window.localStorage.setItem("checkoutUrl", checkoutUrl);
    }

    const res = await fetch("/api/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId: cartId,
        variantId: selectedSize.id,
        quantity,
      }),
    });

    const data = await res.json();
    // console.log("data: ", data);
    // console.log("checkoutUrl: ", checkoutUrl);

    // router.push(checkoutUrl);
  };
  return (
    <>
      <form className="mt-10" onSubmit={(e) => handleSubmit(e)}>
        {/* Sizes */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Size</h3>
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Size guide
            </a>
          </div>

          <RadioGroup
            value={selectedSize}
            onChange={setSelectedSize}
            className="mt-4"
            name="size"
          >
            <RadioGroup.Label className="sr-only">
              {" "}
              Choose a size{" "}
            </RadioGroup.Label>
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
              {product.variants.edges.map((v) => {
                let variant = v.node;
                return (
                  <RadioGroup.Option
                    key={variant.id}
                    value={variant}
                    disabled={variant.availableForSale}
                    className={({ active }) =>
                      clsx(
                        variant.availableForSale
                          ? "bg-white shadow-sm text-gray-900 cursor-pointer"
                          : "bg-gray-50 text-gray-200 cursor-not-allowed",
                        active ? "ring-2 ring-indigo-500" : "",
                        "group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                      )
                    }
                  >
                    {/* <pre className="text-black px-16">
                          {JSON.stringify(variant.node, null, 2)}
                        </pre> */}
                    {({ active, checked }) => (
                      <>
                        <RadioGroup.Label as="span">
                          {variant.title}
                        </RadioGroup.Label>
                        {variant.availableForSale ? (
                          <span
                            className={clsx(
                              active ? "border" : "border-2",
                              checked
                                ? "border-indigo-500"
                                : "border-transparent",
                              "pointer-events-none absolute -inset-px rounded-md"
                            )}
                            aria-hidden="true"
                          ></span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                          >
                            <svg
                              className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              stroke="currentColor"
                            >
                              <line
                                x1={0}
                                y1={100}
                                x2={100}
                                y2={0}
                                vectorEffect="non-scaling-stroke"
                              />
                            </svg>
                            {/* {parseFloat(variant.price.amount).toFixed(2)} */}
                          </span>
                        )}
                      </>
                    )}
                  </RadioGroup.Option>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Quantity */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Limit of 5 per customer
            </a>
          </div>

          <div className="mt-4 flex">
            <input
              type="number"
              min="1"
              max="5"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-4 shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add to bag
        </button>
      </form>
      <button onClick={() => router.push(checkoutUrl)} className="">
        Go to cart
      </button>
    </>
  );
};

export default Form;

import { useState, useEffect, useContext } from "react";
import { Star } from "phosphor-react";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { GetStaticPaths, GetStaticProps } from "next";
import request from "../../lib/shopify";
import { gql } from "graphql-request";
import { mediaFieldsByType } from "../../lib/fragments";
import Link from "next/link";
import Image from "next/image";

import Tags from "../../components/Tags";
import { useRouter } from "next/router";
import GlobalContext from "lib/GlobalContext";

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await request({
    query: gql`
      query GetAllProducts {
        products(first: 250) {
          edges {
            node {
              id
              handle
            }
          }
        }
      }
    `,
  });

  const paths = data.products.edges.map((product: any) => ({
    params: { handle: product.node.handle },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const handle = params?.handle;

  const data = await request({
    query: gql`
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          totalInventory
          productType
          vendor
          tags
          priceRange {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                }
                sku
                unitPrice {
                  amount
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          media(first: 10) {
            edges {
              node {
                mediaContentType
                alt
                ...mediaFieldsByType
              }
            }
          }
        }
      }
      ${mediaFieldsByType}
    `,
    variables: {
      handle: handle,
    },
  });

  return {
    props: {
      data,
      revalidate: 30,
    },
  };
};

const productData = {
  name: "Basic Tee 6-Pack",
  price: "$192",
  href: "#",
  breadcrumbs: [
    { id: 1, name: "Men", href: "#" },
    { id: 2, name: "Clothing", href: "#" },
  ],
  images: [
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-secondary-product-shot.jpg",
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-01.jpg",
      alt: "Model wearing plain black basic tee.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-tertiary-product-shot-02.jpg",
      alt: "Model wearing plain gray basic tee.",
    },
    {
      src: "https://tailwindui.com/img/ecommerce-images/product-page-02-featured-product-shot.jpg",
      alt: "Model wearing plain white basic tee.",
    },
  ],
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],
  sizes: [
    { name: "XXS", inStock: false },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "2XL", inStock: true },
    { name: "3XL", inStock: true },
  ],
  description:
    'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
  highlights: [
    "Hand cut and sewn locally",
    "Dyed with our proprietary colors",
    "Pre-washed & pre-shrunk",
    "Ultra-soft 100% cotton",
  ],
  details:
    'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
};
const reviews = { href: "#", average: 4, totalCount: 117 };

export default function ProductPage({ data }: any) {
  const router = useRouter();

  const global = useContext(GlobalContext);

  function updateCart(cartId: string, checkoutUrl: string) {
    global.update({
      cartId,
      checkoutUrl,
    });
  }

  const product = data.product;
  const minPrice = product.priceRange.minVariantPrice.amount;
  const maxPrice = product.priceRange.maxVariantPrice.amount;

  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState(
    product.variants.edges[0].node
  );
  const [quantity, setQuantity] = useState(1);

  // console.log(product.variants.edges[0].node);

  useEffect(() => {
    console.log("selectedSize: ", selectedSize);
  }, [selectedSize, selectedColor]);

  let checkoutUrl = "";
  let cartId = "";
  let cart;
  // filter out the media that are not the mediaContentType of IMAGE
  const images = product.media.edges.filter(
    (edge: any) => edge.node.mediaContentType === "IMAGE"
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // check if there is a cart in local storage

    if (window.localStorage.getItem("cartId")) {
      cartId = window.localStorage.getItem("cartId");
      checkoutUrl = window.localStorage.getItem("checkoutUrl");
      updateCart(cartId, checkoutUrl);
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
      updateCart(cartId, checkoutUrl);
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
    console.log("data: ", data);
    console.log("checkoutUrl: ", checkoutUrl);

    // router.push(checkoutUrl);
  };

  return (
    <div className="">
      <div className="pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          {images.map((image) => (
            <Image
              key={image.node.id}
              src={image.node.image.url}
              width={500}
              height={500}
              alt={image.node.alt || "Product Image"}
            />
          ))}
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.title}
            </h1>
            <p className="mt-4 text-sm font-semibold text-indigo-500">
              {product.vendor} - {"Inventory: " + product.totalInventory}
            </p>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              ab {parseFloat(minPrice).toFixed(2) || minPrice}€
            </p>

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
                  <h3 className="text-sm font-medium text-gray-900">
                    Quantity
                  </h3>
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
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p
                  className="text-base text-gray-900"
                  // dangerouslySetInnerHTML={product.descriptionHtml}
                >
                  {product.description}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Tags</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  <Tags tags={product.tags} />
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <pre className="py-16">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}

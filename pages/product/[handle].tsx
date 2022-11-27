import { useState, useEffect } from "react";
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
import { VariableStatement } from "typescript";

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
  const product = data.product;
  const minPrice = product.priceRange.minVariantPrice.amount;
  const maxPrice = product.priceRange.maxVariantPrice.amount;

  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState(
    product.variants.edges[0].node
  );

  // console.log(product.variants.edges[0].node);

  useEffect(() => {
    console.log("selectedSize: ", selectedSize);
  }, [selectedSize, selectedColor]);

  // filter out the media that are not the mediaContentType of IMAGE
  const images = product.media.edges.filter(
    (edge: any) => edge.node.mediaContentType === "IMAGE"
  );

  return (
    <div className="">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li>
              <div className="flex items-center">
                <Link
                  href="/"
                  className="mr-2 text-sm font-medium text-gray-900"
                >
                  Home
                </Link>
                <svg
                  width={16}
                  height={20}
                  viewBox="0 0 16 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-5 w-4 text-gray-300"
                >
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="flex items-center">
              <Link
                href="/products"
                className="mr-2 text-sm font-medium text-gray-900"
              >
                Products
              </Link>
              <svg
                width={16}
                height={20}
                viewBox="0 0 16 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-5 w-4 text-gray-300"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </li>
            <li className="text-sm">
              <Link
                href={productData.href}
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.title}
              </Link>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        {/* <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-w-3 aspect-h-4 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={images[0].node.image.url}
              alt={images[0].node.alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
              <img
                src={images[1].node.image.url}
                alt={images[1].node.alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg">
              <img
                src={productData.images[2].src}
                alt={productData.images[2].alt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="aspect-w-4 aspect-h-5 sm:overflow-hidden sm:rounded-lg lg:aspect-w-3 lg:aspect-h-4">
            <img
              src={productData.images[3].src}
              alt={productData.images[3].alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div> */}
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

            <form className="mt-10" action="/api/" method="post">
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

              <button
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to bag
              </button>
            </form>
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

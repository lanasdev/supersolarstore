// import { useState, useEffect} from "react";
import { Star } from "phosphor-react";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { GetStaticPaths, GetStaticProps } from "next";
import request from "lib/shopify";
import { gql } from "graphql-request";
import { mediaFieldsByType } from "lib/fragments";
import Link from "next/link";
import Image from "next/image";

import Tags from "components/Tags";
import Form from "./Form";

export const revalidate = 5;

const getProducts = async () => {
  const data = await request({
    query: gql`
      query GetProducts {
        products(first: 50) {
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

  return data;
};

export async function generateStaticParams() {
  const products = await getProducts();

  return products.products.edges.map((p) => ({
    handle: p.node.handle,
  }));
  // return [{ handle: "victron-lithiumbatterie" }, { handle: "multiplus-ii" }];
}

export async function getProduct(handle: string) {
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

  return data;
}

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

export default async function ProductPage({ params }) {
  const data = await getProduct(params.handle);

  const product = data.product;
  const minPrice = product.priceRange.minVariantPrice.amount;
  const maxPrice = product.priceRange.maxVariantPrice.amount;

  // filter out the media that are not the mediaContentType of IMAGE
  const images = product.media.edges.filter(
    (edge: any) => edge.node.mediaContentType === "IMAGE"
  );

  return (
    <div className="px-4 md:px-8">
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

            <Form product={product} />
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
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

import Head from "next/head";
import Image from "next/image";
import { GetStaticProps } from "next";
import { gql } from "graphql-request";
import request from "../lib/shopify";
import ProductItem from "../components/ProductItem";

export const getStaticProps: GetStaticProps = async () => {
  const data = await request({
    query: gql`
      query GetProducts {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              description
              totalInventory
              priceRange {
                minVariantPrice {
                  amount
                }
                maxVariantPrice {
                  amount
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
              productType
              vendor
              tags
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      data,
    },
  };
};

export default function Home({ data }) {
  const products = data.products.edges;

  return (
    <div className="min-h-screen">
      <Head>
        <title>SuperSolarStore</title>
        <meta name="description" content="SuperSolarStore" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductItem key={product.node.handle} product={product.node} />
          ))}
        </div>
        {/* <pre className="pt-16">{JSON.stringify(products, null, 2)}</pre> */}
      </main>
    </div>
  );
}

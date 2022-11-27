import Head from "next/head";
import Image from "next/image";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { gql } from "graphql-request";
import request from "../lib/shopify";
import ProductItem from "../components/ProductItem";

type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  totalInventory: number;
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
    maxVariantPrice: {
      amount: string;
    };
  };
  productType: string;
  vendor: string;
  tags: string[];
  images: {
    edges: {
      node: {
        originalSrc: string;
        altText: string;
      };
    }[];
  };
};

type ProductProps = {
  node: {
    products: Product[];
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await request({
    query: gql`
      query GetProducts {
        products(first: 50) {
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

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({ data }: Props) {
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
          {products.map((product: { node: { handle: string } }) => (
            <ProductItem key={product.node.handle} product={product.node} />
          ))}
        </div>
        <pre className="pt-16">{JSON.stringify(products, null, 2)}</pre>
      </main>
      <div className="py-64"></div>
    </div>
  );
}

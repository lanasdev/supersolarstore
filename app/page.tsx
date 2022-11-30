import Head from "next/head";
import Image from "next/image";
import { gql } from "graphql-request";
import request from "lib/shopify";
import ProductItem from "components/ProductItem";
import Hero from "components/Hero";

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
export const revalidate = 5;

const getProducts = async () => {
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

export default async function Home() {
  const data = await getProducts();
  const products = data.props.data.products.edges;

  return (
    <div className=" ">
      <Hero />
      <main className="px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {products.map((product: { node: { handle: string } }) => (
            <ProductItem key={product.node.handle} product={product.node} />
          ))}
        </div>
        {/* <pre className="pt-16">{JSON.stringify(products, null, 2)}</pre> */}
      </main>
    </div>
  );
}

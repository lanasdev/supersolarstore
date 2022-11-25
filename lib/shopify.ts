import { GraphQLClient } from "graphql-request";

const request = ({ query, variables = {} }) => {
  if (!query) {
    throw new Error("No query found");
  }
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL) {
    throw new Error("No store domain found");
  }
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error("No storefront access token found");
  }

  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token":
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  };

  const client = new GraphQLClient(
    `${process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL}/api/2022-10/graphql.json`,
    { headers }
  );
  return client.request(query, variables);
};

export default request;

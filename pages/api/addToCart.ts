// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { gql } from "graphql-request";
import request from "lib/shopify";

// type Data = {
//   message: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).json({ message: "Method not allowed" });
  } else {
    const { cartId, variantId, quantity = 1 } = req.body;

    if (!cartId || !variantId) {
      res.status(400).json({ message: "Bad Request" });
    }

    const data = await request({
      query: `
      mutation AddToCart($cartId: ID!, $variantId: ID!, $quantity: Int!) {
        cartLinesAdd(cartId: $cartId, lines: [{ quantity: $quantity, merchandiseId: $variantId}]) {
          cart {
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
      variables: { cartId, variantId, quantity },
    });

    if (!data) {
      res.status(500).json({ error: "No Data found" });
    }
    res.status(200).json(data);
  }
}

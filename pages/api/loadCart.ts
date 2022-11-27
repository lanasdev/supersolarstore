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
    const { cartId } = req.body;

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
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
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
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "There was a problem creating a cart.",
        }),
      };
    }

    res.status(200).json(data);
  }
}

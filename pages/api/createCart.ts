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
    const data = await request({
      query: gql`
        mutation CreateCart {
          cartCreate {
            cart {
              checkoutUrl
              id
            }
          }
        }
      `,
      variables: {},
    });

    if (!data) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "There was a problem creating a cart.",
        }),
      };
    }

    res.status(200).json({
      cartId: data?.cartCreate?.cart?.id,
      checkoutUrl: data?.cartCreate?.cart?.checkoutUrl,
    });
  }
}

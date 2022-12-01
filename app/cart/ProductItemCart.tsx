"use client";

import { useState } from "react";
import Image from "next/image";

const ProductItemCart = (item) => {
  const product = item.item.node;
  const [quantity, setQuantity] = useState(product.quantity);
  return (
    <li key={item.id} className="">
      {/* <pre>
        <code>{JSON.stringify(item.item.node, null, 2)}</code>
      </pre> */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-x-8">
        <div className="flex items-center gap-x-8">
          <Image
            src={product.merchandise.image.originalSrc}
            alt={product.merchandise.product.title || "product image"}
            width={800}
            height={800}
            className="rounded-xl object-contain aspect-w-3 aspect-h-2 w-64 pb-0 "
          />
          <div className="flex flex-col">
            <h3 className=" font-semibold">
              {product.merchandise.product.title}
            </h3>
            <p className="text-slate-500">{product.merchandise.title}</p>
            <p className="pt-2">
              {product.merchandise.priceV2.amount +
                " " +
                product.merchandise.priceV2.currencyCode}
            </p>
          </div>
        </div>
        <div className="">
          {/* sync input with usestate quantity */}
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-8 md:w-16 mx-4"
          />
          <span>
            {parseFloat(product.merchandise.priceV2.amount) * quantity + " €"}
          </span>
        </div>
      </div>
      <hr className="my-8" />
    </li>
  );
};

export default ProductItemCart;

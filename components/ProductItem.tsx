import Image from "next/image";
import Link from "next/link";
import Tags from "./Tags";

export default function ProductItem({ product }: any) {
  const { title, handle, description } = product;
  const image = product.images.edges[0].node;
  const minPrice = product.priceRange.minVariantPrice.amount;
  const maxPrice = product.priceRange.maxVariantPrice.amount;
  const price = minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;

  return (
    <div className="p-4">
      <Link
        key={product.id}
        href={`/product/${handle}`}
        className="group max-w-sm"
      >
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
          <Image
            src={image.originalSrc}
            alt={image.altText}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="flex mt-4 justify-between items-start">
          <div className="flex flex-col">
            <h3 className=" text-sm text-slate-700">{title}</h3>
            <p className="mt-1 text-lg font-medium text-slate-900">
              {parseFloat(price).toFixed(2) || price} €
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-slate-700">{product.vendor}</span>
            {/* <Tags tags={product.tags} /> */}
          </div>
        </div>
      </Link>
      {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}
    </div>
  );
}

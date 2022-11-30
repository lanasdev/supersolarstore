import Image from "next/image";
import Link from "next/link";

import HeroImg from "public/img/pexels-jonas-ferlin-3025562.jpg";

export default function Hero() {
  return (
    <section className="relative pb-32">
      <div className="absolute inset-0">
        <Image
          src={HeroImg}
          className=" object-cover object-center h-[35rem] "
          alt="Hero image of a solar panel"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-900 to-transparent h-[35rem] "
          aria-hidden="true"
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">Willkommen bei</span>
          <span className="block">Super Solar</span>
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-slate-100">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Reprehenderit quos eligendi, eaque ratione ipsa, quia voluptate,
          voluptates voluptatibus quibusdam nemo.
        </p>
        <Link
          href="/products"
          className="mt-8 bg-slate-100 border border-transparent rounded-md py-3 px-8 inline-flex items-center text-base font-medium text-slate-900 hover:bg-slate-200"
        >
          Produkte anzeigen
        </Link>
      </div>
    </section>
  );
}

export function Hero2() {
  return (
    <div className="relative">
      <div className="absolute inset-0">
        <Image
          src={HeroImg}
          className=" object-cover object-center"
          alt="Hero image of a solar panel"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-900 to-transparent"
          aria-hidden="true"
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block">The Shop</span>
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-slate-100">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Reprehenderit quos eligendi, eaque ratione ipsa, quia voluptate,
          voluptates voluptatibus quibusdam nemo.
        </p>
        <Link
          href="/products"
          className="mt-8 bg-slate-100 border border-transparent rounded-md py-3 px-8 inline-flex items-center text-base font-medium text-slate-900 hover:bg-slate-200"
        >
          Shop now
        </Link>
      </div>
    </div>
  );
}

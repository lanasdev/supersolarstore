"use client";

import Link from "next/link";

import {
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  TwitterLogo,
} from "phosphor-react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-4 px-8 text-gray-700 mt-16 flex flex-col md:flex-row justify-between items-center">
      <span className="">
        © {new Date().getFullYear()} - Super Solar Shop - All rights reserved
      </span>
      <div className="flex flex-row gap-8">
        <Link href="https://www.facebook.com/supersolarshop">
          <FacebookLogo size={24} />
        </Link>
        <Link href="https://www.instagram.com/supersolarshop">
          <InstagramLogo size={24} />
        </Link>
        <Link href="https://www.twitter.com/supersolarshop">
          <TwitterLogo size={24} />
        </Link>
        <Link href="https://www.github.com/supersolarshop">
          <GithubLogo size={24} />
        </Link>
      </div>
    </footer>
  );
}

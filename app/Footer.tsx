"use client";

import Link from "next/link";

import { InstagramLogo, TwitterLogo, GithubLogo } from "phosphor-react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-4 px-8 text-gray-700 mt-16 flex flex-col md:flex-row justify-between items-center">
      <span className="">
        © {new Date().getFullYear()} - Super Solar Shop - All rights reserved
      </span>
      <div className="flex flex-row gap-8">
        <Link href="https://www.instagram.com/lanasdev">
          <InstagramLogo size={24} />
        </Link>
        <Link href="https://www.twitter.com/lanasdev">
          <TwitterLogo size={24} />
        </Link>
        <Link href="https://github.com/lanasdev/supersolarstore">
          <GithubLogo size={24} />
        </Link>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-2xl font-semibold">Page Not Found</p>
      <Link href="/" className="text-blue-500 hover:text-blue-700 pt-4">
        Go Back Home
      </Link>
    </div>
  );
}

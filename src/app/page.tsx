import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">API HIMARPL</h1>
      <Link href="/api-docs">
        <button className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Read API Documentation
        </button>
      </Link>
    </main>
  );
}

import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found — House of Peacock</title>
      </Head>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="section-label mb-4">404</p>
        <h1 className="display-heading text-5xl sm:text-6xl mb-4">Page Not Found</h1>
        <p className="text-neutral-500 mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="btn-red">Go Home</Link>
          <Link href="/clothing" className="btn-outline">Browse Catalog</Link>
        </div>
      </main>
    </>
  );
}

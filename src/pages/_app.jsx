import '@/styles/globals.css';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import InfoModal from '@/components/InfoModal';

export default function App({ Component, pageProps }) {
  const [activePage,   setActivePage]   = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Page content */}
      <div className="flex flex-col min-h-screen">
        <Component {...pageProps} />
        <Footer onInfoClick={setActivePage} />
      </div>

      {/* Global info modals */}
      {activePage && (
        <InfoModal page={activePage} onClose={() => setActivePage(null)} />
      )}

      {/* Global back-to-top button — appears on every page after scrolling 400px */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-5 z-40 w-11 h-11 flex items-center justify-center
                    bg-hop-red text-white shadow-lg
                    hover:bg-hop-red-dark active:scale-95
                    transition-all duration-300 ${
          showBackToTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}

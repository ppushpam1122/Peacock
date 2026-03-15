import Link from 'next/link';

export default function Breadcrumb({ crumbs }) {
  if (!crumbs || crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-400">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;

        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {!isLast ? (
              <>
                <Link
                  href={crumb.href}
                  className="hover:text-neutral-700 transition-colors truncate max-w-[120px] sm:max-w-none"
                >
                  {crumb.label}
                </Link>
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <span className="text-neutral-600 font-medium truncate max-w-[160px] sm:max-w-xs">
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

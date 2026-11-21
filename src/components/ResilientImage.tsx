import { useState } from 'react';
import { Cog } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
  loading = 'lazy',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 p-6 text-center ${className}`}
      >
        <Cog className="w-8 h-8 text-slate-400 mb-3" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-sm font-medium text-slate-700 max-w-xs">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

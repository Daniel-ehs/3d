import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  quoteItemCount: number;
  onNavigateToQuote: () => void;
}

const NAV_LINKS = [
  { href: '#pecas', label: 'Peças' },
  { href: '#materiais', label: 'Materiais' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#orcamento', label: 'Orçamento' },
];

export function Header({ quoteItemCount, onNavigateToQuote }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuoteClick = () => {
    setMobileMenuOpen(false);
    onNavigateToQuote();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="#inicio"
          className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
        >
          Vetor3D
        </a>

        {/* Zone 2: 4 concise single-line text links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-2 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleQuoteClick}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            {quoteItemCount > 0
              ? `Solicitar Orçamento (${quoteItemCount})`
              : 'Solicitar Orçamento'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-slate-700 hover:text-slate-900 rounded-md border border-slate-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2">
          <nav aria-label="Navegação móvel" className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-3 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="w-full px-5 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors cursor-pointer"
            >
              {quoteItemCount > 0
                ? `Solicitar Orçamento (${quoteItemCount})`
                : 'Solicitar Orçamento'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

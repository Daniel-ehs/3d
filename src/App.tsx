import { useState } from 'react';
import { ArrowRight, Check, SlidersHorizontal } from 'lucide-react';
import {
  ENGINEERING_MATERIALS,
  HERO_IMAGE,
  MECHANICAL_PARTS,
  MechanicalPart,
  PartCategory,
  PRODUCTION_CASES,
  TESTIMONIALS,
  WORKSHOP_IMAGE,
} from './data/mechanicalData';
import { Header } from './components/Header';
import { formatBrl, PartSpecModal, SelectedQuoteItem } from './components/PartSpecModal';
import { QuoteSection } from './components/QuoteSection';
import { ResilientImage } from './components/ResilientImage';

const CATEGORY_TABS: { id: PartCategory; label: string }[] = [
  { id: 'todas', label: 'Todas as peças' },
  { id: 'transmissao', label: 'Transmissão' },
  { id: 'suportes', label: 'Suportes e mancais' },
  { id: 'reposicao', label: 'Reposição técnica' },
];

const HERO_SPECS = [
  {
    value: '±0,10 mm',
    label: 'Precisão dimensional aferida em paquímetro digital',
  },
  {
    value: '48h a 72h',
    label: 'Despacho padrão para peças funcionais sob demanda',
  },
  {
    value: '145 °C',
    label: 'Resistência térmica máxima em Nylon PA12 com carbono',
  },
  {
    value: '1 a 300 un.',
    label: 'Sem custo de molde para reposição unitária ou lotes',
  },
];

const CAPABILITIES = [
  {
    number: '01.',
    title: 'Engenharia reversa de peças quebradas',
    description:
      'Modelamos o arquivo CAD 3D a partir da peça original danificada ou desenho técnico, reforçando pontos críticos de fadiga.',
  },
  {
    number: '02.',
    title: 'Insertos metálicos e ajustes para rolamentos',
    description:
      'Instalamos insertos roscados de latão a quente (M3 a M8) e calibramos sedes de rolamentos e rasgos de chaveta prontos para montagem.',
  },
  {
    number: '03.',
    title: 'Impressão em câmara aquecida ativa',
    description:
      'Polímeros técnicos como ABS, ASA e Nylon PA12-CF são fabricados sob controle térmico rigoroso para máxima adesão entre camadas.',
  },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<PartCategory>('todas');
  const [activeMaterialId, setActiveMaterialId] = useState<string>(ENGINEERING_MATERIALS[0].id);
  const [inspectedPart, setInspectedPart] = useState<MechanicalPart | null>(null);
  const [quoteItems, setQuoteItems] = useState<SelectedQuoteItem[]>([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const filteredParts =
    activeCategory === 'todas'
      ? MECHANICAL_PARTS
      : MECHANICAL_PARTS.filter((part) => part.category === activeCategory);

  const activeMaterial =
    ENGINEERING_MATERIALS.find((mat) => mat.id === activeMaterialId) ||
    ENGINEERING_MATERIALS[0];

  const totalQuoteCount = quoteItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToQuote = () => {
    const target = document.getElementById('orcamento');
    target?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToQuote = (newItem: SelectedQuoteItem) => {
    setQuoteItems((prev) => {
      const existing = prev.find((item) => item.key === newItem.key);
      if (existing) {
        return prev.map((item) =>
          item.key === newItem.key
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
    setRecentlyAddedId(newItem.partId);
    window.setTimeout(() => {
      setRecentlyAddedId((current) => (current === newItem.partId ? null : current));
    }, 1800);
  };

  const handleQuickAdd = (part: MechanicalPart) => {
    const defaultMat =
      part.availableMaterials.find((m) => m.name === part.defaultMaterial) ||
      part.availableMaterials[0];
    const unitPriceBrl = Math.round(part.basePriceBrl * defaultMat.priceMultiplier);
    handleAddToQuote({
      key: `${part.id}__${defaultMat.name}`,
      partId: part.id,
      code: part.code,
      name: part.name,
      material: defaultMat.name,
      unitPriceBrl,
      quantity: 1,
    });
  };

  const handleUpdateQuantity = (key: string, nextQty: number) => {
    if (nextQty <= 0) {
      setQuoteItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setQuoteItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: nextQty } : item))
    );
  };

  const handleRemoveItem = (key: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleClearItems = () => {
    setQuoteItems([]);
  };

  return (
    <div id="inicio" className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header quoteItemCount={totalQuoteCount} onNavigateToQuote={scrollToQuote} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-16 lg:pt-20 lg:pb-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-sky-700 mb-4">
                  Fabricação aditiva industrial · São Paulo, SP · Envio nacional
                </p>

                <h1 className="font-display font-bold tracking-tight text-slate-900 leading-[1.08] text-[clamp(2.25rem,4vw,3.75rem)] max-w-xl">
                  Peças mecânicas em impressão 3D prontas para carga real
                </h1>

                <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Fabricamos engrenagens, polias, mancais, suportes estruturais e peças de
                  reposição em polímeros de engenharia como Nylon PA12-CF, ABS Industrial e
                  PETG — com precisão dimensional verificada e despacho rápido sem custo de molde.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={scrollToQuote}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    Solicitar Orçamento
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <a
                    href="#pecas"
                    className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-500 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    Explorar catálogo de peças
                  </a>
                </div>
              </div>

              {/* Right Dominant Visual Carrier */}
              <div className="lg:col-span-6">
                <div className="h-full min-h-[280px] sm:min-h-[380px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <ResilientImage
                    src={HERO_IMAGE.src}
                    alt={HERO_IMAGE.alt}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Full-width 4-column technical proof strip below hero split */}
            <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {HERO_SPECS.map((spec) => (
                <div key={spec.value} className="space-y-1.5">
                  <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900">
                    {spec.value}
                  </div>
                  <p className="text-sm text-slate-600 leading-snug">{spec.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mechanical Parts Catalog Section */}
        <section
          id="pecas"
          className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-sky-700 mb-2">
                  Catálogo de linhas técnicas
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  Peças mecânicas padronizadas ou adaptadas ao seu projeto
                </h2>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">
                  Consulte a ficha técnica para configurar polímero e quantidade, ou inclua os
                  itens diretamente no seu orçamento.
                </p>
              </div>

              {/* Interactive segmented category filter */}
              <div
                role="tablist"
                aria-label="Filtrar peças por categoria"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start lg:self-auto"
              >
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredParts.map((part) => {
                const isJustAdded = recentlyAddedId === part.id;
                const defaultMat =
                  part.availableMaterials.find((m) => m.name === part.defaultMaterial) ||
                  part.availableMaterials[0];
                const defaultPrice = Math.round(
                  part.basePriceBrl * defaultMat.priceMultiplier
                );

                return (
                  <article
                    key={part.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-slate-100 border-b border-slate-200 overflow-hidden">
                      <ResilientImage
                        src={part.image}
                        alt={part.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                      />
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        {/* Unboxed clean metadata with typographic separators */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-500">
                          <span>{part.code}</span>
                          <span aria-hidden="true">·</span>
                          <span>{part.defaultMaterial}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{part.tolerance}</span>
                          <span aria-hidden="true">·</span>
                          <span>{part.leadTime}</span>
                        </div>

                        <h3 className="font-display text-xl font-bold tracking-tight text-slate-900">
                          {part.name}
                        </h3>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {part.shortDescription}
                        </p>

                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                          <span className="font-mono tabular-nums">{part.dimensions}</span>
                          <span>{part.insertsNote}</span>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="block text-xs text-slate-500">A partir de</span>
                          <span className="font-mono tabular-nums text-xl font-semibold text-slate-900">
                            {formatBrl(defaultPrice)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setInspectedPart(part)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-500 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                            Ficha técnica
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQuickAdd(part)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                              isJustAdded
                                ? 'bg-emerald-700 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                Adicionado
                              </>
                            ) : (
                              'Incluir no orçamento'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capabilities & Engineering Materials Section */}
        <section
          id="materiais"
          className="py-20 lg:py-28 bg-white border-t border-slate-200 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {/* Asymmetric Capabilities Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                <div className="max-w-xl">
                  <p className="text-sm font-medium text-sky-700 mb-2">
                    Processo produtivo e acabamento
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    Fabricação orientada à função mecânica, não apenas estética
                  </h2>
                </div>

                <div className="flex-1 min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <ResilientImage
                    src={WORKSHOP_IMAGE.src}
                    alt={WORKSHOP_IMAGE.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-slate-200 border-t border-b border-slate-200">
                {CAPABILITIES.map((cap) => (
                  <div key={cap.number} className="py-7 first:pt-6 last:pb-6 space-y-2">
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      <span className="font-mono text-sky-700 mr-2">{cap.number}</span>
                      {cap.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Material Comparison Panel */}
            <div className="pt-16 border-t border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                <div className="max-w-xl">
                  <p className="text-sm font-medium text-sky-700 mb-2">
                    Seleção de polímeros técnicos
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    Compare resistência mecânica e térmica antes de escolher
                  </h2>
                </div>

                <div
                  role="tablist"
                  aria-label="Selecionar material de engenharia"
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto"
                >
                  {ENGINEERING_MATERIALS.map((mat) => {
                    const isActive = mat.id === activeMaterial.id;
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveMaterialId(mat.id)}
                        className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="lg:col-span-5 space-y-4">
                  <p className="text-xs font-mono text-slate-500">
                    {activeMaterial.subtitle}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    {activeMaterial.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeMaterial.summary}
                  </p>

                  <div className="pt-3">
                    <p className="text-xs font-semibold text-slate-800 mb-2">
                      Aplicações recomendadas
                    </p>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {activeMaterial.idealFor.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span
                            className="text-sky-700 font-mono text-xs mt-1 shrink-0"
                            aria-hidden="true"
                          >
                            —
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-6 lg:border-l lg:border-slate-200 lg:pl-10">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500">Resistência à tração</span>
                    <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900">
                      {activeMaterial.tensileStrengthMpa} MPa
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-500">Temperatura de serviço</span>
                    <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900">
                      até {activeMaterial.heatResistanceC} °C
                    </div>
                  </div>

                  <div className="space-y-1 pt-4 border-t border-slate-200">
                    <span className="text-xs text-slate-500">Resistência ao impacto</span>
                    <div className="text-base font-semibold text-slate-900">
                      {activeMaterial.impactRating}
                    </div>
                  </div>

                  <div className="space-y-1 pt-4 border-t border-slate-200">
                    <span className="text-xs text-slate-500">Acabamento superficial</span>
                    <div className="text-base font-semibold text-slate-900">
                      {activeMaterial.finish}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proof of Impact: Production Cases & Client Testimonials */}
        <section
          id="projetos"
          className="py-20 lg:py-28 bg-slate-950 text-slate-100 scroll-mt-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <p className="text-sm font-medium text-sky-400 tracking-wide mb-2">
                Projetos entregues e resultados medidos
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Como nossas peças reduzem tempo de máquina parada e custo de usinagem
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {PRODUCTION_CASES.map((item) => (
                <article
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-7 flex flex-col justify-between gap-8"
                >
                  <div className="space-y-4">
                    <div className="text-xs font-mono text-slate-400 tracking-wide">
                      <span>{item.index}.</span>{' '}
                      <span>{item.clientSector}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white leading-snug">
                      {item.title}
                    </h3>

                    <div className="space-y-3 text-sm text-slate-300 leading-relaxed tracking-[0.01em]">
                      <p>{item.challenge}</p>
                      <p className="text-slate-200">{item.solution}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800 space-y-2">
                    <div className="font-mono tabular-nums text-3xl font-semibold text-sky-400">
                      {item.metricValue}
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">
                      {item.metricLabel}
                    </p>
                    <p className="text-xs font-mono text-slate-500 pt-1">
                      {item.materialUsed} · {item.turnaround}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Attributable Testimonials directly adjacent to cases */}
            <div className="mt-16 pt-14 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-10">
              {TESTIMONIALS.map((t) => (
                <figure key={t.id} className="space-y-4">
                  <blockquote className="text-base sm:text-lg text-slate-200 leading-relaxed tracking-[0.01em]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="space-y-1">
                    <div className="text-sm font-semibold text-white">
                      {t.author} · <span className="font-normal text-slate-400">{t.role}, {t.company}</span>
                    </div>
                    <div className="text-xs font-mono text-sky-400">
                      Resultado: {t.outcome}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Quote Builder & Lead Form */}
        <QuoteSection
          selectedItems={quoteItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearItems={handleClearItems}
        />
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-200">
            <div className="space-y-1.5">
              <a
                href="#inicio"
                className="font-display text-lg font-bold tracking-tight text-slate-900"
              >
                Vetor3D
              </a>
              <p className="text-sm text-slate-600">
                Impressão 3D de peças mecânicas sob medida · São Paulo, SP · Envios para todo o Brasil
              </p>
            </div>

            <nav
              aria-label="Navegação do rodapé"
              className="flex flex-wrap items-center gap-6 text-sm text-slate-600"
            >
              <a href="#pecas" className="hover:text-slate-900 transition-colors">
                Peças
              </a>
              <a href="#materiais" className="hover:text-slate-900 transition-colors">
                Materiais
              </a>
              <a href="#projetos" className="hover:text-slate-900 transition-colors">
                Projetos
              </a>
              <a href="#orcamento" className="hover:text-slate-900 transition-colors">
                Orçamento
              </a>
            </nav>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Vetor3D Fabricação Aditiva. Todos os direitos reservados.</p>
            <p className="font-mono">contato@vetor3d.com.br · Atendimento seg. a sex. das 8h às 18h</p>
          </div>
        </div>
      </footer>

      <PartSpecModal
        part={inspectedPart}
        onClose={() => setInspectedPart(null)}
        onAddToQuote={handleAddToQuote}
      />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { MechanicalPart } from '../data/mechanicalData';
import { ResilientImage } from './ResilientImage';

export interface SelectedQuoteItem {
  key: string;
  partId: string;
  code: string;
  name: string;
  material: string;
  unitPriceBrl: number;
  quantity: number;
}

interface PartSpecModalProps {
  part: MechanicalPart | null;
  onClose: () => void;
  onAddToQuote: (item: SelectedQuoteItem) => void;
}

export function formatBrl(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function PartSpecModal({ part, onClose, onAddToQuote }: PartSpecModalProps) {
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!part) return;
    const defaultIdx = part.availableMaterials.findIndex(
      (m) => m.name === part.defaultMaterial
    );
    setSelectedMaterialIndex(defaultIdx >= 0 ? defaultIdx : 0);
    setQuantity(1);
  }, [part]);

  useEffect(() => {
    if (!part) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [part, onClose]);

  if (!part) return null;

  const activeMaterial =
    part.availableMaterials[selectedMaterialIndex] || part.availableMaterials[0];
  const unitPriceBrl = Math.round(part.basePriceBrl * activeMaterial.priceMultiplier);
  const volumeDiscount = quantity >= 10 ? 0.85 : quantity >= 5 ? 0.92 : 1.0;
  const discountedUnitPrice = Math.round(unitPriceBrl * volumeDiscount);
  const lineTotal = discountedUnitPrice * quantity;

  const handleConfirmAdd = () => {
    onAddToQuote({
      key: `${part.id}__${activeMaterial.name}`,
      partId: part.id,
      code: part.code,
      name: part.name,
      material: activeMaterial.name,
      unitPriceBrl: discountedUnitPrice,
      quantity,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-part-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>{part.code}</span>
            <span aria-hidden="true">·</span>
            <span>{part.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{part.leadTime}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar ficha técnica"
            className="inline-flex items-center justify-center w-10 h-10 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200">
            <ResilientImage
              src={part.image}
              alt={part.imageAlt}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <h3
                id="modal-part-title"
                className="font-display text-2xl font-bold tracking-tight text-slate-900"
              >
                {part.name}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {part.fullDescription}
              </p>

              {/* Technical specification grid */}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-slate-200 text-xs">
                <div>
                  <dt className="text-slate-500">Dimensões padrão</dt>
                  <dd className="mt-0.5 font-mono tabular-nums font-medium text-slate-900">
                    {part.dimensions}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Tolerância dimensional</dt>
                  <dd className="mt-0.5 font-mono tabular-nums font-medium text-slate-900">
                    {part.tolerance}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Estrutura interna</dt>
                  <dd className="mt-0.5 font-mono tabular-nums font-medium text-slate-900">
                    {part.infillSpec}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Fixação e ferragens</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">
                    {part.insertsNote}
                  </dd>
                </div>
              </dl>

              {/* Material selector */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Polímero de fabricação (Resistência térmica: até{' '}
                  <span className="font-mono tabular-nums">{activeMaterial.maxTempC} °C</span>)
                </label>
                <div className="flex flex-wrap gap-2">
                  {part.availableMaterials.map((mat, index) => {
                    const isActive = index === selectedMaterialIndex;
                    return (
                      <button
                        key={mat.name}
                        type="button"
                        onClick={() => setSelectedMaterialIndex(index)}
                        className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                          isActive
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {mat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quantity & Action row */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-slate-300 rounded-md">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Diminuir quantidade"
                    className="w-10 h-10 inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono tabular-nums text-sm font-medium text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(200, q + 1))}
                    aria-label="Aumentar quantidade"
                    className="w-10 h-10 inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="font-mono tabular-nums text-lg font-semibold text-slate-900">
                    {formatBrl(lineTotal)}
                  </div>
                  <div className="text-xs text-slate-500 font-mono tabular-nums">
                    {formatBrl(discountedUnitPrice)} / un.
                    {volumeDiscount < 1 ? ' (desc. lote)' : ''}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="px-5 py-3 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                Adicionar ao orçamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

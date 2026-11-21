import { ChangeEvent, FormEvent, useState } from 'react';
import { CheckCircle2, FileUp, Minus, Plus, Trash2 } from 'lucide-react';
import { ENGINEERING_MATERIALS } from '../data/mechanicalData';
import { formatBrl, SelectedQuoteItem } from './PartSpecModal';

interface QuoteSectionProps {
  selectedItems: SelectedQuoteItem[];
  onUpdateQuantity: (key: string, nextQty: number) => void;
  onRemoveItem: (key: string) => void;
  onClearItems: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  cityState: string;
  projectNotes: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  projectNotes?: string;
}

interface SubmittedQuoteReceipt {
  protocol: string;
  fullName: string;
  email: string;
  estimatedTotalBrl: number;
  summaryLines: string[];
}

const INFILL_OPTIONS = [
  { id: 'standard', label: '35% Estrutural (uso leve)', multiplier: 1.0 },
  { id: 'heavy', label: '65% Alta Carga (engrenagens e suportes)', multiplier: 1.3 },
  { id: 'solid', label: '100% Maciço (esforço severo)', multiplier: 1.6 },
];

export function QuoteSection({
  selectedItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearItems,
}: QuoteSectionProps) {
  const [includeCustomPart, setIncludeCustomPart] = useState(true);
  const [customMaterialId, setCustomMaterialId] = useState(ENGINEERING_MATERIALS[0].id);
  const [customInfillId, setCustomInfillId] = useState('heavy');
  const [dimX, setDimX] = useState(80);
  const [dimY, setDimY] = useState(60);
  const [dimZ, setDimZ] = useState(25);
  const [customQty, setCustomQty] = useState(2);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    cityState: '',
    projectNotes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [receipt, setReceipt] = useState<SubmittedQuoteReceipt | null>(null);

  const activeCustomMaterial =
    ENGINEERING_MATERIALS.find((m) => m.id === customMaterialId) ||
    ENGINEERING_MATERIALS[0];
  const activeInfill =
    INFILL_OPTIONS.find((opt) => opt.id === customInfillId) || INFILL_OPTIONS[1];

  // Realistic volume-to-mass estimate for mechanical printed parts (cm3 * effective fill factor * density)
  const boundingVolumeCm3 = (Math.max(5, dimX) * Math.max(5, dimY) * Math.max(5, dimZ)) / 1000;
  const estimatedGramsPerUnit = Math.max(
    18,
    Math.round(boundingVolumeCm3 * 0.38 * activeInfill.multiplier * 1.18)
  );
  const customUnitEstimateBrl = Math.max(
    45,
    Math.round(28 + estimatedGramsPerUnit * activeCustomMaterial.pricePerGramBrl)
  );
  const customVolumeDiscount = customQty >= 10 ? 0.85 : customQty >= 5 ? 0.92 : 1.0;
  const customTotalBrl = includeCustomPart
    ? Math.round(customUnitEstimateBrl * customVolumeDiscount) * customQty
    : 0;

  const catalogSubtotalBrl = selectedItems.reduce(
    (sum, item) => sum + item.unitPriceBrl * item.quantity,
    0
  );
  const grandEstimatedTotalBrl = catalogSubtotalBrl + customTotalBrl;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
      setIncludeCustomPart(true);
    }
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (form.fullName.trim().length < 3) {
      nextErrors.fullName = 'Informe seu nome completo.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = 'Digite um e-mail válido para enviarmos o orçamento.';
    }
    const digitsOnly = form.phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      nextErrors.phone = 'Informe um WhatsApp ou telefone com DDD (mínimo 10 dígitos).';
    }
    if (selectedItems.length === 0 && form.projectNotes.trim().length < 10 && !attachedFileName) {
      nextErrors.projectNotes =
        'Descreva brevemente a peça desejada, esforço mecânico ou anexe seu arquivo 3D.';
    }
    return nextErrors;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const protocol = `V3D-${Math.floor(100000 + Math.random() * 900000)}`;
    const summaryLines: string[] = selectedItems.map(
      (item) => `${item.quantity}× ${item.name} (${item.material})`
    );
    if (includeCustomPart) {
      summaryLines.push(
        `${customQty}× Peça sob medida (${dimX}×${dimY}×${dimZ} mm · ${activeCustomMaterial.name}${
          attachedFileName ? ` · Arquivo: ${attachedFileName}` : ''
        })`
      );
    }

    setReceipt({
      protocol,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      estimatedTotalBrl: grandEstimatedTotalBrl,
      summaryLines,
    });
    onClearItems();
  };

  const handleStartNewQuote = () => {
    setReceipt(null);
    setForm({
      fullName: '',
      email: '',
      phone: '',
      cityState: '',
      projectNotes: '',
    });
    setAttachedFileName(null);
    setErrors({});
  };

  return (
    <section
      id="orcamento"
      className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-sky-700 mb-2">
            Orçamento técnico e pedidos sob medida
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Calcule uma estimativa e envie sua peça para análise
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Receba confirmação de viabilidade mecânica, orientação de material e prazo final
            em até 4 horas úteis. Aceitamos arquivos STL, STEP e 3MF ou peça física para
            engenharia reversa.
          </p>
        </div>

        {receipt ? (
          <div className="max-w-2xl bg-white border border-slate-200 rounded-xl p-8 sm:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2
                className="w-7 h-7 text-emerald-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-mono text-slate-500">
                  Protocolo {receipt.protocol} · Solicitação registrada
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">
                  Recebemos seu pedido de orçamento, {receipt.fullName.split(' ')[0]}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Nossa equipe técnica revisará as especificações e enviará a proposta formal
                  com frete para <span className="font-medium text-slate-900">{receipt.email}</span>{' '}
                  e via WhatsApp dentro do horário comercial.
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-200 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Itens incluídos</p>
              <ul className="space-y-1.5 text-sm text-slate-700">
                {receipt.summaryLines.map((line) => (
                  <li key={line} className="font-mono text-xs text-slate-700">
                    {line}
                  </li>
                ))}
              </ul>
              <div className="pt-4 mt-4 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-sm text-slate-600">Estimativa de referência</span>
                <span className="font-mono tabular-nums text-xl font-semibold text-slate-900">
                  {formatBrl(receipt.estimatedTotalBrl)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartNewQuote}
                className="px-5 py-2.5 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Fazer nova solicitação
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left column: Selected catalog parts + Custom part estimator */}
            <div className="lg:col-span-6 space-y-8">
              {/* Selected catalog parts */}
              {selectedItems.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Peças selecionadas do catálogo
                    </h3>
                    <span className="font-mono tabular-nums text-xs text-slate-500">
                      {selectedItems.reduce((acc, i) => acc + i.quantity, 0)} un.
                    </span>
                  </div>

                  <ul className="divide-y divide-slate-200">
                    {selectedItems.map((item) => (
                      <li
                        key={item.key}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">
                            {item.code} · {item.material} · {formatBrl(item.unitPriceBrl)}/un.
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="inline-flex items-center border border-slate-200 rounded-md">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                              aria-label={`Reduzir quantidade de ${item.name}`}
                              className="w-9 h-9 inline-flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-mono tabular-nums text-xs font-medium text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                              aria-label={`Aumentar quantidade de ${item.name}`}
                              className="w-9 h-9 inline-flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-mono tabular-nums text-sm font-semibold text-slate-900 w-20 text-right">
                            {formatBrl(item.unitPriceBrl * item.quantity)}
                          </span>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`Remover ${item.name}`}
                            className="w-9 h-9 inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Custom part estimator */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Simulador de peça sob medida
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Informe dimensões aproximadas para estimar massa e valor
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer whitespace-nowrap shrink-0">
                    <input
                      type="checkbox"
                      checked={includeCustomPart}
                      onChange={(e) => setIncludeCustomPart(e.target.checked)}
                      className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
                    />
                    Incluir no pedido
                  </label>
                </div>

                <div className={`space-y-5 ${includeCustomPart ? '' : 'opacity-50 pointer-events-none'}`}>
                  {/* Material buttons */}
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      Material técnico
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {ENGINEERING_MATERIALS.map((mat) => {
                        const active = mat.id === customMaterialId;
                        return (
                          <button
                            key={mat.id}
                            type="button"
                            onClick={() => setCustomMaterialId(mat.id)}
                            className={`px-3 py-2.5 text-left rounded-md border transition-colors cursor-pointer ${
                              active
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <div className="text-xs font-semibold truncate">{mat.name}</div>
                            <div
                              className={`text-[11px] font-mono tabular-nums mt-0.5 ${
                                active ? 'text-slate-300' : 'text-slate-500'
                              }`}
                            >
                              {mat.tensileStrengthMpa} MPa · até {mat.heatResistanceC} °C
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="dim-x" className="block text-xs font-medium text-slate-700 mb-1">
                        Largura X (mm)
                      </label>
                      <input
                        id="dim-x"
                        type="number"
                        min={10}
                        max={300}
                        value={dimX}
                        onChange={(e) => setDimX(Math.min(300, Math.max(10, Number(e.target.value) || 10)))}
                        className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:border-sky-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="dim-y" className="block text-xs font-medium text-slate-700 mb-1">
                        Profundidade Y (mm)
                      </label>
                      <input
                        id="dim-y"
                        type="number"
                        min={10}
                        max={300}
                        value={dimY}
                        onChange={(e) => setDimY(Math.min(300, Math.max(10, Number(e.target.value) || 10)))}
                        className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:border-sky-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="dim-z" className="block text-xs font-medium text-slate-700 mb-1">
                        Altura Z (mm)
                      </label>
                      <input
                        id="dim-z"
                        type="number"
                        min={5}
                        max={300}
                        value={dimZ}
                        onChange={(e) => setDimZ(Math.min(300, Math.max(5, Number(e.target.value) || 5)))}
                        className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:border-sky-600"
                      />
                    </div>
                  </div>

                  {/* Infill & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label htmlFor="infill-select" className="block text-xs font-medium text-slate-700 mb-1">
                        Resistência mecânica / preenchimento
                      </label>
                      <select
                        id="infill-select"
                        value={customInfillId}
                        onChange={(e) => setCustomInfillId(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-sky-600"
                      >
                        {INFILL_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-4">
                      <label htmlFor="custom-qty" className="block text-xs font-medium text-slate-700 mb-1">
                        Quantidade
                      </label>
                      <input
                        id="custom-qty"
                        type="number"
                        min={1}
                        max={500}
                        value={customQty}
                        onChange={(e) =>
                          setCustomQty(Math.min(500, Math.max(1, Number(e.target.value) || 1)))
                        }
                        className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:border-sky-600"
                      />
                    </div>
                  </div>

                  {/* Optional 3D file upload */}
                  <div>
                    <label
                      htmlFor="cad-file-input"
                      className="flex items-center justify-between gap-3 px-4 py-3 border border-dashed border-slate-300 hover:border-sky-600 rounded-md cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileUp className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
                        <span className="text-xs text-slate-700 truncate">
                          {attachedFileName
                            ? `Arquivo selecionado: ${attachedFileName}`
                            : 'Anexar arquivo 3D opcional (.STL, .STEP, .3MF, .OBJ)'}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-sky-700 whitespace-nowrap shrink-0">
                        {attachedFileName ? 'Trocar' : 'Selecionar'}
                      </span>
                    </label>
                    <input
                      id="cad-file-input"
                      type="file"
                      accept=".stl,.step,.stp,.3mf,.obj,.igs"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </div>
                </div>

                {/* Live summary bar */}
                <div className="pt-5 border-t border-slate-200 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Estimativa total{' '}
                      {includeCustomPart && (
                        <span className="font-mono tabular-nums">
                          · ~{estimatedGramsPerUnit * customQty} g no lote sob medida
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Valor final confirmado após validação da geometria 3D
                    </p>
                  </div>
                  <div className="font-mono tabular-nums text-2xl font-semibold text-slate-900 whitespace-nowrap shrink-0">
                    {formatBrl(grandEstimatedTotalBrl)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Lead & Technical Request Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5"
            >
              <div className="pb-4 border-b border-slate-200">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Dados para retorno do orçamento
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atendimento direto com o técnico responsável pela fabricação
                </p>
              </div>

              <div>
                <label htmlFor="quote-name" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Nome completo
                </label>
                <input
                  id="quote-name"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, fullName: e.target.value }));
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  placeholder="Ex.: Marcos Oliveira"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-md focus:outline-none ${
                    errors.fullName
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-slate-300 focus:border-sky-600'
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-700" role="alert">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quote-email" className="block text-sm font-medium text-slate-800 mb-1.5">
                    E-mail
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="marcos@empresa.com.br"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-md focus:outline-none ${
                      errors.email
                        ? 'border-red-600 focus:border-red-600'
                        : 'border-slate-300 focus:border-sky-600'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-700" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="quote-phone" className="block text-sm font-medium text-slate-800 mb-1.5">
                    WhatsApp / Telefone
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, phone: e.target.value }));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="(11) 98765-4321"
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-md focus:outline-none ${
                      errors.phone
                        ? 'border-red-600 focus:border-red-600'
                        : 'border-slate-300 focus:border-sky-600'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-700" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="quote-city" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Cidade / UF (para cálculo de frete)
                </label>
                <input
                  id="quote-city"
                  type="text"
                  value={form.cityState}
                  onChange={(e) => setForm((prev) => ({ ...prev, cityState: e.target.value }))}
                  placeholder="Ex.: Campinas, SP"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-sky-600"
                />
              </div>

              <div>
                <label htmlFor="quote-notes" className="block text-sm font-medium text-slate-800 mb-1.5">
                  Aplicação mecânica e observações técnicas
                </label>
                <textarea
                  id="quote-notes"
                  rows={4}
                  value={form.projectNotes}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, projectNotes: e.target.value }));
                    if (errors.projectNotes)
                      setErrors((prev) => ({ ...prev, projectNotes: undefined }));
                  }}
                  placeholder="Conte onde a peça será montada, temperatura de trabalho, tipo de esforço ou se precisa de modelagem a partir da peça quebrada."
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-md focus:outline-none resize-y ${
                    errors.projectNotes
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-slate-300 focus:border-sky-600'
                  }`}
                />
                {errors.projectNotes && (
                  <p className="mt-1.5 text-xs text-red-700" role="alert">
                    {errors.projectNotes}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                Enviar solicitação de orçamento
              </button>

              <p className="text-xs text-slate-500 text-center">
                Sem compromisso · Emitimos nota fiscal para pessoa física e jurídica
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

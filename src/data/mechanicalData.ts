export type PartCategory = 'todas' | 'transmissao' | 'suportes' | 'reposicao';

export interface MechanicalPart {
  id: string;
  code: string;
  name: string;
  category: Exclude<PartCategory, 'todas'>;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  defaultMaterial: string;
  availableMaterials: {
    name: string;
    priceMultiplier: number;
    maxTempC: number;
  }[];
  basePriceBrl: number;
  tolerance: string;
  leadTime: string;
  dimensions: string;
  infillSpec: string;
  insertsNote: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

export interface EngineeringMaterial {
  id: string;
  name: string;
  subtitle: string;
  tensileStrengthMpa: number;
  heatResistanceC: number;
  impactRating: string;
  finish: string;
  pricePerGramBrl: number;
  summary: string;
  idealFor: string[];
}

export interface ProductionCase {
  id: string;
  index: string;
  clientSector: string;
  title: string;
  challenge: string;
  solution: string;
  metricValue: string;
  metricLabel: string;
  materialUsed: string;
  turnaround: string;
}

export interface ClientTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  outcome: string;
}

export const HERO_IMAGE = {
  src: '/src/assets/images/hero_mechanical_gears_1795278765611.jpg',
  alt: 'Conjunto de engrenagem planetária, polia dentada e suporte nervurado impressos em 3D em polímero reforçado com fibra de carbono ao lado de um paquímetro digital',
};

export const WORKSHOP_IMAGE = {
  src: '/src/assets/images/workshop_3d_printer_1795278792538.jpg',
  alt: 'Impressora 3D industrial fechada fabricando engrenagem mecânica preta de precisão em oficina de prototipagem',
};

export const MECHANICAL_PARTS: MechanicalPart[] = [
  {
    id: 'engrenagem-helicoidal-pa12',
    code: 'V3D-TR-01',
    name: 'Par de Engrenagens Helicoidais com Rasgo de Chaveta',
    category: 'transmissao',
    categoryLabel: 'Transmissão',
    shortDescription:
      'Conjunto coroa e pinhão com perfil evolvente calibrado para transmissão silenciosa de torque em redutores e alimentadores.',
    fullDescription:
      'Fabricadas com 6 paredes perimetrais sólidas e preenchimento giroidal denso para suportar cargas contínuas de cisalhamento nos dentes. Cubo projetado com rasgo de chaveta e alojamento para parafuso prisioneiro metálico M4.',
    defaultMaterial: 'Nylon PA12-CF',
    availableMaterials: [
      { name: 'PETG Técnico', priceMultiplier: 1.0, maxTempC: 80 },
      { name: 'ABS Industrial', priceMultiplier: 1.15, maxTempC: 98 },
      { name: 'Nylon PA12-CF', priceMultiplier: 1.45, maxTempC: 145 },
    ],
    basePriceBrl: 89,
    tolerance: '±0,10 mm',
    leadTime: 'Envio em 48h',
    dimensions: 'Ø 74 × 18 mm (módulo 1,5)',
    infillSpec: '65% Giroidal · 6 paredes',
    insertsNote: 'Prisioneiro inox M4 incluso',
    image: '/src/assets/images/part_helical_gear_1795278767268.jpg',
    imageAlt: 'Par de engrenagens helicoidais impressas em 3D em Nylon com fibra de carbono sobre bancada técnica',
    featured: true,
  },
  {
    id: 'polia-sincronizadora-insertos',
    code: 'V3D-TR-02',
    name: 'Polia Sincronizadora com Insertos de Latão',
    category: 'transmissao',
    categoryLabel: 'Transmissão',
    shortDescription:
      'Polia dentada perfil HTD 5M ou GT2 com seis insertos roscados de latão instalados a quente para acoplamento direto de flanges.',
    fullDescription:
      'Ideal para linhas de movimentação linear, mesas CNC leves e automação de embalagem. Os insertos metálicos garantem múltiplos ciclos de aperto sem fadiga no polímero.',
    defaultMaterial: 'PETG-CF',
    availableMaterials: [
      { name: 'PETG Técnico', priceMultiplier: 1.0, maxTempC: 80 },
      { name: 'PETG-CF', priceMultiplier: 1.25, maxTempC: 85 },
      { name: 'Nylon PA12-CF', priceMultiplier: 1.5, maxTempC: 145 },
    ],
    basePriceBrl: 64,
    tolerance: '±0,12 mm',
    leadTime: 'Envio em 48h',
    dimensions: 'Ø 60 × 26 mm · Furo Ø 12 mm',
    infillSpec: '55% Cúbico · 5 paredes',
    insertsNote: '6 insertos de latão M4 instalados',
    image: '/src/assets/images/part_timing_pulley_1795278797251.jpg',
    imageAlt: 'Polia sincronizadora dentada preta impressa em 3D com seis insertos roscados de latão no cubo',
  },
  {
    id: 'mancal-motor-nema',
    code: 'V3D-SP-03',
    name: 'Mancal Estrutural para Motor NEMA 23 com Rolamento',
    category: 'suportes',
    categoryLabel: 'Suportes',
    shortDescription:
      'Suporte nervurado de alta rigidez com sede calibrada por interferência para rolamento 6202-2RS e base com quatro furos oblongos.',
    fullDescription:
      'Projetado para substituir suportes usinados em alumínio em equipamentos de baixo a médio esforço térmico, reduzindo peso e tempo de reposição em até 70%.',
    defaultMaterial: 'ABS Industrial',
    availableMaterials: [
      { name: 'PETG Técnico', priceMultiplier: 1.0, maxTempC: 80 },
      { name: 'ABS Industrial', priceMultiplier: 1.15, maxTempC: 98 },
      { name: 'Nylon PA12-CF', priceMultiplier: 1.55, maxTempC: 145 },
    ],
    basePriceBrl: 112,
    tolerance: '±0,10 mm',
    leadTime: 'Envio em 72h',
    dimensions: '92 × 84 × 78 mm',
    infillSpec: '60% Giroidal · 6 paredes',
    insertsNote: 'Sede usinada/calibrada p/ rolamento 6202',
    image: '/src/assets/images/part_motor_bracket_1795278808135.jpg',
    imageAlt: 'Mancal estrutural cinza escuro impresso em 3D com nervuras de reforço e rolamento metálico prensado',
  },
  {
    id: 'carcaca-sensor-sanfona',
    code: 'V3D-RP-04',
    name: 'Carcaça Técnica de Proteção e Coifa Sanfonada',
    category: 'reposicao',
    categoryLabel: 'Reposição',
    shortDescription:
      'Invólucro sob medida para sensores, atuadores e placas industriais acompanhado de coifa flexível em TPU 95A resistente a graxas.',
    fullDescription:
      'Desenvolvida para reposição de componentes descontinuados em máquinas importadas. Combina corpo rígido com furos para prensa-cabos, insertos M3 e acoplamento flexível de proteção contra poeira.',
    defaultMaterial: 'ABS Industrial + TPU 95A',
    availableMaterials: [
      { name: 'PETG + TPU 95A', priceMultiplier: 1.0, maxTempC: 80 },
      { name: 'ABS Industrial + TPU 95A', priceMultiplier: 1.2, maxTempC: 98 },
      { name: 'ASA Externo + TPU 95A', priceMultiplier: 1.35, maxTempC: 102 },
    ],
    basePriceBrl: 138,
    tolerance: '±0,15 mm',
    leadTime: 'Envio em 72h',
    dimensions: '115 × 105 × 68 mm',
    infillSpec: '45% Estrutural + 100% TPU na coifa',
    insertsNote: 'Insertos M3 e parafusos Allen inclusos',
    image: '/src/assets/images/part_industrial_housing_1795278795769.jpg',
    imageAlt: 'Carcaça mecânica preta impressa em 3D com parafusos metálicos e coifa sanfonada flexível ao lado',
  },
];

export const ENGINEERING_MATERIALS: EngineeringMaterial[] = [
  {
    id: 'pa12-cf',
    name: 'Nylon PA12-CF',
    subtitle: 'Poliamida com 15% de fibra de carbono',
    tensileStrengthMpa: 76,
    heatResistanceC: 145,
    impactRating: 'Muito alta',
    finish: 'Preto fosco microtexturizado',
    pricePerGramBrl: 1.45,
    summary:
      'Nosso material de referência para engrenagens, suportes estruturais de alta carga e peças expostas a calor próximo a motores.',
    idealFor: [
      'Engrenagens de transmissão e pinhões',
      'Suportes estruturais e braços robóticos',
      'Peças próximas a motores e atuadores térmicos',
    ],
  },
  {
    id: 'abs-asa',
    name: 'ABS / ASA Industrial',
    subtitle: 'Impresso em câmara aquecida ativa a 65 °C',
    tensileStrengthMpa: 48,
    heatResistanceC: 98,
    impactRating: 'Alta',
    finish: 'Fosco técnico uniforme',
    pricePerGramBrl: 0.78,
    summary:
      'Excelente estabilidade dimensional, fácil usinagem secundária e ótima resistência a impacto. Versão ASA recomendada para exposição solar e intempéries.',
    idealFor: [
      'Carcaças e tampas de reposição automotiva',
      'Mancais, guias e gabaritos de montagem',
      'Componentes externos expostos a sol e chuva (ASA)',
    ],
  },
  {
    id: 'petg-cf',
    name: 'PETG Técnico / PETG-CF',
    subtitle: 'Equilíbrio entre tenacidade e custo-benefício',
    tensileStrengthMpa: 54,
    heatResistanceC: 82,
    impactRating: 'Alta',
    finish: 'Acetinado escuro ou fosco carbono',
    pricePerGramBrl: 0.65,
    summary:
      'Resistente a óleos, graxas e produtos químicos leves, sem absorver umidade excessiva. Ideal para lotes funcionais e reposição rápida.',
    idealFor: [
      'Polias sincronizadoras e acoplamentos',
      'Suportes de sensores e organizadores de linha',
      'Prototipagem funcional de encaixe rápido',
    ],
  },
  {
    id: 'tpu-95a',
    name: 'TPU 95A Industrial',
    subtitle: 'Elastômero termoplástico de alta abrasão',
    tensileStrengthMpa: 39,
    heatResistanceC: 85,
    impactRating: 'Extrema (flexível)',
    finish: 'Emborrachado semibrilho',
    pricePerGramBrl: 0.88,
    summary:
      'Material flexível que suporta torção, compressão repetitiva e contato com lubrificantes sem ressecar ou trincar.',
    idealFor: [
      'Coifas sanfonadas e protetores de fuso',
      'Coxins antivibração e batentes mecânicos',
      'Juntas de vedação e elementos de acoplamento elástico',
    ],
  },
];

export const PRODUCTION_CASES: ProductionCase[] = [
  {
    id: 'caso-embaladora',
    index: '01',
    clientSector: 'Indústria Alimentícia · Campinas, SP',
    title: 'Reposição de engrenagens helicoidais em esteira embaladora',
    challenge:
      'A engrenagem original importada quebrou e o fornecedor solicitou 45 dias de prazo para importação, mantendo a linha de envase parada.',
    solution:
      'Fizemos a engenharia reversa a partir dos fragmentos da peça, corrigimos o raio de adoçamento na raiz do dente e entregamos 4 unidades em Nylon PA12-CF.',
    metricValue: '36 horas',
    metricLabel: 'Do recebimento da peça quebrada à retomada da linha',
    materialUsed: 'Nylon PA12-CF',
    turnaround: '4 unidades entregues',
  },
  {
    id: 'caso-automacao',
    index: '02',
    clientSector: 'Automação Industrial · Sorocaba, SP',
    title: 'Lote de 28 suportes de sensores ópticos com insertos metálicos',
    challenge:
      'A usinagem em alumínio encarecia o projeto de adequação de segurança e exigia ajustes constantes de ângulo durante o comissionamento.',
    solution:
      'Consolidamos três chapas dobradas em uma única peça nervurada impressa em PETG-CF com insertos de latão M4, pronta para fixação direta em perfil estrutural.',
    metricValue: '-64% custo',
    metricLabel: 'Economia direta frente à cotação de usinagem CNC',
    materialUsed: 'PETG-CF + Latão M4',
    turnaround: 'Lote entregue em 5 dias úteis',
  },
  {
    id: 'caso-oficina',
    index: '03',
    clientSector: 'Manutenção Automotiva Especializada · São Paulo, SP',
    title: 'Dutos de admissão sob medida e buchas de comando descontinuadas',
    challenge:
      'Veículos fora de linha sofrem com falta de peças plásticas técnicas no mercado paralelo, travando entregas de restauração.',
    solution:
      'Modelagem CAD paramétrica a partir da medição direta no cofre do motor e produção em ABS Industrial tratado termicamente.',
    metricValue: '±0,10 mm',
    metricLabel: 'Precisão dimensional validada na montagem sem retrabalho',
    materialUsed: 'ABS Industrial',
    turnaround: 'Entrega em 72h',
  },
];

export const TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 'dep-rodrigo',
    quote:
      'A engrenagem de nylon com fibra de carbono rodou dois turnos seguidos sem folga e sem ruído. Evitamos quase um mês de máquina parada esperando peça da Alemanha.',
    author: 'Rodrigo Vasconcelos',
    role: 'Coordenador de Manutenção',
    company: 'Alimentos Serra Azul',
    outcome: 'Linha reativada em 36 horas com custo 70% inferior à importação',
  },
  {
    id: 'dep-camila',
    quote:
      'Mandamos o arquivo STEP na segunda à tarde e na quinta já estávamos montando os mancais nos motores NEMA 23. O encaixe dos rolamentos veio exato na primeira leva.',
    author: 'Camila Nogueira',
    role: 'Engenheira de Projetos',
    company: 'Tática Automação Industrial',
    outcome: '28 suportes entregues no prazo sem necessidade de retrabalho manual',
  },
];

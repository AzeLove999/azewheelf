export const SECTOR_COLORS = [
  '#C4A265', '#8B6F4E', '#D4B896', '#A67C52',
  '#C9908B', '#7D8B6A', '#B8860B', '#CD853F',
  '#D2B48C', '#8B7355', '#BC8F8F', '#DAA520',
  '#BDB76B', '#F4A460', '#DEB887', '#D2691E',
  '#B8A590', '#9C8B74', '#C9B99A', '#A0937D',
  '#E8C9A0', '#917B5D', '#CAAD7E', '#B5936B',
  '#D4C4A8', '#8E7B5F', '#C1A87C', '#A89070',
  '#D5C5A1', '#B09A7A', '#C8B48A', '#9D8768',
];

export const SPEED_CONFIGS = {
  normal: {
    label: 'Обычная',
    duration: 5000,
    minRotations: 4,
    maxRotations: 6,
  },
  fast: {
    label: 'Быстрая',
    duration: 5000,
    minRotations: 5,
    maxRotations: 7,
  },
  ultra: {
    label: 'Ультра',
    duration: 5000,
    minRotations: 7,
    maxRotations: 9,
  },
  gambling: {
    label: 'Азартная',
    duration: 5000,
    minRotations: 4,
    maxRotations: 6,
  },
};

export const ARROW_TYPES = {
  classic: {
    label: 'Классическая',
    color: '#C4A265',
    shape: 'triangle',
  },
  modern: {
    label: 'Модерн',
    color: '#A89070',
    shape: 'diamond',
  },
  elegant: {
    label: 'Элегантная',
    color: '#D4B896',
    shape: 'elegant',
  },
};

export const LOCAL_STORAGE_KEYS = {
  history: 'fortune-wheel-history',
  spinResults: 'fortune-wheel-spin-results',
  settings: 'fortune-wheel-settings',
  itTopUnlocked: 'fortune-wheel-it-top',
};

export const IT_TOP_PASSWORD = 'ittop2026';

export const MAX_SERIES = 5;
export const MIN_SERIES = 1;

export const RIG_PROBABILITY = 1.0;

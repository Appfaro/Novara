'use client';

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  country: string;
  year: string;
  size: string;
  onlyAvailable: boolean;
}

export const defaultFilters: FilterState = {
  minPrice: 0,
  maxPrice: 200,
  country: '',
  year: '',
  size: '',
  onlyAvailable: false,
};

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  countries: string[];
  years: number[];
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Filters({ filters, onChange, countries, years }: Props) {
  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <aside className="w-full space-y-6 border-brand-gray-200 p-4 dark:border-brand-gray-700 sm:w-64 sm:border-r">
      <div>
        <h3 className="mb-2 text-sm font-bold uppercase">Precio</h3>
        <div className="flex items-center gap-2 text-sm">
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) => update('minPrice', Number(e.target.value))}
            className="w-full border border-brand-gray-300 px-2 py-1 dark:bg-brand-black dark:border-brand-gray-600"
          />
          <span>–</span>
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => update('maxPrice', Number(e.target.value))}
            className="w-full border border-brand-gray-300 px-2 py-1 dark:bg-brand-black dark:border-brand-gray-600"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase">País</h3>
        <select
          value={filters.country}
          onChange={(e) => update('country', e.target.value)}
          className="w-full border border-brand-gray-300 px-2 py-2 text-sm dark:bg-brand-black dark:border-brand-gray-600"
        >
          <option value="">Todos</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase">Año del Mundial</h3>
        <select
          value={filters.year}
          onChange={(e) => update('year', e.target.value)}
          className="w-full border border-brand-gray-300 px-2 py-2 text-sm dark:bg-brand-black dark:border-brand-gray-600"
        >
          <option value="">Todos</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase">Talla</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => update('size', filters.size === s ? '' : s)}
              className={`border px-3 py-1 text-xs font-bold ${
                filters.size === s
                  ? 'bg-brand-black text-white dark:bg-white dark:text-brand-black'
                  : 'border-brand-gray-300 dark:border-brand-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.onlyAvailable}
          onChange={(e) => update('onlyAvailable', e.target.checked)}
        />
        Solo disponibles
      </label>

      <button
        onClick={() => onChange(defaultFilters)}
        className="text-xs font-bold uppercase text-brand-red underline"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}

'use client';

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  size: string;
  onlyAvailable: boolean;
  attributes: Record<string, string>;
}

export const defaultFilters: FilterState = {
  minPrice: 0,
  maxPrice: 200,
  size: '',
  onlyAvailable: false,
  attributes: {},
};

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  /** Nombres de atributos disponibles para filtrar en la categoría actual (ej. ["País", "Año"]) */
  availableAttributes: string[];
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Filters({ filters, onChange, availableAttributes }: Props) {
  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value });
  }

  function updateAttribute(name: string, value: string) {
    onChange({ ...filters, attributes: { ...filters.attributes, [name]: value } });
  }

  return (
    <aside className="w-full space-y-4 border-brand-gray-200 p-2 dark:border-brand-gray-700 sm:w-48 sm:border-r">
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

      {availableAttributes.map((attr) => (
        <div key={attr}>
          <h3 className="mb-2 text-sm font-bold uppercase">{attr}</h3>
          <input
            value={filters.attributes[attr] || ''}
            onChange={(e) => updateAttribute(attr, e.target.value)}
            placeholder={`Filtrar por ${attr.toLowerCase()}`}
            className="w-full border border-brand-gray-300 px-2 py-2 text-sm dark:bg-brand-black dark:border-brand-gray-600"
          />
        </div>
      ))}

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
        className="text-xs font-bold uppercase text-brand-gold underline"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}

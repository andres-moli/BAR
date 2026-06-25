import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, AlertCircle, Check } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder = 'Seleccionar...',
      searchable = false,
      fullWidth = true,
      value,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        )
      : options;

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (searchable) {
      return (
        <div className={`${fullWidth ? 'w-full' : ''} relative`} ref={dropdownRef}>
          {label && (
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              {label}
            </label>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`input-base flex items-center justify-between ${
              error ? 'border-red-500' : ''
            } ${!selectedOption ? 'text-gray-500' : 'text-gray-100'} ${className}`}
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-hidden">
              <div className="p-2 border-b border-gray-700">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-700 rounded border border-gray-600 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>
              </div>
              <div className="overflow-y-auto max-h-48">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-gray-500 text-center">
                    Sin resultados
                  </div>
                ) : (
                  filteredOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        const syntheticEvent = {
                          target: { value: opt.value },
                        } as React.ChangeEvent<HTMLSelectElement>;
                        onChange?.(syntheticEvent);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-gray-700 transition-colors ${
                        opt.value === value
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-gray-300'
                      }`}
                    >
                      {opt.label}
                      {opt.value === value && <Check size={14} />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
          {error && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} />
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={onChange}
            className={`input-base appearance-none pr-10 ${
              error ? 'border-red-500' : ''
            } ${!value ? 'text-gray-500' : ''} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

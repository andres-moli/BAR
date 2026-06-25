import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { classNames } from '@/utils/format';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={classNames(
            'w-full bg-dark-800 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-dark-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50',
            icon ? 'pl-10' : '',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50'
              : 'border-dark-600 hover:border-dark-500 focus:border-primary-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-dark-300 mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        className={classNames(
          'w-full bg-dark-800 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-dark-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[80px] resize-y',
          error ? 'border-red-500/50' : 'border-dark-600 hover:border-dark-500 focus:border-primary-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  currency?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, label, error, currency = '$', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-dark-300 mb-1.5">{label}</label>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-400">
          {currency}
        </div>
        <input
          ref={ref}
          type="text"
          className={classNames(
            'w-full bg-dark-800 border rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-dark-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50',
            error ? 'border-red-500/50' : 'border-dark-600 hover:border-dark-500 focus:border-primary-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
CurrencyInput.displayName = 'CurrencyInput';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onChange, ...props }, ref) => (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
      <input
        ref={ref}
        type="text"
        className={classNames(
          'w-full bg-dark-800 border border-dark-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-dark-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
          className
        )}
        onChange={(e) => {
          onChange?.(e);
          onSearch?.(e.target.value);
        }}
        {...props}
      />
    </div>
  )
);
SearchInput.displayName = 'SearchInput';

import { Search as SearchIcon } from 'lucide-react';

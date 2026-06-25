import React, { useState, useMemo, useCallback } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { SearchInput } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  hideOnMobile?: boolean;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  total?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  getRowId?: (item: T) => string | number;
  exportable?: boolean;
  exportFilename?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  filters?: React.ReactNode;
  mobileCardRender?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

function TableInner<T extends Record<string, unknown>>(
  {
    columns,
    data,
    loading = false,
    onRowClick,
    pageSize = 10,
    total = 0,
    currentPage = 1,
    onPageChange,
    onPageSizeChange,
    searchable = false,
    onSearch,
    searchPlaceholder = 'Buscar...',
    selectable = false,
    selectedItems = [],
    onSelectionChange,
    getRowId = (item: T) => String(item.id ?? ''),
    exportable = false,
    exportFilename = 'export',
    emptyMessage = 'No se encontraron resultados',
    emptyIcon,
    filters,
    mobileCardRender,
    className = '',
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [localSearch, setLocalSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleSearch = useCallback(
    (value: string) => {
      setLocalSearch(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? [...data] : []);
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedItems, item]);
    } else {
      onSelectionChange(selectedItems.filter((s) => getRowId(s) !== getRowId(item)));
    }
  };

  const isSelected = (item: T) =>
    selectedItems.some((s) => getRowId(s) === getRowId(item));

  const isAllSelected = data.length > 0 && selectedItems.length === data.length;

  const exportToExcel = () => {
    const exportData = data.map((item) => {
      const row: Record<string, unknown> = {};
      columns.forEach((col) => {
        row[col.label] = item[col.key];
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, `${exportFilename}.xlsx`);
  };

  const exportToPdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const tableColumnHeaders = columns.map((c) => c.label);
    const tableData = data.map((item) =>
      columns.map((col) => {
        const val = item[col.key];
        return val !== null && val !== undefined ? String(val) : '';
      })
    );
    doc.autoTable({
      head: [tableColumnHeaders],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [245, 158, 11] },
    });
    doc.save(`${exportFilename}.pdf`);
  };

  const visibleColumns = columns.filter((c) => !c.hideOnMobile);

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronsUpDown size={14} className="text-gray-600" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={14} className="text-amber-500" />
    ) : (
      <ChevronDown size={14} className="text-amber-500" />
    );
  };

  if (loading) {
    return (
      <div className={`glass-card rounded-xl overflow-hidden ${className}`}>
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              {columns.map((col) => (
                <div key={col.key} className="h-4 bg-gray-800 rounded flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`glass-card rounded-xl overflow-hidden ${className}`}>
      {(searchable || exportable || filters) && (
        <div className="p-4 border-b border-gray-800 flex flex-wrap items-center gap-3">
          {searchable && (
            <div className="flex-1 min-w-[200px]">
              <SearchInput
                placeholder={searchPlaceholder}
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
          {filters && (
            <Button
              variant="ghost"
              size="sm"
              icon={<SlidersHorizontal size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtros
            </Button>
          )}
          {exportable && data.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<FileSpreadsheet size={16} />}
                onClick={exportToExcel}
              >
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<FileText size={16} />}
                onClick={exportToPdf}
              >
                PDF
              </Button>
            </div>
          )}
        </div>
      )}
      {showFilters && filters && (
        <div className="px-4 pb-4 border-b border-gray-800">{filters}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                  />
                </th>
              )}
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer select-none hover:text-gray-200' : ''
                  }`}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    {emptyIcon || <Search size={32} />}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={getRowId(item)}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  } hover:bg-gray-800/30`}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected(item)}
                        onChange={(e) => handleSelectItem(item, e.target.checked)}
                        className="rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                  )}
                  {visibleColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-300">
                      {col.render
                        ? col.render(item, index)
                        : (item[col.key] as React.ReactNode) ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="px-4 py-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Mostrar</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>
              de {total} resultados (pág. {currentPage} de {totalPages})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(1)}
            >
              <ChevronLeft size={16} />
              <ChevronLeft size={16} className="-ml-2" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm text-gray-400 px-2 min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(totalPages)}
            >
              <ChevronRight size={16} />
              <ChevronRight size={16} className="-ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const Table = React.forwardRef(TableInner) as <T extends Record<string, unknown>>(
  props: TableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

export default Table;

import { classNames } from '@/utils/format';
import { getStatusColor } from '@/utils/format';

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge = ({ status, label, size = 'sm' }: StatusBadgeProps) => (
  <span
    className={classNames(
      'inline-flex items-center font-medium rounded-full border',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      getStatusColor(status)
    )}
  >
    {label || status}
  </span>
);

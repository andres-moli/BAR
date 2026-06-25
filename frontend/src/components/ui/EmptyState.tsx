import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 rounded-full bg-dark-700/50 flex items-center justify-center mb-4">
      {icon || <Inbox className="w-8 h-8 text-dark-500" />}
    </div>
    <h3 className="text-lg font-medium text-dark-300 mb-1">{title}</h3>
    {description && <p className="text-sm text-dark-400 text-center max-w-sm mb-4">{description}</p>}
    {action}
  </div>
);

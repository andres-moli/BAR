import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  loading,
}: ConfirmDialogProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex flex-col items-center text-center py-4">
      <div className={classNames(
        'w-12 h-12 rounded-full flex items-center justify-center mb-4',
        variant === 'danger' ? 'bg-red-500/10' : 'bg-primary-500/10'
      )}>
        <AlertTriangle className={classNames(
          'w-6 h-6',
          variant === 'danger' ? 'text-red-400' : 'text-primary-400'
        )} />
      </div>
      <p className="text-dark-300">{message}</p>
    </div>
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button variant={variant} onClick={onConfirm} loading={loading}>
        {confirmText}
      </Button>
    </div>
  </Modal>
);

import { classNames } from '@/utils/format';

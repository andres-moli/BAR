import toast from 'react-hot-toast';

export const handleError = (err: unknown, fallback = 'Error inesperado') => {
  const msg = err instanceof Error ? err.message : fallback;
  toast.error(msg);
};

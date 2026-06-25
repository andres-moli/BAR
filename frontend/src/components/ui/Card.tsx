import { ReactNode } from 'react';
import { classNames } from '@/utils/format';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card = ({ children, className, onClick, hover }: CardProps) => (
  <div
    className={classNames(
      'bg-dark-800/80 backdrop-blur-sm border border-dark-700 rounded-xl p-5',
      hover && 'hover:border-dark-600 hover:bg-dark-800 transition-all duration-200 cursor-pointer',
      onClick && 'cursor-pointer',
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={classNames('px-6 py-4 border-b border-dark-700', className)}>
    {children}
  </div>
);

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export const CardBody = ({ children, className }: CardBodyProps) => (
  <div className={classNames('px-6 py-4', className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className }: CardFooterProps) => (
  <div className={classNames('px-6 py-4 border-t border-dark-700', className)}>
    {children}
  </div>
);

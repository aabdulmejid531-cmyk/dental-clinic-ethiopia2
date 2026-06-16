import { cn } from '../utils/cn';

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', className)} style={{ width: '24px', height: '24px' }} />
  );
};

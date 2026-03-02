import { colors } from '@/lib/constants';

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.porcelain }}>
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 mx-auto mb-4"
          style={{ borderColor: '#e5e5e5', borderTopColor: colors.scarlet }}
        />
        <p className="text-sm" style={{ color: colors.charcoal }}>{message}</p>
      </div>
    </div>
  );
}

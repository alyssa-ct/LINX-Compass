import { colors } from '@/lib/constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variantStyles = {
    primary: {
      backgroundColor: colors.scarlet,
      color: colors.white,
      border: 'none',
    },
    secondary: {
      backgroundColor: colors.indigo,
      color: colors.white,
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.indigo,
      border: `1px solid ${colors.indigo}`,
    },
  };

  return (
    <button
      className={`rounded-lg font-medium transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}

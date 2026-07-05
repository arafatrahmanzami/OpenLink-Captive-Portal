// Small reusable, design-system styled primitives shared across views.

export function Card({ className = '', children, clickable, ...props }) {
  const isClickable = clickable || !!props.onClick;
  return (
    <div
      className={`rounded-base border border-border/30 bg-neutral-primary-soft p-5 sm:p-6 transition-all duration-200
        ${isClickable
          ? 'cursor-pointer shadow-sm hover:shadow-md active:shadow-inset'
          : 'shadow-md'
        }
        ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ icon: Icon, children, className = '' }) {
  return (
    <h3
      className={`mb-6 flex items-center gap-3 text-base md:text-xl font-semibold text-heading ${className}`}
    >
      {Icon && <Icon className="h-5 w-5 text-brand" />}
      {children}
    </h3>
  )
}

export function Button({
  className = '',
  children,
  variant = 'brand', // brand, secondary, tertiary, success, danger, warning, dark, ghost
  size = 'base', // xs, sm, base, lg, xl
  ...props
}) {
  const sizeClasses = {
    xs: 'text-[12px] px-3 py-1.5 rounded-base',
    sm: 'text-[14px] px-3 py-2 rounded-base',
    base: 'text-[14px] px-4 py-2.5 rounded-base',
    lg: 'text-[16px] px-5 py-3 rounded-base',
    xl: 'text-[16px] px-6 py-3.5 rounded-base',
  }

  const variantClasses = {
    brand: 'bg-neutral-primary-soft border border-border/30 text-fg-brand hover:text-fg-brand-strong hover:shadow-md active:shadow-inset focus:ring-brand/20',
    secondary: 'bg-neutral-primary-soft border border-border/30 text-body hover:text-heading hover:shadow-md active:shadow-inset focus:ring-neutral-tertiary/20',
    tertiary: 'bg-neutral-primary-soft border border-border/30 text-body hover:text-heading hover:shadow-md active:shadow-inset focus:ring-neutral-tertiary/20',
    success: 'bg-neutral-primary-soft border border-border/30 text-fg-success hover:text-fg-success-strong hover:shadow-md active:shadow-inset focus:ring-success/20',
    danger: 'bg-neutral-primary-soft border border-border/30 text-fg-danger hover:text-fg-danger-strong hover:shadow-md active:shadow-inset focus:ring-danger/20',
    warning: 'bg-neutral-primary-soft border border-border/30 text-fg-warning hover:text-fg-warning-strong hover:shadow-md active:shadow-inset focus:ring-warning/20',
    dark: 'bg-neutral-primary-soft border border-border/30 text-heading hover:shadow-md active:shadow-inset focus:ring-neutral-tertiary/20',
    ghost: 'bg-transparent border-transparent text-body hover:shadow-sm active:shadow-inset focus:ring-neutral-tertiary/20',
  }

  const isDisabled = props.disabled

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium select-none shadow-sm transition-all duration-200 outline-none focus:outline-none
        ${sizeClasses[size] || sizeClasses.base}
        ${isDisabled
          ? 'bg-neutral-primary-soft border border-border/10 text-fg-disabled cursor-not-allowed shadow-none'
          : (variantClasses[variant] || variantClasses.brand)
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ className = '', error, success, ...props }) {
  return (
    <input
      className={`w-full rounded-base border bg-neutral-primary-soft px-3 py-2.5 text-sm text-heading shadow-inset outline-none transition-all duration-200 placeholder:text-body/60 hover:border-border-default-strong focus:outline-none
        ${error
          ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger/40'
          : success
          ? 'border-success focus:border-success focus:ring-1 focus:ring-success/40'
          : 'border-border/40 focus:border-brand focus:ring-1 focus:ring-brand/40'
        }
        disabled:text-fg-disabled disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
}

export function Select({ className = '', error, success, children, ...props }) {
  return (
    <select
      className={`w-full rounded-base border bg-neutral-primary-soft px-3 py-2.5 text-sm text-heading shadow-inset outline-none transition-all duration-200 hover:border-border-default-strong focus:outline-none
        ${error
          ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger/40'
          : success
          ? 'border-success focus:border-success focus:ring-1 focus:ring-success/40'
          : 'border-border/40 focus:border-brand focus:ring-1 focus:ring-brand/40'
        }
        disabled:text-fg-disabled disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  )
}

export function Field({ label, htmlFor, children, className = '' }) {
  return (
    <div className={`space-y-2 text-left ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-heading"
        >
          {label}
        </label>
      )}
      {children}
    </div>
  )
}

const chipStyles = {
  active: 'bg-success-soft text-fg-success border-border-success/30 shadow-sm',
  expired: 'bg-danger-soft text-fg-danger border-border-danger/30 shadow-sm',
  unused: 'bg-brand-softer text-fg-brand border-border-brand/30 shadow-sm',
}

export function StatusChip({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span
      className={`inline-block rounded-default border px-2.5 py-0.5 text-xs font-semibold ${chipStyles[status] || 'bg-neutral-primary-soft border-border text-heading shadow-sm'}`}
    >
      {label}
    </span>
  )
}

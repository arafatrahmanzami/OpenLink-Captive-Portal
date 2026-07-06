// Small reusable, design-system styled primitives shared across views.

export function Card({ className = '', children, clickable, ...props }) {
  const isClickable = clickable || !!props.onClick;
  return (
    <div
      className={`rounded-none border-2 border-border bg-neutral-primary-soft p-5 sm:p-6 transition-all duration-100 shadow-md
        ${isClickable
          ? 'cursor-pointer hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-xs'
          : ''
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
      className={`mb-6 flex items-center gap-3 text-base md:text-xl font-bold text-heading ${className}`}
    >
      {Icon && (
        <div className="flex items-center justify-center border-2 border-default bg-brand p-1.5 text-black shadow-xs">
          <Icon className="h-5 w-5" />
        </div>
      )}
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
    xs: 'text-[12px] px-3 py-1.5',
    sm: 'text-[14px] px-3 py-2',
    base: 'text-[14px] px-4 py-2.5',
    lg: 'text-[16px] px-5 py-3',
    xl: 'text-[16px] px-6 py-3.5',
  }

  const variantClasses = {
    brand: 'btn-brand',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning',
    dark: 'btn-dark',
    ghost: 'btn-ghost',
  }

  return (
    <button
      className={`btn-base select-none outline-none
        ${sizeClasses[size] || sizeClasses.base}
        ${variantClasses[variant] || variantClasses.brand}
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
      className={`w-full rounded-none border-2 bg-neutral-primary-soft px-3 py-2.5 text-sm text-heading shadow-xs outline-none transition-all duration-150 placeholder:text-body/50 hover:border-border-default-strong focus:outline-none
        ${error
          ? 'border-danger focus:border-danger focus:shadow-[3px_3px_0_0_var(--danger)]'
          : success
          ? 'border-success focus:border-success focus:shadow-[3px_3px_0_0_var(--success)]'
          : 'border-border-default focus:border-brand focus:shadow-sm'
        }
        disabled:bg-disabled disabled:text-fg-disabled disabled:cursor-not-allowed disabled:border-border-light disabled:shadow-none
        ${className}
      `}
      {...props}
    />
  )
}

export function Select({ className = '', error, success, children, ...props }) {
  return (
    <select
      className={`w-full rounded-none border-2 bg-neutral-primary-soft px-3 py-2.5 text-sm text-heading shadow-xs outline-none transition-all duration-150 hover:border-border-default-strong focus:outline-none
        ${error
          ? 'border-danger focus:border-danger focus:shadow-[3px_3px_0_0_var(--danger)]'
          : success
          ? 'border-success focus:border-success focus:shadow-[3px_3px_0_0_var(--success)]'
          : 'border-border-default focus:border-brand focus:shadow-sm'
        }
        disabled:bg-disabled disabled:text-fg-disabled disabled:cursor-not-allowed disabled:border-border-light disabled:shadow-none
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
          className="block text-sm font-semibold text-heading"
        >
          {label}
        </label>
      )}
      {children}
    </div>
  )
}

const chipStyles = {
  active: 'bg-success-soft text-fg-success border-border-success shadow-2xs',
  expired: 'bg-danger-soft text-fg-danger-strong border-border-danger shadow-2xs',
  unused: 'bg-brand-softer text-black border-brand-strong shadow-2xs',
}

export function StatusChip({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span
      className={`inline-block rounded-none border-2 px-2.5 py-0.5 text-xs font-bold ${chipStyles[status] || 'bg-neutral-primary-soft border-border-default text-heading shadow-2xs'}`}
    >
      {label}
    </span>
  )
}

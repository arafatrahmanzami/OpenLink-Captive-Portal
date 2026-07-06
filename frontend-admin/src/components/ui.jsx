// Small reusable, design-system styled primitives shared across views.

export function Card({ className = '', children, clickable, ...props }) {
  const isClickable = clickable || !!props.onClick;
  return (
    <div
      className={`rounded-none border border-border-default bg-neutral-primary-soft p-5 sm:p-6 transition-all duration-200
        ${isClickable
          ? 'cursor-pointer shadow-xs hover:bg-neutral-secondary-medium hover:shadow-sm hover:-translate-y-[1px]'
          : 'shadow-xs'
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
      className={`mb-6 flex items-center gap-3 text-base md:text-xl font-medium text-heading ${className}`}
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
    xs: 'text-[12px] px-3.5 py-2',
    sm: 'text-[14px] px-4 py-2.5',
    base: 'text-[14px] px-5 py-3',
    lg: 'text-[16px] px-6 py-3.5',
    xl: 'text-[16px] px-7 py-4',
  }

  const variantClasses = {
    brand: 'btn-brand',
    secondary: 'btn-secondary btn-glint',
    tertiary: 'btn-tertiary btn-glint',
    success: 'btn-success btn-glint',
    danger: 'btn-danger btn-glint',
    warning: 'btn-warning btn-glint',
    dark: 'btn-dark btn-glint',
    ghost: 'btn-ghost',
  }

  return (
    <button
      className={`btn-base select-none shadow-xs transition-all duration-250 outline-none
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
      className={`w-full rounded-none border bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs outline-none transition-all duration-200 placeholder:text-body-subtle/50 hover:border-border-default-strong focus:outline-none focus:ring-1
        ${error
          ? 'border-danger focus:border-danger focus:ring-danger'
          : success
          ? 'border-success focus:border-success focus:ring-success'
          : 'border-border-default-medium focus:border-brand focus:ring-brand'
        }
        disabled:bg-disabled disabled:text-fg-disabled disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
}

export function Select({ className = '', error, success, children, ...props }) {
  return (
    <select
      className={`w-full rounded-none border bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs outline-none transition-all duration-200 hover:border-border-default-strong focus:outline-none focus:ring-1
        ${error
          ? 'border-danger focus:border-danger focus:ring-danger'
          : success
          ? 'border-success focus:border-success focus:ring-success'
          : 'border-border-default-medium focus:border-brand focus:ring-brand'
        }
        disabled:bg-disabled disabled:text-fg-disabled disabled:cursor-not-allowed
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
  active: 'bg-success-soft text-fg-success-strong border-border-success-subtle shadow-xs',
  expired: 'bg-danger-soft text-fg-danger-strong border-border-danger-subtle shadow-xs',
  unused: 'bg-brand-softer text-fg-brand-strong border-border-brand-subtle shadow-xs',
}

export function StatusChip({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span
      className={`inline-block rounded-none border px-2.5 py-0.5 text-xs font-semibold ${chipStyles[status] || 'bg-neutral-primary-soft border-border-default text-heading shadow-xs'}`}
    >
      {label}
    </span>
  )
}

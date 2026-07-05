// Small reusable, design-system styled primitives shared across views.

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-base border border-border bg-neutral-primary-soft p-5 shadow-xs sm:p-6 ${className}`}
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
    xs: 'text-[12px] px-3 py-1.5 rounded-base',
    sm: 'text-[14px] px-3 py-2 rounded-base',
    base: 'text-[14px] px-4 py-2.5 rounded-base',
    lg: 'text-[16px] px-5 py-3 rounded-base',
    xl: 'text-[16px] px-6 py-3.5 rounded-base',
  }

  const variantClasses = {
    brand: 'bg-brand border-transparent text-white hover:bg-brand-strong focus:ring-brand-medium/50 glint-effect',
    secondary: 'bg-neutral-secondary-medium border-border-default-medium text-body hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-neutral-tertiary/50 glint-effect',
    tertiary: 'bg-neutral-primary-soft border-border-default text-body hover:bg-neutral-secondary-medium hover:text-heading focus:ring-neutral-tertiary-soft/50 glint-effect',
    success: 'bg-success border-transparent text-white hover:bg-success-strong focus:ring-success-medium/50 glint-effect',
    danger: 'bg-danger border-transparent text-white hover:bg-danger-strong focus:ring-danger-medium/50 glint-effect',
    warning: 'bg-warning border-transparent text-white hover:bg-warning-strong focus:ring-warning-medium/50 glint-effect',
    dark: 'bg-dark border-transparent text-black hover:bg-dark-strong focus:ring-neutral-tertiary/50 glint-effect',
    ghost: 'bg-transparent border-transparent text-heading hover:bg-neutral-secondary-medium focus:ring-neutral-tertiary/50',
  }

  const isDisabled = props.disabled

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 border font-medium transition duration-150 focus:outline-none focus:ring-4 select-none
        ${sizeClasses[size] || sizeClasses.base}
        ${isDisabled
          ? 'bg-disabled border-border-default-medium text-fg-disabled cursor-not-allowed shadow-none'
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
      className={`w-full rounded-base border bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs outline-none transition duration-200 placeholder:text-body hover:border-border-default-strong focus:outline-none
        ${error
          ? 'border-border-danger focus:border-border-danger focus:ring-1 focus:ring-danger'
          : success
          ? 'border-border-success focus:border-border-success focus:ring-1 focus:ring-success'
          : 'border-border-default-medium focus:border-brand focus:ring-1 focus:ring-brand'
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
      className={`w-full rounded-base border bg-neutral-secondary-medium px-3 py-2.5 text-sm text-heading shadow-xs outline-none transition duration-200 hover:border-border-default-strong focus:outline-none
        ${error
          ? 'border-border-danger focus:border-border-danger focus:ring-1 focus:ring-danger'
          : success
          ? 'border-border-success focus:border-border-success focus:ring-1 focus:ring-success'
          : 'border-border-default-medium focus:border-brand focus:ring-1 focus:ring-brand'
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
  active: 'bg-success-soft text-fg-success-strong border-border-success-subtle',
  expired: 'bg-danger-soft text-fg-danger-strong border-border-danger-subtle',
  unused: 'bg-brand-softer text-fg-brand-strong border-border-brand-subtle',
}

export function StatusChip({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span
      className={`inline-block rounded-default border px-1.5 py-0.5 text-xs font-medium ${chipStyles[status] || 'bg-neutral-primary-soft border-border-default text-heading'}`}
    >
      {label}
    </span>
  )
}

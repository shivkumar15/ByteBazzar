export default function TextField({
  label,
  name,
  as,
  hint,
  className = "",
  children,
  ...props
}) {
  const Tag = as || "input";
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <Tag id={name} name={name} className="input" {...props}>
        {children}
      </Tag>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

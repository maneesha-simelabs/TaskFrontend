function Input({
  label,
  type = "text",
  value,
  required,
  onChange,
  placeholder,
  name,
  error,
  className,
  ...props
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Input;

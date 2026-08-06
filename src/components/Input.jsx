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
  const inputId = name || label?.toLowerCase().replace(/\s+/g, "-");
  const inputProps = {
    id: inputId,
    name: name || inputId,
    value: value ?? "",
    onChange,
    placeholder,
    className,
    "aria-invalid": Boolean(error),
    ...props,
  };

  return (
    <div className="form-group">
      <label htmlFor={inputId}>
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea {...inputProps} />
      ) : (
        <input type={type} {...inputProps} />
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default Input;

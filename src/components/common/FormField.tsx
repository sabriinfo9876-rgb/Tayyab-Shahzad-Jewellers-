import React, { useId } from "react";
type Props = {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactElement<any>;
  className?: string;
};
export function FormField({
  label,
  error,
  hint,
  children,
  className = "",
}: Props) {
  const id = useId();
  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error || hint ? id + "-help" : undefined,
      })}
      {(error || hint) && (
        <small id={id + "-help"} className={error ? "field-error" : ""}>
          {error || hint}
        </small>
      )}
    </div>
  );
}

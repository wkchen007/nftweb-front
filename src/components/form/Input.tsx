import React, { forwardRef } from "react";

type InputProps = {
  name: string;
  title: string;
  type?: string;
  className?: string;
  placeholder?: string;
  autoComplete?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  errorDiv?: string;
  errorMsg?: string;
};

// forwardRef 需要兩個型別參數：ref 的型別 + props 的型別
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      title,
      type = "text",
      className = "form-control",
      placeholder,
      autoComplete,
      value,
      onChange,
      errorDiv = "",
      errorMsg = "",
    },
    ref
  ) => {
    return (
      <div className="mb-3">
        <label htmlFor={name} className="form-label">
          {title}
        </label>
        <input
          type={type}
          className={className}
          id={name}
          ref={ref}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          value={value}
        />
        <div className={errorDiv}>{errorMsg}</div>
      </div>
    );
  }
);

Input.displayName = "Input"; // 🔸 forwardRef 需要設定 displayName 方便除錯

export default Input;

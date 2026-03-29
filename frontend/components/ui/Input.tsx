import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-medical-textSecondary mb-1 block pl-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-white border border-medical-border rounded-xl px-4 py-3.5 
          text-sm font-bold text-medical-textPrimary 
          placeholder:text-medical-textSecondary/40 
          focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 
          outline-none transition-all duration-300
          ${error ? "border-emergency focus:ring-emergency/10 focus:border-emergency" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-black text-emergency uppercase tracking-wider pl-1">
          {error}
        </p>
      )}
    </div>
  );
};

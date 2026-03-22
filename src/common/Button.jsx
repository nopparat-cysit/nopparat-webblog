import React from "react";

const Button = ({
  variant = "primary",
  children,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses =
    "cursor-pointer inline-flex items-center justify-center font-medium px-8 py-3 rounded-full min-h-12 min-w-[127px] gap-1.5 border text-sm transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:translate-y-0";

  const variantClasses = {
    primary:
      "bg-brown-600 text-white border-brown-600 hover:bg-brown-700 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-brown-600/50",
    secondary:
      "bg-white text-brown-600 border-brown-600 hover:bg-brown-50 hover:border-brown-500 hover:shadow-md hover:-translate-y-0.5",
    /** ขาว ขอบดำ ตัวอักษรดำ — ตาม mockup ปุ่ม Upload profile picture */
    outlineDark:
      "bg-white text-neutral-900 border-neutral-900 hover:bg-neutral-50 hover:border-neutral-800",
    /** พื้นดำ/charcoal ตัวอักษรขาว — ตาม mockup ปุ่ม Save */
    dark: "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-md",
  };

  const resolved =
    variantClasses[variant] ?? variantClasses.primary;

  return (
    <button
      className={`${baseClasses} ${resolved} ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;


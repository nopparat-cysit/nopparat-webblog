import React from "react";

const Button = ({ variant = "primary", children }) => {
  const baseClasses = `flex items-center justify-center font-medium px-10 py-3 rounded-full h-12 min-w-[127px] gap-1.5 border text-sm`;
  
  const variantClasses =
    variant === "secondary"
      ? "bg-white text-brown-600 border-brown-600"
      : "bg-brown-600 text-white border-brown-600";

  return (
    <button className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  );
};

export default Button;


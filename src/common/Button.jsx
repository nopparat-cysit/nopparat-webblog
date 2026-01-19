import React from "react";

const Button = ({ variant = "primary", children, onClick, ...props }) => {
  const baseClasses = `flex items-center justify-center font-medium px-10 py-3 rounded-full h-12 min-w-[127px] gap-1.5 border text-sm transition-all duration-300 transform active:scale-95`;
  
  const variantClasses =
    variant === "secondary"
      ? "bg-white text-brown-600 border-brown-600 hover:bg-brown-50 hover:border-brown-500 hover:shadow-md hover:-translate-y-0.5"
      : "bg-brown-600 text-white border-brown-600 hover:bg-brown-700 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-brown-600/50";

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick} {...props}>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;


import React from "react";

type ButtonProps = {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger"; // different button styles
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ onClick, variant = "primary", children }) => {
  let variantStyle = "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50";

  if (variant === "primary") {
    variantStyle = "text-white bg-indigo-600 hover:bg-indigo-500";
  } else if (variant === "secondary") {
    variantStyle = "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50";
  } else if (variant === "danger") {
    variantStyle = "text-white bg-red-500 hover:bg-red-600";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`block rounded-md px-3 py-2 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variantStyle}`}
    >
      {children}
    </button>
  );
};

export default Button;

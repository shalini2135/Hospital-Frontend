import React from 'react';
import classNames from 'classnames';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles =
    'px-4 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(baseStyles, variants[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

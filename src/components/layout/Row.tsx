import React from 'react';

interface RowProps {
  gutter?: [number, number];
  align?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
}

const Row: React.FC<RowProps> = ({ children, style, className = '', align, gutter, ...props }) => {
  const alignClass = align === 'center' ? 'justify-center items-center' : '';
  const gutterStyles = gutter ? { gap: `${gutter[1]}px ${gutter[0]}px` } : {};
  
  return (
    <div className={`flex flex-wrap ${alignClass} ${className}`} style={{ ...style, ...gutterStyles }}>
      {children}
    </div>
  );
};

export default Row;
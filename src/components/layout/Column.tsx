import React from 'react';

interface ColumnProps {
  xs?: number;
  md?: number;
  lg?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
}

const Column: React.FC<ColumnProps> = ({ xs, md, lg, children, style, className = '' }) => {
  let responsiveClasses = 'flex-1 px-2';

  // Convert grid system to Tailwind responsive classes
  if (lg === 6) responsiveClasses = 'w-full lg:w-1/4';
  else if (md === 12) responsiveClasses = 'w-full md:w-1/2';
  else if (xs === 24) responsiveClasses = 'w-full';

  return (
    <div className={`${responsiveClasses} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Column;
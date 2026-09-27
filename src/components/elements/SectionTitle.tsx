import React from 'react';

interface SectionTitleProps extends React.PropsWithChildren {
  style?: React.CSSProperties;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, style, className = '' }) => (
  <h2 className={`text-3xl font-bold text-slate-800 mb-6 text-center ${className}`} style={style}>{children}</h2>
);

export default SectionTitle;
import React from 'react';

interface ContainerProps extends React.PropsWithChildren {
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => (
  <div className={`max-w-6xl mx-auto px-5 ${className}`}>{children}</div>
);

export default Container; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'glow';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  onClick,
  className = '',
  variant = 'default'
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };
  
  return (
    <div 
      className={`flex items-center cursor-pointer ${className} ${variant === 'glow' ? 'filter drop-shadow-lg' : ''}`}
      onClick={handleClick}
    >
      <Mountain 
        size={iconSizes[size]} 
        className={`mr-1.5 ${variant === 'glow' ? 'text-primary-cyan-500 filter drop-shadow-glow' : 'text-primary-cyan-500'}`} 
      />
      <span className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 bg-clip-text text-transparent ${variant === 'glow' ? 'filter drop-shadow-glow' : ''}`}>
        GAGE
      </span>
    </div>
  );
};

export default Logo;


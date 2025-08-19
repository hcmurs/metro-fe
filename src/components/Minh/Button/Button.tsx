import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps } from 'antd';
import { COLOR } from '../../../constants/color';

interface CustomButtonProps extends Omit<ButtonProps, 'style' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline';
  hoverEffect?: 'scale' | 'shadow' | 'none';
  customStyle?: React.CSSProperties;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  hoverEffect = 'scale',
  size = 'large',
  customStyle,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLOR.GREEN_200,
          borderColor: COLOR.GREEN_200,
          color: 'black'
        };
      case 'secondary':
        return {
          backgroundColor: COLOR.GREEN_100,
          borderColor: COLOR.GREEN_100,
          color: 'black'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: COLOR.GREEN_200,
          color: COLOR.GREEN_500
        };
      default:
        return {
          backgroundColor: COLOR.GREEN_200,
          borderColor: COLOR.GREEN_200,
          color: 'black'
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    fontSize: '16px',
    fontWeight: '600',
    ...getVariantStyles(),
    ...customStyle
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    
    // Apply variant-specific hover styles
    switch (variant) {
      case 'primary':
        target.style.backgroundColor = COLOR.GREEN_300;
        target.style.borderColor = COLOR.GREEN_300;
        break;
      case 'secondary':
        target.style.backgroundColor = COLOR.GREEN_200;
        target.style.borderColor = COLOR.GREEN_200;
        break;
      case 'outline':
        target.style.backgroundColor = COLOR.GREEN_50;
        target.style.borderColor = COLOR.GREEN_300;
        break;
    }

    target.style.color = 'black';
    target.style.transition = 'all 0.3s ease-in-out';

    // Apply hover effects
    switch (hoverEffect) {
      case 'scale':
        target.style.transform = 'scale(1.05)';
        target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        break;
      case 'shadow':
        target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        break;
      case 'none':
        break;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    
    // Reset to original variant styles
    const originalStyles = getVariantStyles();
    target.style.backgroundColor = originalStyles.backgroundColor;
    target.style.borderColor = originalStyles.borderColor;
    target.style.color = originalStyles.color;
    target.style.transform = 'scale(1)';
    target.style.boxShadow = 'none';
    target.style.transition = 'all 0.3s ease-in-out';
  };

  return (
    <AntButton
      size={size}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
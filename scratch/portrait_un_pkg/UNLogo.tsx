import React from 'react';

type UNLogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * Uses the supplied UN monogram as an image so the approved mark is preserved.
 *
 * Example:
 * <UNLogo size={38} />
 */
export function UNLogo({
  size = 38,
  className = '',
  title = 'UN',
}: UNLogoProps) {
  return (
    <img
      src="/assets/un-logo.png"
      width={size}
      height={size}
      alt={title}
      className={`portfolio-un-logo ${className}`}
      draggable={false}
    />
  );
}

export default UNLogo;

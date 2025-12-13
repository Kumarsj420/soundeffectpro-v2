import { useCallback } from 'react';

/**
 * Custom hook for abbreviating numbers similar to YouTube's format (1K, 1.2M, etc.)
 * @returns {Function} abbreviateNumber function
 */
export function useNumberAbbreviation() {
  const abbreviateNumber = useCallback((value, decimals = 1) => {
    // Handle edge cases
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }

    // Convert to absolute value for processing (handle negative numbers)
    const isNegative = value < 0;
    const absValue = Math.abs(value);

    // Define the abbreviation tiers
    const tiers = [
      { threshold: 1e12, suffix: 'T' },  // Trillion
      { threshold: 1e9, suffix: 'B' },   // Billion
      { threshold: 1e6, suffix: 'M' },   // Million
      { threshold: 1e3, suffix: 'K' },   // Thousand
    ];

    // Find the appropriate tier
    for (const tier of tiers) {
      if (absValue >= tier.threshold) {
        const scaled = absValue / tier.threshold;
        
        // Round to specified decimal places
        const rounded = Math.floor(scaled * Math.pow(10, decimals)) / Math.pow(10, decimals);
        
        // Format the number
        let formatted = rounded.toFixed(decimals);
        
        // Remove trailing zeros after decimal point
        formatted = formatted.replace(/\.0+$/, '');
        
        // Return with negative sign if needed
        return `${isNegative ? '-' : ''}${formatted}${tier.suffix}`;
      }
    }

    // For numbers less than 1000, return as is with comma formatting
    return (isNegative ? '-' : '') + absValue.toLocaleString('en-US', {
      maximumFractionDigits: 0
    });
  }, []);

  return abbreviateNumber;
}

// Usage in components:
// const abbreviateNumber = useNumberAbbreviation();
// <span>{abbreviateNumber(1130000)}</span>  // Shows "1.1M"
// <span>{abbreviateNumber(1020)}</span>     // Shows "1K"
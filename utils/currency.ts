import { SUPPORTED_CURRENCIES } from '../constants';

type Rates = { [key: string]: number } | null;

export const formatCurrency = (priceInUsd: number, targetCurrency: string, rates: Rates): string => {
  const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === targetCurrency);
  const symbol = currencyInfo?.symbol || '$';
  
  if (!rates || targetCurrency === 'USD') {
    const formattedPrice = priceInUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return `${symbol}${formattedPrice}`;
  }

  const rate = rates[targetCurrency];
  if (typeof rate !== 'number') {
    // Fallback if rate is missing
    const formattedPrice = priceInUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return `$${formattedPrice} (USD)`;
  }

  const convertedPrice = priceInUsd * rate;
  const formattedPrice = convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  
  return `${symbol}${formattedPrice}`;
};

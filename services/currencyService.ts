const API_KEY = process.env.EXCHANGE_RATE_API_KEY || 'YOUR_API_KEY'; // Fallback for local dev
const BASE_URL = 'https://v6.exchangerate-api.com/v6';

interface ExchangeRateResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
}

export const getExchangeRates = async (baseCurrency: string = 'USD'): Promise<ExchangeRateResponse> => {
  if (API_KEY === 'YOUR_API_KEY') {
    console.warn('Using placeholder API Key for currency conversion. Please set EXCHANGE_RATE_API_KEY.');
    // Return mock data if no key is provided to avoid breaking the app
    return Promise.resolve({
        result: "success",
        documentation: "https://www.exchangerate-api.com/docs",
        terms_of_use: "https://www.exchangerate-api.com/terms",
        time_last_update_unix: Date.now() / 1000,
        time_last_update_utc: new Date().toUTCString(),
        time_next_update_unix: Date.now() / 1000 + 86400,
        time_next_update_utc: new Date(Date.now() + 86400000).toUTCString(),
        base_code: "USD",
        conversion_rates: {
            "USD": 1,
            "EUR": 0.92,
            "JPY": 157,
            "GBP": 0.78,
            "AUD": 1.5,
            "CAD": 1.37,
            "CHF": 0.89,
            "CNY": 7.25,
            "INR": 83.5,
            "PKR": 278.5,
        }
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${baseCurrency}`);
    if (!response.ok) {
      throw new Error(`Currency API request failed with status ${response.status}`);
    }
    const data: ExchangeRateResponse = await response.json();
    if (data.result !== 'success') {
        throw new Error(`Currency API returned an error: ${data['error-type'] || 'Unknown error'}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw new Error("Failed to fetch exchange rates. Please check your connection or API key.");
  }
};

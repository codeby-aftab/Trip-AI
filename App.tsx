import React, { useState, useCallback, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { ResultsPage } from './components/ResultsPage';
import { generateTripPlan } from './services/geminiService';
import { getExchangeRates } from './services/currencyService';
import type { TripPlan } from './types';

type View = 'HOME' | 'RESULTS';
type Rates = { [key: string]: number };

const App: React.FC = () => {
  const [view, setView] = useState<View>('HOME');
  const [tripPlans, setTripPlans] = useState<TripPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userBudget, setUserBudget] = useState(2000);
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState<Rates | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const data = await getExchangeRates('USD');
        setRates(data.conversion_rates);
      } catch (error) {
        console.error("Could not fetch exchange rates.", error);
        setError("Could not fetch exchange rates. Prices will be shown in USD.");
      }
    };
    fetchRates();
  }, []);

  const handleGenerateTrip = useCallback(async (origin: string, destination: string, budget: number, budgetCurrency: string) => {
    setIsLoading(true);
    setError(null);
    setUserBudget(budget);
    setCurrency(budgetCurrency);

    let budgetInUsd = budget;
    if (budgetCurrency !== 'USD' && rates) {
      const rate = rates[budgetCurrency];
      if (rate) {
        budgetInUsd = budget / rate;
      } else {
         setError(`Could not find exchange rate for ${budgetCurrency}. Using USD as base.`);
      }
    } else if (budgetCurrency !== 'USD' && !rates) {
      setError(`Exchange rates not loaded. Cannot convert from ${budgetCurrency}.`);
      setIsLoading(false);
      return;
    }

    try {
      const plans = await generateTripPlan(origin, destination, budgetInUsd);
      setTripPlans(plans);
      setView('RESULTS');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      // Stay on home page to show error
    } finally {
      setIsLoading(false);
    }
  }, [rates]);

  const handleBackToHome = () => {
    setView('HOME');
    setTripPlans(null);
    // Do not clear the main error, as it might be a persistent one like failed rate fetch
  };
  
  const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed top-5 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    </div>
  );

  return (
    <div className="bg-white">
      {error && <ErrorDisplay message={error} />}
      {view === 'HOME' ? (
        <>
          <HeroSection onGenerate={handleGenerateTrip} isLoading={isLoading} />
          <HowItWorks />
          <Footer />
        </>
      ) : tripPlans ? (
        <ResultsPage plans={tripPlans} userBudget={userBudget} currency={currency} rates={rates} onBack={handleBackToHome} />
      ) : null}
    </div>
  );
};

export default App;
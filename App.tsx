import React, { useState, useCallback, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ResultsPage } from './components/ResultsPage';
import { SavedTripsPage } from './components/SavedTripsPage';
import { AuthModal } from './components/AuthModal';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { generateTripPlan } from './services/geminiService';
import { getExchangeRates } from './services/currencyService';
import type { TripPlan } from './types';

type View = 'HOME' | 'RESULTS' | 'SAVED_TRIPS';
type AuthModalView = 'LOGIN' | 'SIGNUP';
type Rates = { [key: string]: number };
type UserProfile = { name: string; homeCity: string; };

const App: React.FC = () => {
  const [view, setView] = useState<View>('HOME');
  const [currentPlansForDisplay, setCurrentPlansForDisplay] = useState<TripPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userBudget, setUserBudget] = useState(2000);
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState<Rates | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [authModal, setAuthModal] = useState<AuthModalView | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (view !== 'HOME') {
      setIsScrolled(false);
      return;
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [view]);

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

    try {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            const storedTrips = localStorage.getItem('savedTrips');
            if (storedTrips) {
                setSavedTrips(JSON.parse(storedTrips));
            }
        }
    } catch (e) {
        console.error("Failed to parse from localStorage", e);
        // Clear broken storage
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
        setSavedTrips([]);
    }
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
      setCurrentPlansForDisplay(plans);
      setView('RESULTS');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [rates]);

  const handleLogin = (name?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    // If it's a signup (name is provided), create a new user profile
    if (name) {
      const newUser = { name, homeCity: '' };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    setAuthModal(null);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setUser(null);
      // Keep saved trips in case they log back in? For now, we clear everything.
      setSavedTrips([]);
      localStorage.clear();
      if (view === 'SAVED_TRIPS') {
          setView('HOME');
      }
  };
  
  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('user', JSON.stringify(updatedProfile));
  };
  
  const handleDeleteAccount = () => {
    setIsLoggedIn(false);
    setUser(null);
    setSavedTrips([]);
    localStorage.clear();
    setView('HOME');
    alert("Your account has been successfully deleted.");
  };

  const handleSaveTrip = (planToSave: TripPlan) => {
      if (savedTrips.some(trip => trip.planName === planToSave.planName && trip.destination === planToSave.destination && trip.totalCost === planToSave.totalCost)) {
          alert("Trip already saved!");
          return;
      }
      const newSavedTrips = [...savedTrips, planToSave];
      setSavedTrips(newSavedTrips);
      localStorage.setItem('savedTrips', JSON.stringify(newSavedTrips));
      alert("Trip saved successfully!");
  };

  const handleViewSavedTrip = (trip: TripPlan) => {
      setCurrentPlansForDisplay([trip]);
      setView('RESULTS');
  };

  const handleGoHome = () => {
    setView('HOME');
    setCurrentPlansForDisplay(null);
  };
  
  const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed top-24 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    </div>
  );
  
  const renderView = () => {
    switch(view) {
      case 'HOME':
        return (
          <>
            <HeroSection onGenerate={handleGenerateTrip} isLoading={isLoading} />
            <HowItWorks />
          </>
        );
      case 'RESULTS':
        return currentPlansForDisplay ? (
          <main className="pt-20">
            <ResultsPage 
              plans={currentPlansForDisplay} 
              userBudget={userBudget} 
              currency={currency} 
              rates={rates}
              isLoggedIn={isLoggedIn}
              onSaveTrip={handleSaveTrip}
              onRequestLogin={() => setAuthModal('LOGIN')}
              onGoBack={handleGoHome}
            />
          </main>
        ) : null;
      case 'SAVED_TRIPS':
        return isLoggedIn && user ? (
          <main className="pt-20">
            <SavedTripsPage
              user={user}
              savedTrips={savedTrips}
              onViewTrip={handleViewSavedTrip}
              onUpdateProfile={handleUpdateProfile}
              onDeleteAccount={handleDeleteAccount}
              currency={currency}
              rates={rates}
            />
          </main>
        ) : null;
      default:
        return null;
    }
  }

  return (
    <div className="bg-white">
      {error && <ErrorDisplay message={error} />}
       <Header
        variant={view === 'HOME' && !isScrolled ? 'transparent' : 'solid'}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setAuthModal('LOGIN')}
        onSignupClick={() => setAuthModal('SIGNUP')}
        onLogoutClick={handleLogout}
        onMyTripsClick={() => setView('SAVED_TRIPS')}
        onHomeClick={handleGoHome}
      />
      {renderView()}

      <Footer />

      <AuthModal isOpen={!!authModal} onClose={() => setAuthModal(null)}>
        {authModal === 'LOGIN' && (
          <LoginForm onLogin={() => handleLogin()} onSwitchToSignup={() => setAuthModal('SIGNUP')} />
        )}
        {authModal === 'SIGNUP' && (
          <SignupForm onSignup={handleLogin} onSwitchToLogin={() => setAuthModal('LOGIN')} />
        )}
      </AuthModal>
    </div>
  );
};

export default App;
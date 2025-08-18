import React from 'react';

interface HeaderProps {
  variant: 'transparent' | 'solid';
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onMyTripsClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  variant, 
  isLoggedIn, 
  onLoginClick, 
  onSignupClick, 
  onLogoutClick,
  onMyTripsClick,
  onHomeClick
}) => {
  const isTransparent = variant === 'transparent';
  
  const headerClasses = `fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isTransparent ? 'bg-transparent text-white' : 'bg-white text-gray-800 shadow-sm'}`;
  const linkBaseClasses = 'px-4 py-2 rounded-lg font-semibold transition-colors text-sm';
  const textShadow = isTransparent ? { textShadow: '0 1px 3px rgba(0,0,0,0.4)' } : {};

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={onHomeClick} className="text-xl font-bold tracking-tight" style={textShadow}>AI Trip Planner</button>
        <nav className="flex items-center space-x-2 md:space-x-4">
          {isLoggedIn ? (
            <>
              <button onClick={onMyTripsClick} className={`${isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${linkBaseClasses}`}>
                My Trips
              </button>
              <button onClick={onLogoutClick} className={`bg-gray-500 text-white shadow-md hover:opacity-90 ${linkBaseClasses}`}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className={`${isTransparent ? 'hover:bg-white/10' : 'hover:bg-gray-100'} ${linkBaseClasses}`}>
                Log In
              </button>
              <button onClick={onSignupClick} className={`bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-md hover:opacity-90 ${linkBaseClasses}`}>
                Sign Up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
import React, { useState } from 'react';
import type { TripPlan } from '../types';
import { formatCurrency } from '../utils/currency';
import { ProfileSettings } from './ProfileSettings';
import { AccountSettings } from './AccountSettings';
import { ConfirmationModal } from './ConfirmationModal';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { UserIcon } from './icons/UserIcon';
import { SettingsIcon } from './icons/SettingsIcon';

type Rates = { [key: string]: number } | null;
type UserProfile = { name: string; homeCity: string; };
type ActiveTab = 'trips' | 'profile' | 'account';

interface SavedTripsPageProps {
  user: UserProfile;
  savedTrips: TripPlan[];
  onViewTrip: (trip: TripPlan) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onDeleteAccount: () => void;
  currency: string;
  rates: Rates;
}

const TripCard: React.FC<{ trip: TripPlan; onView: () => void; currency: string; rates: Rates; }> = ({ trip, onView, currency, rates }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
        <div>
            <p className="text-sm font-semibold text-cyan-600">{trip.planName}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{trip.destination}</h3>
            <p className="text-gray-600 mt-2 line-clamp-3">{trip.summary}</p>
        </div>
        <div className="mt-6 flex justify-between items-center">
            <div>
                <p className="text-gray-500 text-sm">Total Cost</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(trip.totalCost, currency, rates)}</p>
            </div>
            <button onClick={onView} className="px-5 py-2 bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity">
                View Details
            </button>
        </div>
    </div>
);


const SidebarNav: React.FC<{ activeTab: ActiveTab; setActiveTab: (tab: ActiveTab) => void }> = ({ activeTab, setActiveTab }) => {
    const navItemClasses = "flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors";
    const activeClasses = "bg-sky-100 text-sky-700";
    const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

    return (
        <aside className="w-full md:w-64 flex-shrink-0 md:pr-8">
            <nav className="space-y-2">
                <button
                    onClick={() => setActiveTab('trips')}
                    className={`${navItemClasses} ${activeTab === 'trips' ? activeClasses : inactiveClasses}`}
                >
                    <BookmarkIcon className="w-5 h-5 mr-3" /> My Trips
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`${navItemClasses} ${activeTab === 'profile' ? activeClasses : inactiveClasses}`}
                >
                    <UserIcon className="w-5 h-5 mr-3" /> Profile Settings
                </button>
                 <button
                    onClick={() => setActiveTab('account')}
                    className={`${navItemClasses} ${activeTab === 'account' ? activeClasses : inactiveClasses}`}
                >
                    <SettingsIcon className="w-5 h-5 mr-3" /> Account Settings
                </button>
            </nav>
        </aside>
    );
};


export const SavedTripsPage: React.FC<SavedTripsPageProps> = ({ user, savedTrips, onViewTrip, onUpdateProfile, onDeleteAccount, currency, rates }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('trips');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'trips':
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Saved Trips</h2>
                        {savedTrips.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {savedTrips.map((trip, index) => (
                                    <TripCard
                                        key={`${index}-${trip.destination}`}
                                        trip={trip}
                                        onView={() => onViewTrip(trip)}
                                        currency={currency}
                                        rates={rates}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center bg-white p-12 rounded-lg shadow-sm border">
                                <h2 className="text-xl font-semibold text-gray-700">No Saved Trips Yet</h2>
                                <p className="text-gray-500 mt-2">Start by generating a trip and save your favorites here!</p>
                            </div>
                        )}
                    </div>
                );
            case 'profile':
                return <ProfileSettings user={user} onSave={onUpdateProfile} />;
            case 'account':
                return <AccountSettings onDeleteClick={() => setShowDeleteModal(true)} />;
            default:
                return null;
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="container mx-auto p-4 md:p-8">
                <div className="text-left mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Welcome, {user.name.split(' ')[0]}!</h1>
                    <p className="text-lg text-gray-600 mt-1">Manage your trips and account settings.</p>
                </div>
                <div className="flex flex-col md:flex-row">
                    <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="flex-grow mt-8 md:mt-0">
                        {renderContent()}
                    </div>
                </div>
            </main>
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={onDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your saved trips will be lost."
            />
        </div>
    );
};

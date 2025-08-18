import React, { useState, useEffect } from 'react';

type UserProfile = { name: string; homeCity: string; };

interface ProfileSettingsProps {
    user: UserProfile;
    onSave: (updatedProfile: UserProfile) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onSave }) => {
    const [name, setName] = useState(user.name);
    const [homeCity, setHomeCity] = useState(user.homeCity);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setName(user.name);
        setHomeCity(user.homeCity);
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, homeCity });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="homeCity" className="block text-sm font-medium text-gray-700">
                        Home Airport / City
                    </label>
                    <input
                        type="text"
                        id="homeCity"
                        value={homeCity}
                        onChange={(e) => setHomeCity(e.target.value)}
                        placeholder="e.g., San Francisco, USA"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    />
                     <p className="mt-2 text-xs text-gray-500">
                        This will be used to pre-fill your trip searches in the future.
                    </p>
                </div>
                <div className="flex items-center justify-end space-x-4">
                    {isSaved && (
                        <p className="text-sm text-green-600 transition-opacity duration-300">
                            Profile saved successfully!
                        </p>
                    )}
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

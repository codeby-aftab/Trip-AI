import React, { useState } from 'react';
import { TrashIcon } from './icons/TrashIcon';

interface AccountSettingsProps {
    onDeleteClick: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ onDeleteClick }) => {
    const [passwordChanged, setPasswordChanged] = useState(false);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setPasswordChanged(true);
        setTimeout(() => setPasswordChanged(false), 3000);
    };

    return (
        <div className="space-y-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
                    </div>
                    <div className="flex items-center justify-end space-x-4 pt-2">
                        {passwordChanged && <p className="text-sm text-green-600">Password updated!</p>}
                         <button type="submit" className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-sm hover:bg-gray-800 transition-colors">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-red-50 p-8 rounded-xl border border-red-200">
                 <h2 className="text-2xl font-bold text-red-900 mb-2">Delete Account</h2>
                 <p className="text-red-700 mb-6 max-w-2xl">
                    This action is permanent and cannot be undone. All your saved trips and personal data will be erased forever.
                 </p>
                 <button 
                    onClick={onDeleteClick}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                >
                    <TrashIcon className="w-5 h-5"/>
                    I want to delete my account
                </button>
            </div>
        </div>
    );
};

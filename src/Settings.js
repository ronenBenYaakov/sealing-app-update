import React, { useState } from 'react';
import './Settings.css'; // Import the CSS file

/**
 * A simple settings page component with customization preferences.
 * @param {Object} props - The component props.
 * @param {Function} props.onGoToChat - The function to call to navigate back to the chat view.
 */
const Settings = ({ onGoToChat }) => {
  // State for different settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Handler for changing the theme
  const handleThemeChange = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Add logic here to apply the theme to the entire app
    console.log(`Dark mode is now ${isDarkMode ? 'disabled' : 'enabled'}.`);
  };

  // Handler for toggling notifications
  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    console.log(`Notifications are now ${notificationsEnabled ? 'disabled' : 'enabled'}.`);
  };

  return (
    <div className="settings-page p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Settings</h2>
      
      {/* Preferences Section */}
      <div className="preferences-section w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Preferences</h3>
        
        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
          <span className="text-lg text-gray-700">Dark Mode</span>
          <button
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}
            onClick={handleThemeChange}
            aria-label="Toggle dark mode"
          >
            <span className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></span>
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
          <span className="text-lg text-gray-700">Notifications</span>
          <button
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            onClick={handleToggleNotifications}
            aria-label="Toggle notifications"
          >
            <span className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
          </button>
        </div>

      </div>

      {/* Back to Chat Button */}
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-blue-700"
        onClick={onGoToChat}
      >
        Back to Chat
      </button>
    </div>
  );
};

export default Settings;

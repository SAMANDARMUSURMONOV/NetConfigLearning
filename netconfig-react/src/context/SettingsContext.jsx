import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        platformName: 'NetConfig Learn',
        platformDescription: 'Corporate Networking E-Learning Platform',
        logoUrl: '',
        socialLinks: {
            telegram: '',
            instagram: ''
        },
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const data = await apiService.getSettings();
            if (data) {
                setSettings(data);
            }
        } catch (error) {
            console.error("Failed to fetch global settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

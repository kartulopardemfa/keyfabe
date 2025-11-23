import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PaletteName = 'Default' | 'Office' | 'Witness' | 'Atomic';

export interface Palette {
    background: string;
    text: string;
    accent: string;
    secondary: string;
    border: string;
}

export const PALETTES: Record<PaletteName, Palette> = {
    Default: {
        background: 'bg-paper',
        text: 'text-ink',
        accent: 'bg-orange-bright',
        secondary: 'bg-cyan-bright',
        border: 'border-ink',
    },
    Office: {
        background: 'bg-[#F5F5DC]', // Beige
        text: 'text-blue-900',       // Navy Blue
        accent: 'bg-blue-600',       // Royal Blue
        secondary: 'bg-gray-400',    // Gray
        border: 'border-blue-900',
    },
    Witness: {
        background: 'bg-neutral-900', // Dark Grey
        text: 'text-white',           // White
        accent: 'bg-[#FF00FF]',       // Hot Pink
        secondary: 'bg-black',        // Black
        border: 'border-white',
    },
    Atomic: {
        background: 'bg-[#FFD700]',   // Warning Yellow
        text: 'text-black',           // Black
        accent: 'bg-[#FF0000]',       // Red
        secondary: 'bg-black',        // Black
        border: 'border-black',
    }
};

interface StoreContextType {
    activePalette: PaletteName;
    setPalette: (palette: PaletteName) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activePalette, setActivePalette] = useState<PaletteName>('Default');

    return (
      <StoreContext.Provider value={{ activePalette, setPalette: setActivePalette }}>
        {children}
      </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};

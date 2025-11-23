import React from 'react';
import { useStore, PaletteName } from '../store';

interface Design {
    name: string;
    line: string;
    art: string;
    price?: string;
    warning?: string;
    palette?: PaletteName;
}

interface DropsProps {
    designs: Design[];
}

const Drops: React.FC<DropsProps> = ({ designs }) => {
    const { setPalette } = useStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {designs.map((design, index) => {
                // Assign a palette based on index or design property for demo purposes
                const targetPalette: PaletteName = index === 0 ? 'Atomic' : index === 1 ? 'Witness' : 'Office';

                return (
                    <div
                        key={design.name}
                        className="group relative perspective-1000"
                        onMouseEnter={() => setPalette(targetPalette)}
                        onMouseLeave={() => setPalette('Default')}
                    >
                        {/* The Tab */}
                        <div className="absolute -top-8 left-4 h-8 px-4 bg-white border-2 border-b-0 border-ink flex items-center justify-center transform translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0 z-0">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">File: {String(index + 1).padStart(3, '0')}</span>
                        </div>

                        {/* The Card Body */}
                        <div className="relative z-10 bg-white border-2 border-ink aspect-[3/4] transition-all duration-200 ease-out transform group-hover:-translate-y-6 group-hover:rotate-2 shadow-[0px_0px_0px_#1a1a1a] group-hover:shadow-[-16px_16px_0px_#1a1a1a]">

                            {/* Content Container */}
                            <div className="absolute inset-0 overflow-hidden p-6 flex flex-col">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="font-mono text-xs font-bold border border-ink px-2 py-1 bg-paper">
                                        CONFIDENTIAL
                                    </div>
                                    {design.warning && (
                                        <div className="font-mono text-[10px] font-bold bg-orange-bright text-white px-2 py-1 animate-pulse">
                                            {design.warning}
                                        </div>
                                    )}
                                </div>

                                {/* Art Placeholder */}
                                <div className="flex-grow relative flex items-center justify-center">
                                    <img src={design.art} alt={design.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" />

                                    {/* Misprint Overlay */}
                                    <div className="absolute inset-0 bg-cyan-bright/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-x-1 translate-y-1 pointer-events-none" />
                                    <div className="absolute inset-0 bg-orange-bright/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -translate-x-1 -translate-y-1 pointer-events-none" />
                                </div>

                                {/* Footer Info */}
                                <div className="mt-auto pt-4 border-t-2 border-ink border-dashed">
                                    <h3 className="font-bold text-xl uppercase leading-none mb-1">{design.name}</h3>
                                    <p className="font-mono text-xs opacity-60 truncate">{design.line}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Tag / Action */}
                        <div className="absolute -bottom-6 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 delay-75 transform translate-y-4 group-hover:translate-y-0">
                            <button className="bg-ink text-white font-mono text-xs uppercase px-4 py-2 font-bold hover:bg-orange-bright transition-colors shadow-[4px_4px_0px_#00a8ff]">
                                Acquire
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Drops;

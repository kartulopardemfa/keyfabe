import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeScene from './components/ThreeScene';
import Grain from './components/Grain';
import MisprintText from './components/MisprintText';
import Drops from './components/Drops';
import { StoreProvider, useStore, PALETTES } from './store';

gsap.registerPlugin(ScrollTrigger);

const designs = [
  {
    name: 'THE RED WEDDING BALLROOM',
    line: 'smiling wine goblet; confetti that looks too much like falling steel.',
    art: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 360 480%22%3E%3Crect width=%22360%22 height=%22480%22 fill=%22none%22/%3E%3Cpath d=%22M120 60h120v120c0 40-32 84-60 84s-60-44-60-84Z%22 fill=%22%23ff4719%22 stroke=%22%231a1a1a%22 stroke-width=%228%22 stroke-linejoin=%22round%22/%3E%3Cpath d=%22M170 264h20v64c0 12-16 22-16 22h-24s20-10 20-22Z%22 fill=%22%2300a8ff%22 stroke=%22%231a1a1a%22 stroke-width=%228%22/%3E%3Ccircle cx=%22160%22 cy=%22132%22 r=%2212%22 fill=%22%231a1a1a%22/%3E%3Ccircle cx=%22200%22 cy=%22132%22 r=%2212%22 fill=%22%231a1a1a%22/%3E%3Cpath d=%22M158 164c8 8 36 8 44 0%22 stroke=%22%231a1a1a%22 stroke-width=%228%22 fill=%22none%22 stroke-linecap=%22round%22/%3E%3Cpath d=%22m82 94 22 10M88 138l26-8M96 182l26-8M274 102l-22 10M274 148l-26-8M266 194l-26-10%22 stroke=%22%23e6b31e%22 stroke-width=%228%22 stroke-linecap=%22round%22/%3E%3C/svg%3E',
  },
  {
    name: 'WITNESS PROTECTION SHIFT SCHEDULE',
    line: 'friendly clipboard, blank name tag; ink writes itself then vanishes.',
    art: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 360 480%22%3E%3Crect width=%22360%22 height=%22480%22 fill=%22none%22/%3E%3Crect x=%2292%22 y=%2272%22 width=%22176%22 height=%22320%22 rx=%2224%22 fill=%22%23f0f0e6%22 stroke=%22%231a1a1a%22 stroke-width=%228%22/%3E%3Crect x=%22140%22 y=%2288%22 width=%2280%22 height=%2232%22 rx=%228%22 fill=%22%2300a8ff%22 stroke=%22%231a1a1a%22 stroke-width=%228%22/%3E%3Cpath d=%22M116 152h128M116 192h128M116 232h128M116 272h128M116 312h104%22 stroke=%22%231a1a1a%22 stroke-width=%228%22 stroke-linecap=%22round%22/%3E%3Crect x=%22136%22 y=%22332%22 width=%2288%22 height=%2236%22 rx=%228%22 fill=%22%23ff4719%22 stroke=%22%231a1a1a%22 stroke-width=%228%22/%3E%3Cpath d=%22M196 132c0 6-10 10-16 10s-16-4-16-10%22 stroke=%22%231a1a1a%22 stroke-width=%228%22 fill=%22none%22/%3E%3C/svg%3E',
  },
  {
    name: 'BADA BING SOCIAL CLUB',
    line: 'tiny wiseguy mascot; shadow that reads like bars.',
    art: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 360 480%22%3E%3Crect width=%22360%22 height=%22480%22 fill=%22none%22/%3E%3Ccircle cx=%22180%22 cy=%22140%22 r=%2272%22 fill=%22%23f0f0e6%22 stroke=%22%231a1a1a%22 stroke-width=%228%22/%3E%3Cpath d=%22M132 212h96v56c0 24-24 40-48 40s-48-16-48-40Z%22 fill=%22%23ff4719%22 stroke=%22%231a1a1a%22 stroke-width=%228%22/%3E%3Cpath d=%22M152 118c0 14 18 22 28 22s28-8 28-22%22 stroke=%22%231a1a1a%22 stroke-width=%228%22 fill=%22none%22/%3E%3Ccircle cx=%22154%22 cy=%22130%22 r=%228%22 fill=%22%231a1a1a%22/%3E%3Ccircle cx=%22206%22 cy=%22130%22 r=%228%22 fill=%22%231a1a1a%22/%3E%3Cpath d=%22M168 256h24l12 52-24 12-24-12Z%22 fill=%22%2300a8ff%22 stroke=%22%231a1a1a%22 stroke-width=%228%22/%3E%3Crect x=%2296%22 y=%22342%22 width=%22168%22 height=%2220%22 rx=%226%22 fill=%22%231a1a1a%22/%3E%3Crect x=%2296%22 y=%22370%22 width=%22168%22 height=%2218%22 rx=%226%22 fill=%22%2300a8ff%22/%3E%3C/svg%3E',
  },
];

const AppContent: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const { activePalette } = useStore();
  const currentTheme = PALETTES[activePalette];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-text').forEach((el: any) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
            }
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={`font-sans overflow-x-hidden min-h-screen transition-colors duration-300 ease-out ${currentTheme.background} ${currentTheme.text}`}>

      <Grain />
      <ThreeScene />
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-3 mix-blend-difference text-white pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 py-2 px-4 md:px-5 border border-white/50 bg-black/10 backdrop-blur-md rounded-full pointer-events-auto shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
          <div className="text-xl font-bold tracking-tight lowercase">keyfabe</div>
          <div className="hidden md:flex gap-5 font-mono text-xs uppercase">
            <a href="#manifesto" className="hover:underline decoration-2 underline-offset-4">manifesto</a>
            <a href="#designs" className="hover:underline decoration-2 underline-offset-4">designs</a>
            <a href="#compliance" className="hover:underline decoration-2 underline-offset-4">compliance</a>
          </div>
          <button className="border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition-colors uppercase text-[10px] font-bold font-mono">
            cart · 0
          </button>
        </div>
      </nav>

      <main className="relative z-10">

        {/* Hero Section */}
        <section ref={heroRef} className="h-screen flex flex-col justify-center items-start px-6 md:px-12 relative pointer-events-none">
          <div className="max-w-4xl z-10 pointer-events-auto">
            <div className="mb-6">
              <MisprintText
                as="h1"
                text={`REALITY,\nMARKETED\nWRONG.`}
                className="text-6xl md:text-9xl font-bold leading-[0.85] whitespace-pre-line"
              />
            </div>
            <p className={`text-xl md:text-2xl max-w-2xl font-mono leading-relaxed backdrop-blur-sm p-4 border-l-4 shadow-lg transition-colors duration-300 ${currentTheme.accent} ${currentTheme.background === 'bg-neutral-900' ? 'text-white' : 'text-ink'}`}>
              streetwear for problems that don&apos;t exist. mascots, fake products, one clean glitch per tee.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#designs" className={`inline-block px-8 py-4 font-bold uppercase tracking-widest border-2 border-ink shadow-[4px_4px_0px_#1a1a1a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1a1a1a] transition-all ${currentTheme.secondary} text-black`}>
                view designs
              </a>
              <span className={`font-mono text-xs uppercase text-white px-3 py-2 shadow-[3px_3px_0px_#00a8ff] ${currentTheme.text === 'text-white' ? 'bg-white text-black' : 'bg-ink'}`}>
                broadcast: clean glitch only
              </span>
            </div>
          </div>

          <div className="absolute bottom-12 right-12 max-w-xs text-right hidden md:block font-mono text-xs opacity-60">
            <p>fig. a — mascot watches back</p>
            <p>halftone, paper bleed, approved</p>
          </div>
        </section>

        {/* Marquee */}
        <div className={`py-4 border-y-2 border-ink rotate-1 scale-105 z-20 relative overflow-hidden transition-colors duration-300 ${currentTheme.accent} text-white`}>
          <div className="flex whitespace-nowrap" style={{ animation: 'marquee 20s linear infinite' }}>
            <span className="font-mono text-lg font-bold uppercase tracking-widest mx-4">
              • do not look directly at the mascot • happiness is mandatory • keyfabe loves you • guaranteed side effects include joy • do not look directly at the mascot • happiness is mandatory • keyfabe loves you • guaranteed side effects include joy •
            </span>
            <span className="font-mono text-lg font-bold uppercase tracking-widest mx-4">
              • do not look directly at the mascot • happiness is mandatory • keyfabe loves you • guaranteed side effects include joy • do not look directly at the mascot • happiness is mandatory • keyfabe loves you • guaranteed side effects include joy •
            </span>
          </div>
        </div>

        {/* Manifesto Section */}
        <section id="manifesto" ref={manifestoRef} className="py-32 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <MisprintText text="manifesto" as="h2" className="text-5xl font-bold reveal-text" />
            <p className="text-2xl leading-relaxed font-serif italic reveal-text">
              fake ads. real cotton. every piece looks like a commercial break you half-remember.
            </p>
            <div className="space-y-6 font-mono text-sm md:text-base reveal-text">
              <p>
                one mascot. one joke that goes a little too far. 3–5 inks and out. no lore, no drop anxiety, just sharp print mistakes on purpose.
              </p>
              <p>
                if it feels like propaganda for a problem that isn&apos;t real, good. if you feel seen, report to your nearest exit.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>mid-century optimism</li>
                <li>scheduled dissociation</li>
                <li>retail therapy for unreality</li>
              </ul>
            </div>
          </div>
          <div className={`relative h-full min-h-[400px] border-2 border-ink p-8 flex items-center justify-center rotate-2 shadow-[12px_12px_0px_#1a1a1a] reveal-text transition-colors duration-300 ${currentTheme.background === 'bg-neutral-900' ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
            <div className="text-center space-y-3">
              <div className="text-8xl mb-2">📡</div>
              <h3 className="text-2xl font-bold uppercase">fake ad tile</h3>
              <p className="font-mono text-sm max-w-xs mx-auto">broadcast quality, mildly cursed. void where prohibited by linear time.</p>
            </div>
          </div>
        </section>


        {/* Designs Section */}
        <section id="designs" className={`py-24 px-6 md:px-12 border-t-2 border-ink relative z-20 transition-colors duration-300 ${currentTheme.background}`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 flex items-end justify-between flex-wrap gap-4">
              <MisprintText text="designs" as="h2" className="text-5xl md:text-7xl font-bold" />
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm border-2 border-ink px-3 py-1 bg-white shadow-[4px_4px_0px_#1a1a1a] text-black">catalog: error-corrected</span>
                <a
                  href="/designs"
                  className="font-mono text-xs uppercase border-2 border-ink bg-white text-black px-4 py-2 font-bold shadow-[4px_4px_0px_#1a1a1a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_#1a1a1a] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_#1a1a1a]"
                >
                  view all
                </a>
              </div>
            </div>

            <Drops designs={designs} />
          </div>
        </section>

        {/* Footer */}
        <footer id="compliance" className={`text-white py-24 px-6 md:px-12 font-mono text-sm border-t-4 transition-colors duration-300 ${currentTheme.accent === 'bg-orange-bright' ? 'bg-ink border-orange-bright' : 'bg-black border-white'}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-4xl font-bold mb-6 lowercase">keyfabe</h4>
              <p className="max-w-xs opacity-60 mb-4">
                © 1974 - 2074 keyfabe heavy industries.<br />
                if you remember this ad, no you don&apos;t.
              </p>
              <p className="opacity-60">
                headquarters: somewhere between vhs static and the mall.
              </p>
              <div className="mt-6">
                <a href="#designs" className={`inline-block bg-white text-ink px-6 py-3 font-bold uppercase tracking-widest border-2 shadow-[4px_4px_0px_#00a8ff] hover:translate-x-[-2px] hover:translate-y-[-2px] transition ${currentTheme.border}`}>
                  initiate checkout
                </a>
              </div>
            </div>
            <div>
              <h5 className={`font-bold mb-4 uppercase ${currentTheme.accent === 'bg-orange-bright' ? 'text-orange-bright' : 'text-white'}`}>legal</h5>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:text-white hover:underline">terms (fluid)</a></li>
                <li><a href="#" className="hover:text-white hover:underline">privacy (none)</a></li>
                <li><a href="#" className="hover:text-white hover:underline">waiver of existence</a></li>
              </ul>
            </div>
            <div>
              <h5 className={`font-bold mb-4 uppercase ${currentTheme.secondary === 'bg-cyan-bright' ? 'text-cyan-bright' : 'text-white'}`}>signal</h5>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:text-white hover:underline">pirate radio 88.8</a></li>
                <li><a href="#" className="hover:text-white hover:underline">voidnet // channel 404</a></li>
                <li><a href="#" className="hover:text-white hover:underline">carrier pigeon (delayed)</a></li>
              </ul>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;

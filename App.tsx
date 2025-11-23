import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeScene from './components/ThreeScene';
import Grain from './components/Grain';
import MisprintText from './components/MisprintText';
import { StoreProvider, useStore, PALETTES } from './store';

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_ART =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 480'%3E%3Crect width='360' height='480' fill='%23f0f0e6' stroke='%231a1a1a' stroke-width='8'/%3E%3Cpath d='M90 140h180v40H90zM90 220h180v40H90zM90 300h140v40H90z' fill='%23ff4719'/%3E%3Ctext x='50%' y='55%' text-anchor='middle' fill='%231a1a1a' font-size='22' font-family='monospace' %3Eawaiting art%3C/text%3E%3C/svg%3E";

const designs = [
  {
    name: 'THE RED WEDDING BALLROOM',
    line: 'smiling wine goblet; confetti that looks too much like falling steel.',
    art: '/design1.png',
  },
  {
    name: 'WITNESS PROTECTION SHIFT SCHEDULE',
    line: 'friendly clipboard, blank name tag; ink writes itself then vanishes.',
    art: '/design2.png',
  },
  {
    name: 'BADA BING SOCIAL CLUB',
    line: 'tiny wiseguy mascot; shadow that reads like bars.',
    art: '/design3.png',
  },
];

const BROADCAST_LINES = [
  'broadcast: wave 103',
  'broadcast: static fm 89.ghost',
  'broadcast: channel 7 after midnight',
  'broadcast: lost cable channel 12',
  'broadcast: local access 3',
  'broadcast: test pattern 404',
  'broadcast: vhs home recording',
  'broadcast: mall radio 1999',
  'broadcast: lobby channel',
  'broadcast: waiting room tv',
  'broadcast: hold music 98.7',
  'broadcast: night shift radio',
  'broadcast: infomercial block c',
  'broadcast: late night promo loop',
  'broadcast: public service slot',
  'broadcast: rerun channel',
  'broadcast: shopping network echo',
  'broadcast: arcade attract mode',
  'broadcast: demo disc tv',
  'broadcast: cassette side b',
  'broadcast: bootleg satellite feed',
  'broadcast: regional tv nobody admits watching',
  'broadcast: commercials from the wrong year',
  'broadcast: saturday morning, off-brand',
  'broadcast: vhs tape left in the player',
  'broadcast: paused on an ad break',
  'broadcast: channel that doesn’t exist anymore',
  'broadcast: mall speakers in 2003',
  'broadcast: food court radio',
  'broadcast: screensaver fm',
  'broadcast: elevator music live',
  'broadcast: late checkout channel',
  'broadcast: hotel guide loop',
  'broadcast: maintenance radio',
  'broadcast: pirate signal 13',
  'broadcast: ghost station 00.0',
  'broadcast: analog glitch hour',
  'broadcast: emergency test pattern',
  'broadcast: closed captions only',
  'broadcast: reruns from a cancelled timeline',
  'broadcast: promo reel never aired',
  'broadcast: local sports rain delay',
  'broadcast: kids block at 6am',
  'broadcast: midnight movie commercial break',
  'broadcast: snowstorm channel',
  'broadcast: beta tape b-side',
  'broadcast: unauthorized broadcast unit',
  'broadcast: training video loop',
  'broadcast: surveillance monitor feed',
];

const AppContent: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLElement>(null);
  const { activePalette } = useStore();
  const currentTheme = PALETTES[activePalette];
  const [redacted, setRedacted] = useState(true);
  const [redactedTitle, setRedactedTitle] = useState(true);
  const broadcastLine = useMemo(
    () => BROADCAST_LINES[Math.floor(Math.random() * BROADCAST_LINES.length)],
    []
  );
  const [broadcastText, setBroadcastText] = useState(broadcastLine);
  const broadcastTimer = useRef<number | null>(null);

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

  // Cleanup broadcast timer on unmount
  useEffect(() => {
    return () => {
      if (broadcastTimer.current) {
        window.clearInterval(broadcastTimer.current);
        broadcastTimer.current = null;
      }
    };
  }, []);

  return (
    <div id="top" className={`font-sans overflow-x-hidden min-h-screen transition-colors duration-300 ease-out ${currentTheme.background} ${currentTheme.text}`}>

      <Grain />
      <ThreeScene />
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin-stamp {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        @keyframes pendulum {
          0% { transform: rotate(-4deg) translateY(0); }
          50% { transform: rotate(4deg) translateY(2px); }
          100% { transform: rotate(-4deg) translateY(0); }
        }
        @keyframes vhs-tear {
          0% { background-position: 0 0; }
          100% { background-position: 0 140%; }
        }
        @keyframes nav-shift {
          0% { background-position: 0 0; }
          100% { background-position: 120% 120%; }
        }
        @keyframes nav-wave {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
        .spin-stamp {
          animation: spin-stamp 14s linear infinite;
        }
        .redacted {
          background: #1a1a1a;
          color: #1a1a1a;
          padding: 0 4px;
          letter-spacing: 0.12em;
        }
        .blink {
          animation: blink 0.7s steps(2, end) infinite;
        }
        .vhs-tear {
          background-image:
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.12) 0%,
              rgba(255,255,255,0.12) 6%,
              rgba(0,0,0,0) 10%
            ),
            repeating-linear-gradient(
              180deg,
              rgba(0,0,0,0.08) 0%,
              rgba(0,0,0,0.08) 4%,
              rgba(255,255,255,0) 8%
            );
          background-size: 100% 120%;
          animation: vhs-tear 2.4s linear infinite;
          opacity: 0.4;
          mix-blend-mode: multiply;
        }
        .nav-osc {
          background-image: repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 10px, transparent 10px, transparent 22px);
          background-size: 200% 200%;
          animation: nav-wave 14s linear infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 pt-3 text-white pointer-events-none">
        <div
          className={`relative overflow-hidden max-w-6xl mx-auto flex items-center justify-between gap-4 py-2 px-4 md:px-5 border border-white/50 rounded-full pointer-events-auto shadow-[0_4px_16px_rgba(0,0,0,0.2)] ${
            currentTheme.accent === 'bg-orange-bright' ? 'bg-orange-bright' : 'bg-ink'
          }`}
        >
          <div className="absolute inset-0 nav-osc opacity-25 mix-blend-screen pointer-events-none" />
            <div className="relative flex items-center justify-between w-full">
            <a href="#top" className="text-2xl font-bold tracking-tight lowercase hover:underline underline-offset-4">keyfabe</a>
            <div className="hidden md:flex gap-6 font-mono text-sm uppercase">
              <a href="#manifesto" className="hover:underline decoration-2 underline-offset-4">meet us</a>
              <a href="#designs" className="hover:underline decoration-2 underline-offset-4">designs</a>
              <a href="#compliance" className="hover:underline decoration-2 underline-offset-4">compliance</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">

        {/* Hero Section */}
        <section ref={heroRef} className="h-screen flex flex-col justify-center items-start px-6 md:px-12 relative pointer-events-none">
          <div className="max-w-4xl z-10 pointer-events-auto">
            <div className="mb-6 inline-block border-2 border-ink shadow-[6px_6px_0px_#1a1a1a] px-4 py-3 bg-white/80 backdrop-blur-sm relative overflow-hidden transition-all duration-150 hover:shadow-[8px_8px_0px_#00a8ff]">
              <div
                className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply transition-all duration-200 hover:filter hue-rotate-15"
                style={{
                  backgroundImage: "url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <MisprintText
                as="h1"
                text={`YOU ARE\nINSIDE\nTHE AD.`}
                className="text-5xl md:text-8xl font-bold leading-[0.85] whitespace-pre-line relative blink"
              />
            </div>
            <p
              className={`text-xl md:text-2xl max-w-2xl font-mono leading-relaxed backdrop-blur-sm p-4 border-2 border-ink shadow-[6px_6px_0px_#1a1a1a] transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#1a1a1a] ${currentTheme.accent} ${
                currentTheme.background === 'bg-neutral-900' ? 'text-white' : 'text-ink'
              }`}
            >
              streetwear from a parallel ad break. everything looks fine until you read it twice. like merch from a show you swear you watched, but no one else remembers airing.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#designs" className={`inline-block px-8 py-4 font-bold uppercase tracking-widest border-2 border-ink shadow-[4px_4px_0px_#1a1a1a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1a1a1a] transition-all ${currentTheme.secondary} text-black`}>
                view designs
              </a>
              <span
                className={`font-mono text-xs uppercase text-white px-3 py-2 border-2 border-ink shadow-[3px_3px_0px_#00a8ff] hover:shadow-[5px_5px_0px_#00a8ff] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all relative overflow-hidden ${currentTheme.text === 'text-white' ? 'bg-white text-black' : 'bg-ink'}`}
                onMouseEnter={() => {
                  if (broadcastTimer.current) return;
                  broadcastTimer.current = window.setInterval(() => {
                    setBroadcastText(
                      BROADCAST_LINES[Math.floor(Math.random() * BROADCAST_LINES.length)]
                    );
                  }, 100);
                }}
                onMouseLeave={() => {
                  if (broadcastTimer.current) {
                    window.clearInterval(broadcastTimer.current);
                    broadcastTimer.current = null;
                  }
                  setBroadcastText(BROADCAST_LINES[Math.floor(Math.random() * BROADCAST_LINES.length)]);
                }}
              >
                {broadcastText}
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
              • streetwear from a parallel ad break. like channel-surfing a universe that remembers you a little too well. • streetwear from a parallel ad break. like channel-surfing a universe that remembers you a little too well. •
            </span>
            <span className="font-mono text-lg font-bold uppercase tracking-widest mx-4">
              • streetwear from a parallel ad break. like channel-surfing a universe that remembers you a little too well. • streetwear from a parallel ad break. like channel-surfing a universe that remembers you a little too well. •
            </span>
          </div>
        </div>

        {/* Manifesto Section */}
        <section
          id="manifesto"
          ref={manifestoRef}
          className="py-32 px-6 md:px-12 bg-[#f0f0e6] relative z-10 border-b-2 border-black overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="max-w-7xl mx-auto relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 sticky top-32">
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] mb-8 uppercase mix-blend-difference text-[#1a1a1a]">
                  We make
                  <br />
                  <span className="text-[#00a8ff]">the lies</span>
                  <br />
                  you want
                  <br />
                  to believe.
                </h2>
                <div className="w-24 h-2 bg-[#ff4719] mb-8" />
                <p className="font-mono text-sm uppercase tracking-widest opacity-60">
                  Doc Ref: KF-2025-C
                  <br />
                  Subject: Fabricated Reality
                </p>

                <div className="mt-12 relative w-40 h-40 hidden md:block">
                  <svg className="spin-stamp w-full h-full text-[#ff4719]" viewBox="0 0 100 100">
                    <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                    <text width="100">
                      <textPath xlinkHref="#curve" className="font-mono font-bold text-[13px] uppercase fill-current" startOffset="0">
                        • Certified Fabricated Reality • keyfabe studios •
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-2xl uppercase -rotate-12 text-[#1a1a1a]">
                    Fake
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white border-2 border-black p-8 md:p-16 shadow-[12px_12px_0px_#1a1a1a] relative reveal-text">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#e5e5e5] border-2 border-black rounded-full z-20" />

                <h3 className="font-mono text-xl font-bold mb-8 border-b-2 border-black pb-4">INTERNAL MEMO: PUBLIC RELEASE</h3>

                <div className="prose prose-lg font-mono text-[#1a1a1a] leading-relaxed max-w-none">
                  <p className="mb-6">
                    at keyfabe, we treat reality like a rough draft. instead of fixing it, we print the bugs and sell the <span className="redacted">bloopers</span>.
                  </p>

                  <p className="mb-6">
                    each piece is built to feel like a memory you’re sure you had, from a channel you never actually watched.
                  </p>

                  <div className="bg-[#f0f0e6] p-6 border border-black mt-8">
                    <h4 className="font-bold uppercase mb-4 text-sm">Key Deliverables:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-[#ff4719] rounded-full" />
                        <span className="font-bold">Mid-Century Optimism</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-[#e6b31e] rounded-full" />
                        <span className="font-bold">Scheduled Dissociation</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-[#00a8ff] rounded-full" />
                        <span className="font-bold">Tax-Deductible Joy</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-12 flex justify-between items-end">
                  <div className="text-3xl text-[#00a8ff] -rotate-6 font-bold italic">The Management</div>
                  <div className="text-xs font-mono text-right opacity-60">
                    APPROVED BY:
                    <br />
                    DEPT. OF ILLUSIONS
                  </div>
                </div>

                <div
                  className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none mix-blend-multiply"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E\")",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Legacy Philosophy / Who section */}
        <section id="philosophy" className="py-28 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold reveal-text uppercase leading-[0.95] tracking-tight">
              who the{' '}
              <span
                onMouseEnter={() => setRedactedTitle(false)}
                onMouseLeave={() => setRedactedTitle(true)}
                className="bg-ink text-ink cursor-help transition-colors duration-150 hover:text-white hover:bg-orange-bright px-1 font-mono text-lg md:text-xl inline-block align-baseline rounded-[2px] min-w-[6ch] text-center"
              >
                {redactedTitle ? '████████' : 'fuck'}
              </span>{' '}
              are keyfabe anyway?
            </h2>
            <p className="text-2xl leading-relaxed font-serif italic reveal-text bg-white border-2 border-ink shadow-[6px_6px_0px_#1a1a1a] px-4 py-3">
              streetwear from the wrong channel break. optimism with a side of dread.
            </p>
            <div className="space-y-4 font-mono text-sm md:text-base reveal-text bg-white border-2 border-ink shadow-[6px_6px_0px_#1a1a1a] p-5">
              <p className="bg-neutral-100 border border-ink px-3 py-2 shadow-[4px_4px_0px_#1a1a1a]">
                we make garments for the simulation. bright commercial joy with a dark secret. creatures that grin too wide.
              </p>
              <p className="bg-neutral-100 border border-ink px-3 py-2 shadow-[4px_4px_0px_#1a1a1a]">
                every design is a fake ad you half-remember. a shadow pointing the wrong way. a reflection that doesn&apos;t match.
              </p>
              <p className="font-semibold bg-neutral-100 border border-ink px-3 py-2 shadow-[4px_4px_0px_#1a1a1a]">
                wear the{' '}
                <span
                  onMouseEnter={() => setRedacted(false)}
                  onMouseLeave={() => setRedacted(true)}
                  className="bg-black text-black cursor-help transition-colors duration-200 hover:text-white hover:bg-cyan-bright px-1"
                >
                  {redacted ? '████████' : 'signal'}
                </span>
                .
              </p>
              <p className="font-mono text-xs pt-4 border-t-2 border-orange-bright">
                fig 4.2: acknowledging the artificial nature of your environment is the first step toward brand loyalty.
              </p>
            </div>
          </div>
          <div className="relative h-full min-h-[420px] flex items-center justify-center reveal-text">
            <div className="relative w-full max-w-xs bg-white border-2 border-ink shadow-[6px_6px_0px_#1a1a1a] p-4 origin-top animate-[pendulum_5s_ease-in-out_infinite]">
              <div className="w-full aspect-square border-2 border-ink overflow-hidden mb-3 relative bg-neutral-100">
                <img
                  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3ZsdGZodDQwZDk1NzN3MWkxam5kZnNhZHFnZmNwcHp1eXNlZnJzdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9BzrkrC8KIuhtM1b0B/giphy.gif"
                  alt="truth decoder vhs tear"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px]" />
                <div className="absolute bottom-2 right-2 font-mono text-[10px] px-2 py-1 bg-ink text-white">decoder v4</div>
              </div>
              <h3 className="text-2xl font-bold uppercase leading-tight">truth decoder</h3>
              <p className="font-mono text-xs mt-1">model: kf-200 · output: nonsense · status: redacted</p>
            </div>
          </div>
        </section>


        {/* Designs Section */}
        <section id="designs" className={`py-24 px-6 md:px-12 border-t-2 border-ink relative z-20 transition-colors duration-300 ${currentTheme.background}`}>
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
              <MisprintText text="designs" as="h2" className="text-5xl md:text-7xl font-bold" />
              <a
                href="./designs.html"
                className="font-mono text-sm uppercase border-2 border-ink bg-white text-black px-6 py-3 font-bold shadow-[6px_6px_0px_#1a1a1a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0px_#1a1a1a] transition-all active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0px_#1a1a1a]"
              >
                view all designs
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {designs.map((design, index) => (
                <div key={design.name} className="border-2 border-ink bg-white shadow-[6px_6px_0px_#1a1a1a] transition hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_#1a1a1a]">
                  <div className="aspect-square border-b-2 border-ink flex items-center justify-center p-6">
                    <div className="w-full h-full border-2 border-dashed border-ink flex items-center justify-center bg-white">
                      <img
                        src={design.art}
                        alt={design.name}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== PLACEHOLDER_ART) target.src = PLACEHOLDER_ART;
                        }}
                        className="max-h-full max-w-full object-contain p-4"
                      />
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.15em]">print {String(index + 1).padStart(2, '0')}</div>
                    <h3 className="text-xl font-bold uppercase leading-tight">{design.name}</h3>
                    <p className="font-mono text-sm leading-snug text-ink/80">{design.line}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          id="compliance"
          className={`relative overflow-hidden text-white py-24 px-6 md:px-12 font-mono text-sm border-t-4 transition-colors duration-300 ${
            currentTheme.accent === 'bg-orange-bright' ? 'bg-ink border-orange-bright' : 'bg-black border-white'
          }`}
        >
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(255,255,255,0.18) 2px, transparent 2px), linear-gradient(0deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <div className="absolute inset-0 opacity-14 mix-blend-multiply pointer-events-none vhs-tear" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-block bg-white text-ink px-3 py-1 font-bold uppercase border-2 border-ink shadow-[4px_4px_0px_#00a8ff]">
                channel ends, static begins
              </div>
              <h4 className="text-4xl md:text-5xl font-bold lowercase leading-tight">
                keyfabe // end of transmission
              </h4>
              <p className="opacity-75 max-w-md">
                © 1974 - 2074 keyfabe heavy industries. if you remember this ad, no you don&apos;t. headquarters: the space between vhs snow and the mall fountain.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h5 className="font-bold mb-3 uppercase misprint" data-text="legal fictions">legal fictions</h5>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-white hover:underline">terms (fluid)</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">privacy (none)</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">waiver of existence</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-3 uppercase misprint" data-text="signal">signal</h5>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-white hover:underline">pirate radio 88.8</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">voidnet // channel 404</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">pager code: 07734</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-3 uppercase misprint" data-text="escape hatch">escape hatch</h5>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-white hover:underline">late checkout channel</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">elevator music live</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">hold music 98.7</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-3 uppercase misprint" data-text="socials">socials</h5>
                <ul className="space-y-2 opacity-80">
                  <li><a href="#" className="hover:text-white hover:underline">the void letter (instagram)</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">smoke signals (x)</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">dial-up net (tiktok)</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-12 border-t border-white/25 pt-4 text-[11px] uppercase opacity-70 relative z-10">
            warning: prolonged exposure may cause nostalgia for events that never happened.
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

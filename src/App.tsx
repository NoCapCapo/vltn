
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, ChevronRight, Mail, CalendarDays } from 'lucide-react';
import confetti from 'canvas-confetti';
import FloatingHearts from './components/FloatingHearts';
import { ProposalStatus } from './types';

const BG_IMAGE = "https://pbs.twimg.com/media/G2MB0dpaIAE6yuG?format=jpg&name=large"; 
const DATE_GIF = "https://media1.tenor.com/m/hASIPZkceF8AAAAd/hop-on-genshin-sandrina.gif";
const LETTER_CONTENT = `Dear Nora,

Happy Valentine's Day, honey! Time has flown by really fast since the day we met, yet every moment with you feels meaningful to me. Being with you has been my favorite part of the day, and I love the way we laugh, joke, and feel comfortable with each other.

Although the way we met was such a coincidence, I really couldn’t ask for a better partner. The love that we share together means the world to me. I may be a dork and clumsy at times, but I promise I will always treasure this bond that we share with trust and care.

Today, I want you to know that my love for you has only grown stronger. I’m excited for the memories we’re creating, the dreams we’re chasing, the challenges we will face together, and the life we’re building side by side. Thank you for making me the happiest person in the world. I promise to keep choosing you, today and always.`;

const App: React.FC = () => {
  const [status, setStatus] = useState<ProposalStatus>(ProposalStatus.SPLASH);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHoveringNo, setIsHoveringNo] = useState(false);
  const [name] = useState("Nora aşkım");
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0, moved: false });
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const moveTimeoutRef = useRef<number | null>(null);

  const changeScene = (nextStatus: ProposalStatus) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStatus(nextStatus);
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    if (status === ProposalStatus.SPLASH) {
      const timer = setTimeout(() => {
        changeScene(ProposalStatus.INTRO);
      }, 3500); 
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleYes = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStatus(ProposalStatus.ACCEPTED);
      setIsTransitioning(false);
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }, 600);
  }, []);

  const moveNoButton = useCallback(() => {
    setIsHoveringNo(true);
    if (moveTimeoutRef.current) return;
    
    const btnWidth = noBtnRef.current?.offsetWidth || 100;
    const btnHeight = noBtnRef.current?.offsetHeight || 50;
    const padding = 40;

    const availableWidth = window.innerWidth - btnWidth - (padding * 2);
    const availableHeight = window.innerHeight - btnHeight - (padding * 2);
    
    const newX = padding + (Math.random() * availableWidth);
    const newY = padding + (Math.random() * availableHeight);
    
    setNoButtonPos({ x: newX, y: newY, moved: true });
    setYesButtonScale(prev => Math.min(prev + 0.15, 3.5));

    moveTimeoutRef.current = window.setTimeout(() => {
      moveTimeoutRef.current = null;
    }, 400); 
  }, []);

  const revealLetter = useCallback(async () => {
    setIsTyping(true);
    let currentText = '';
    const chars = LETTER_CONTENT.split('');
    for (let i = 0; i < chars.length; i++) {
      const delay = chars[i] === '\n' ? 300 : 25;
      await new Promise(res => setTimeout(res, delay));
      currentText += chars[i];
      setDisplayText(currentText);
    }
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (status === ProposalStatus.ACCEPTED && !displayText && !isTyping) {
      revealLetter();
    }
  }, [status, displayText, isTyping, revealLetter]);

  const renderSplashState = () => (
    <div className={`flex flex-col items-center justify-center space-y-8 transition-all duration-1000 transform ${isTransitioning ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
      <div className="relative">
        <Heart size={140} className="text-pink-500 fill-current animate-pulse drop-shadow-[0_0_40px_rgba(236,72,153,0.5)]" />
        <div className="absolute inset-0 bg-pink-400 blur-3xl opacity-30 animate-pulse"></div>
      </div>
      <div className="text-center space-y-4 flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-cursive text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          For Nora...
        </h2>
        <div className="flex items-center gap-3 text-pink-200/90 font-medium tracking-[0.3em] text-xs uppercase pt-2">
          <span className="w-12 h-[1px] bg-pink-400/50"></span>
          <span className="animate-pulse">A little surprise</span>
          <span className="w-12 h-[1px] bg-pink-400/50"></span>
        </div>
      </div>
    </div>
  );

  const renderIntroState = () => (
    <div className={`flex flex-col items-center justify-center space-y-12 transition-all duration-700 transform ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'} max-w-4xl w-full px-4 text-center`}>
      <button 
        onClick={() => changeScene(ProposalStatus.IDLE)}
        className="group relative w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-2xl p-12 md:p-20 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-white/40 transform transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer outline-none focus:ring-4 focus:ring-pink-300"
      >
        <div className="flex flex-col items-center gap-10">
          <div className="relative">
            <div className="absolute -inset-16 bg-pink-400/10 rounded-full blur-3xl group-hover:bg-pink-400/20 transition-colors animate-pulse"></div>
            <div className="relative transition-transform duration-500 group-hover:-rotate-6 flex items-center justify-center">
              <Mail size={140} className="text-pink-500" strokeWidth={0.75} />
              <Heart 
                size={44} 
                className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-500 fill-current animate-pulse drop-shadow-md" 
              />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-cursive text-pink-800 leading-tight">
            Nora, I have something <br/> special for you... (trust)
          </h2>
          <div className="flex flex-col items-center gap-2">
            <div className="px-6 py-2 bg-pink-500 text-white rounded-full text-sm font-bold tracking-widest uppercase animate-bounce shadow-lg">
              Open your heart
            </div>
            <p className="text-pink-400/60 text-xs uppercase tracking-widest font-bold">Click to reveal</p>
          </div>
        </div>
      </button>
    </div>
  );

  const renderInitialState = () => (
    <div className={`flex flex-col items-center justify-center space-y-10 transition-all duration-700 transform ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'} max-w-2xl w-full px-4`}>
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 via-red-400 to-pink-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
        <img 
          src="https://i.redd.it/ymu4o16r58wf1.gif" 
          alt="Valentine"
          className="relative w-64 h-64 rounded-3xl shadow-2xl border-4 border-white/50 object-cover"
        />
        <Heart className="absolute -top-8 -right-8 text-pink-500 animate-bounce fill-current drop-shadow-lg" size={48} />
      </div>
      
      <div className="text-center space-y-4 px-8 bg-white/80 backdrop-blur-xl py-10 rounded-[2.5rem] border border-white/50 shadow-2xl w-full">
        <h1 className="text-4xl md:text-6xl font-cursive text-pink-900 leading-tight">
          {name}, will you be <br/> my Valentine? 💖
        </h1>
        <p className={`text-pink-600 font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase transition-all duration-300 ${isHoveringNo ? 'text-red-500 scale-110' : 'opacity-60'}`}>
          {isHoveringNo ? "Wrong answer 😡" : "Make me the happiest 🥰"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-10 relative min-h-[140px] w-full pt-4">
        <button
          onClick={handleYes}
          style={{ transform: `scale(${yesButtonScale})` }}
          className="group relative bg-gradient-to-br from-pink-500 to-red-600 text-white font-bold py-6 px-16 rounded-full shadow-[0_15px_40px_-10px_rgba(244,63,94,0.6)] hover:shadow-[0_20px_50px_-10px_rgba(244,63,94,0.8)] transition-all active:scale-95 flex items-center gap-4 z-10 text-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative">YES! 💝</span>
        </button>

        <button
          ref={noBtnRef}
          onMouseEnter={moveNoButton}
          onMouseLeave={() => setIsHoveringNo(false)}
          onClick={moveNoButton}
          style={{
            position: noButtonPos.moved ? 'fixed' : 'relative',
            left: noButtonPos.moved ? `${noButtonPos.x}px` : 'auto',
            top: noButtonPos.moved ? `${noButtonPos.y}px` : 'auto',
            zIndex: 50,
            transition: noButtonPos.moved ? 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
          }}
          className="bg-white/90 border-2 border-pink-100 hover:bg-white text-pink-300 font-bold py-3 px-10 rounded-full shadow-lg whitespace-nowrap text-lg"
        >
          No 🥺
        </button>
      </div>
    </div>
  );

  const renderAcceptedState = () => {
    const lines = displayText.split('\n');
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
      <div className={`flex flex-col items-center justify-center space-y-8 transition-all duration-1000 transform ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'} text-center max-w-3xl mx-auto p-4 w-full`}>
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-10 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative">
            <img 
              src="https://media.tenor.com/x1PjYNzn0V0AAAAM/sandrone-columbina.gif"
              alt="Happy"
              className="w-40 h-40 md:w-56 md:h-56 mx-auto rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-8 border-white object-cover"
            />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-8 py-2 rounded-full shadow-xl z-20">
              <h3 className="text-xl md:text-3xl font-cursive text-pink-600 whitespace-nowrap">
                I knew you would say yes for real! 😘💕
              </h3>
            </div>
          </div>
        </div>

        <div className="relative w-full mt-10">
          <div className="bg-[#fffdf5] p-8 md:p-16 rounded-xl shadow-[25px_25px_80px_rgba(0,0,0,0.3),-5px_-5px_40px_rgba(255,255,255,0.8)] border-[16px] border-double border-[#8b0000]/5 relative overflow-hidden max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="flex justify-between items-start mb-12 border-b border-[#8b0000]/10 pb-6">
              <div className="text-left">
                <h2 className="text-4xl md:text-6xl font-cursive text-[#8b0000] mb-2">
                  My Love For You
                </h2>
                <div className="h-1 w-24 bg-[#8b0000]/20 rounded-full"></div>
              </div>
              <div className="text-right text-[#5c4033]/50 font-serif italic text-sm pt-2">
                {today}
              </div>
            </div>

            <div className="text-left space-y-8">
              {lines.map((line, i) => (
                <div 
                  key={i} 
                  className={`text-xl md:text-2xl font-serif text-[#3d2b1f] leading-[1.8] italic animate-fadeIn opacity-0 fill-mode-forwards`}
                  style={{ animationDelay: `${i * 0.1}s`, animationDuration: '1s' }}
                >
                  {line === '' ? <br/> : line}
                </div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-[#8b0000]/10 flex flex-col items-center">
              <div className="text-[#5c4033] font-cursive text-3xl mb-2">
                Bütün sevgimle seni en mutlu edeceğim.
              </div>
              <div className="w-12 h-12 text-pink-500 animate-pulse">
                <Heart size={48} className="fill-current" />
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-100 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        </div>

        {!isTyping && (
          <button
            onClick={() => changeScene(ProposalStatus.DATE_IDEA)}
            className="mt-8 px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 animate-fadeIn"
          >
            Join me for our planned date 😝<ChevronRight size={24} />
          </button>
        )}
      </div>
    );
  };

  const renderDateIdeaState = () => (
    <div className={`flex flex-col items-center justify-center space-y-10 transition-all duration-1000 transform ${isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'} text-center max-w-4xl w-full px-4`}>
      <div className="bg-white/90 backdrop-blur-xl p-4 md:p-8 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 w-full flex flex-col items-center gap-8">
        <h2 className="text-5xl md:text-8xl font-cursive text-pink-600 drop-shadow-sm">
          Date idea
        </h2>
        
        <div className="relative group w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl">
          <div className="absolute inset-0 bg-pink-500/20 mix-blend-overlay group-hover:bg-transparent transition-all duration-700"></div>
          <img 
            src={DATE_GIF} 
            alt="Date Idea" 
            className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col items-center gap-4 max-w-lg">
          <p className="text-pink-800 text-xl md:text-2xl font-medium leading-relaxed italic">
            "When I'm with you, there's no place I'd rather be. 💗"
          </p>
          <div className="flex gap-2">
             {[1,2,3].map(i => <Heart key={i} size={16} className="text-pink-400 fill-current animate-pulse" style={{animationDelay: `${i * 0.3}s`}} />)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (status) {
      case ProposalStatus.SPLASH:
        return renderSplashState();
      case ProposalStatus.INTRO:
        return renderIntroState();
      case ProposalStatus.ACCEPTED:
        return renderAcceptedState();
      case ProposalStatus.DATE_IDEA:
        return renderDateIdeaState();
      default:
        return renderInitialState();
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 bg-[#0a0505]">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{ 
          backgroundImage: `url('${BG_IMAGE}')`,
          filter: 'brightness(0.7) saturate(1.2)'
        }} 
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 backdrop-blur-[0.5px]" />
      
      <FloatingHearts />
      
      <main className="relative z-10 w-full flex items-center justify-center py-10">
        {renderContent()}
      </main>

      <footer className="fixed bottom-6 left-0 w-full text-center text-white/50 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase pointer-events-none z-20">
        Made for only you, {name}!
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 0, 0, 0.1);
          border-radius: 10px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }
      `}</style>
    </div>
  );
};

export default App;

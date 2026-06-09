import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export default function PinScreen({ onComplete }: { onComplete: () => void }) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const CORRECT_PIN = '100324';

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(false);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/\D/g, '');
    if (pastedData) {
      const newPin = [...pin];
      for (let i = 0; i < pastedData.length; i++) {
        newPin[i] = pastedData[i];
      }
      setPin(newPin);
      if (pastedData.length < 6) {
        inputRefs.current[pastedData.length]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    if (pin.join('') === CORRECT_PIN) {
      onComplete();
    } else {
      setError(true);
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-rose-950 to-pink-950 overflow-hidden">
      <FloatingHearts />
      
      <div className="relative z-10 flex flex-col items-center p-8 bg-black/20 backdrop-blur-md rounded-3xl border border-pink-500/20 shadow-[-10px_-10px_30px_rgba(244,63,94,0.1),10px_10px_30px_rgba(255,100,150,0.1)]">
        <h1 className="text-4xl md:text-5xl text-rose-200 mb-2 font-dancing text-center drop-shadow-md">Welcome to my secret place</h1>
        <p className="text-rose-300/80 text-sm md:text-base font-light mb-8 italic">please enter ur password</p>

        <motion.div 
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex gap-2 md:gap-3 mb-8"
        >
          {pin.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className={`w-10 h-12 md:w-12 md:h-14 text-center text-xl bg-rose-950/40 border rounded-xl text-rose-100 outline-none transition-all focus:bg-rose-900/60 ${error ? 'border-red-500' : 'border-rose-400/30 focus:border-rose-400'}`}
            />
          ))}
        </motion.div>

        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-medium tracking-wide shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all hover:scale-105 active:scale-95"
        >
          Open <Heart size={16} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

function FloatingHearts() {
  const [hearts, setHearts] = useState<any[]>([]);

  useEffect(() => {
    // Client-side only generation to match standard React patterns
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animDuration: 15 + Math.random() * 15,
      delay: Math.random() * 10,
      size: 10 + Math.random() * 20,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
       {hearts.map(h => (
         <motion.div
           key={h.id}
           className="absolute bottom-[-50px] text-pink-500/20"
           style={{ left: `${h.left}%` }}
           animate={{
             y: ['0vh', '-120vh'],
             x: [0, Math.random() * 50 - 25, 0],
             rotate: [0, 180, 360]
           }}
           transition={{
             duration: h.animDuration,
             delay: h.delay,
             repeat: Infinity,
             ease: 'linear'
           }}
         >
           <Heart size={h.size} fill="currentColor" />
         </motion.div>
       ))}
    </div>
  );
}

import { motion } from 'motion/react';
import { useEffect } from 'react';

export default function RoseAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Finish animation and unmount
    const timer = setTimeout(onComplete, 7000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 5.5 }}
    >
      <div className="relative flex flex-col items-center">
        <motion.div
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1.2, opacity: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="relative w-64 h-64 drop-shadow-[0_0_40px_rgba(225,29,72,0.8)]"
        >
          {/* Simple stylized blooming rose */}
          <svg viewBox="-20 -20 140 140" className="w-full h-full">
             {/* Stem */}
             <motion.path 
                d="M50 50 Q 55 80, 45 120"
                stroke="#10B981"
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 1.5 }}
             />
             <motion.path 
                d="M52 70 Q 70 70, 75 60"
                stroke="#10B981"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
             />
             <motion.path 
                d="M48 90 Q 20 80, 25 70"
                stroke="#10B981"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
             />

             {/* Center rose bud expanding */}
             <motion.circle 
               cx="50" cy="50" r="10" fill="#be123c"
               initial={{ r: 0 }} animate={{ r: 18 }} transition={{ delay: 1.5, duration: 2 }}
             />

             {/* Inner petals spreading slowly */}
             {[0, 72, 144, 216, 288].map((deg, i) => (
                <motion.path 
                  key={`inner-${deg}`}
                  d="M50 50 Q 70 15, 50 0 Q 30 15, 50 50" 
                  fill="#e11d48"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ transformOrigin: '50px 50px', transform: `rotate(${deg}deg)` }}
                  transition={{ delay: 2 + i * 0.3, duration: 1.5, ease: 'easeOut' }}
                />
             ))}

             {/* Outer petals spreading wider */}
             {[36, 108, 180, 252, 324].map((deg, i) => (
                <motion.path 
                  key={`outer-${deg}`}
                  d="M50 50 Q 95 -10, 50 -35 Q 5 -10, 50 50" 
                  fill="#f43f5e"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ transformOrigin: '50px 50px', transform: `rotate(${deg}deg)` }}
                  transition={{ delay: 3 + i * 0.3, duration: 2, ease: 'easeOut' }}
                />
             ))}

             {/* Additional outermost petals to make it look fuller */}
             {[0, 90, 180, 270].map((deg, i) => (
                <motion.path 
                  key={`outermost-${deg}`}
                  d="M50 50 Q 110 10, 50 -45 Q -10 10, 50 50" 
                  fill="#fb7185"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ transformOrigin: '50px 50px', transform: `rotate(${deg}deg)` }}
                  transition={{ delay: 4 + i * 0.4, duration: 2.5, ease: 'easeOut' }}
                />
             ))}
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

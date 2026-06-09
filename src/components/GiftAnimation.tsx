import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Gift, Heart } from 'lucide-react';

export default function GiftAnimation({ onComplete }: { onComplete: () => void }) {
  const [opened, setOpened] = useState(false);
  const [particles, setParticles] = useState<{ id: number; type: 'flower' | 'heart'; x: number; delay: number }[]>([]);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    
    // Generate particles
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        type: Math.random() > 0.4 ? 'flower' : ('heart' as 'flower' | 'heart'),
        x: (Math.random() - 0.5) * 200, // spread horizontally
        delay: Math.random() * 1.5 // staggered animation
      });
    }
    setParticles(newParticles);

    // Give time for particles to fly out before completing
    setTimeout(onComplete, 4000);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 px-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="relative flex flex-col items-center max-w-sm w-full text-center">
        <AnimatePresence>
          {!opened && (
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xl font-bold text-rose-500 mb-8"
            >
              Halo Beyy, kamu dapat hadiah dari Rendy
            </motion.h1>
          )}
        </AnimatePresence>

        <div className="relative cursor-pointer group" onClick={handleOpen}>
          {/* Gift Box / Open Particles Area */}
          <div className="h-64 flex items-end justify-center relative w-64">
            <AnimatePresence>
              {!opened ? (
                <motion.div
                  key="giftbox"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    rotate: [0, -2, 2, -2, 2, 0],
                    transition: { repeat: Infinity, repeatDelay: 2, duration: 0.5 }
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative flex justify-center items-end w-full h-full pb-4"
                >
                  {/* Closed Box Base */}
                  <div className="bg-rose-600 w-32 h-24 rounded-b-xl relative shadow-[0_0_30px_rgba(225,29,72,0.5)] z-10">
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-yellow-400/90"></div>
                  </div>
                  
                  {/* Closed Lid */}
                  <div className="bg-rose-500 w-36 h-10 rounded-lg absolute bottom-[104px] z-20 shadow-lg">
                     <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-yellow-400/90"></div>
                     {/* Bow / Ribbon loops */}
                     <div className="absolute -top-6 left-1/2 -translate-x-full w-8 h-8 border-4 border-yellow-400/90 rounded-full bg-transparent origin-bottom-right rotate-12"></div>
                     <div className="absolute -top-6 left-1/2 w-8 h-8 border-4 border-yellow-400/90 rounded-full bg-transparent origin-bottom-left -rotate-12"></div>
                  </div>
                </motion.div>
              ) : (
                <div key="flowers" className="relative w-full h-full flex justify-center items-end pb-4">
                  {/* The Box Base when opened */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-rose-700 w-32 h-24 rounded-b-xl absolute bottom-4 shadow-xl border-t border-rose-900 z-10"
                  >
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-yellow-400/90"></div>
                  </motion.div>

                  {/* The Lid flying off */}
                  <motion.div 
                    initial={{ y: 0, rotate: 0, opacity: 1 }}
                    animate={{ y: -80, rotate: -30, opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-rose-500 w-36 h-10 rounded-lg absolute bottom-[104px] z-30"
                  >
                     <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-yellow-400/90"></div>
                     <div className="absolute -top-6 left-1/2 -translate-x-full w-8 h-8 border-4 border-yellow-400/90 rounded-full bg-transparent origin-bottom-right rotate-12"></div>
                     <div className="absolute -top-6 left-1/2 w-8 h-8 border-4 border-yellow-400/90 rounded-full bg-transparent origin-bottom-left -rotate-12"></div>
                  </motion.div>

                  {/* Particles flying out */}
                  {particles.map(p => (
                    <motion.div
                      key={p.id}
                      className="absolute bottom-12"
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], 
                        scale: [0.5, p.type === 'flower' ? 1.5 : 1, 1.2, 0.8], 
                        x: p.x, 
                        y: -300 - Math.random() * 200,
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: 2.5 + Math.random(), 
                        delay: p.delay,
                        ease: "easeOut"
                      }}
                    >
                      {p.type === 'flower' ? (
                        <div className="text-3xl filter drop-shadow-md">🌸</div>
                      ) : (
                        <Heart size={28} className="text-rose-500 fill-rose-500 filter drop-shadow-lg" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {!opened && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-zinc-400"
            >
              Klik Kado Untuk membuka.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useState, useEffect } from "react";

interface FateFlipProps {
  modelsCount: number;
  onDecision: (flipResult: number) => void;
}

export default function FateFlip({ modelsCount, onDecision }: FateFlipProps) {
  const [showButton, setShowButton] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (modelsCount === 2) {
      timer = setTimeout(() => {
        setShowButton(true);
      }, 30000);
    } else {
      setShowButton(false);
    }
    return () => clearTimeout(timer);
  }, [modelsCount]);

  const triggerFlip = () => {
    setShowButton(false);
    setShowModal(true);
    setIsFlipping(true);

    // 50% chance for heads vs tails
    const toss = Math.random() < 0.5 ? "heads" : "tails";
    setResult(toss);

    // Stop flip after 3s, call onDecision with 0 or 1 index
    setTimeout(() => {
      setIsFlipping(false);
      onDecision(toss === "heads" ? 0 : 1);

      // Keep modal open for 7 seconds to read the message and see the coin, then hide
      setTimeout(() => {
        setShowModal(false);
      }, 7000);
    }, 3000);
  };

  if (!showButton && !showModal) return null;

  return (
    <>
      {showButton && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 w-full sm:w-auto flex justify-center">
          <button
            onClick={triggerFlip}
            className="w-full sm:w-auto glass-card flex items-center justify-center gap-2 px-6 py-4 bg-navy-dark/90 border border-accent shadow-[0_0_15px_rgba(0,212,255,0.4)] text-text-primary font-bold rounded-2xl hover:bg-navy-dark transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,212,255,0.6)] animate-pulse"
          >
            <span className="text-2xl">🪙</span>
            <span className="text-base sm:text-lg">Karar Veremiyor musun? Kadere Bırak!</span>
            <span className="text-2xl">🪙</span>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-darkest/95 backdrop-blur-md">
          <div className="perspective-1000 w-32 h-32 sm:w-40 sm:h-40 relative mb-12">
            <div
              className={`w-full h-full relative preserve-3d transition-transform ${isFlipping
                  ? (result === "heads" ? "animate-flip-heads" : "animate-flip-tails")
                  : (result === "tails" ? "rotate-y-180" : "")
                }`}
            >
              {/* Heads Face */}
              <div className="absolute inset-0 backface-hidden w-full h-full rounded-full border-[6px] border-accent bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.8)]">
                <span className="text-6xl sm:text-7xl font-serif text-white font-extrabold italic drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                  N
                </span>
              </div>
              {/* Tails Face */}
              <div className="absolute inset-0 backface-hidden w-full h-full rounded-full border-[6px] border-accent bg-gradient-to-tr from-accent to-[#0088cc] flex items-center justify-center rotate-y-180 shadow-[0_0_40px_rgba(0,212,255,0.8)]">
                <span className="text-6xl sm:text-7xl drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
                  🫏
                </span>
              </div>
            </div>
          </div>

          {!isFlipping && result && (
            <div className="glass-card px-8 py-5 bg-navy-card/90 border-accent max-w-[90%] sm:max-w-lg text-center transform transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                Zaten senin gönlün şunda kalmıştı, itiraf et! Bak parlıyor. 😉
              </h3>
            </div>
          )}
        </div>
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

const easeCurve = [0.34, 1.3, 0.64, 1] as const;
const exitEaseCurve = [0.16, 1, 0.3, 1] as const;

interface AxionSplashScreenProps {
  onComplete: () => void;
  isDarkMode?: boolean;
}

export function AxionSplashScreen({
  onComplete,
  isDarkMode = true,
}: AxionSplashScreenProps) {
  const [stage, setStage] = useState<"visible" | "exit">("visible");

  useEffect(() => {
    // Automatically trigger exit animation at 2.0 seconds, and complete at 2.4 seconds
    const exitTimer = setTimeout(() => {
      setStage("exit");
    }, 2000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2400);

    // Lock body scrolling during splash screen
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  // Framer Motion variants
  const bgVariants: Variants = {
    visible: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 0.4, ease: exitEaseCurve },
    },
  };

  // The 4 blocks animation: Staggered entry, moving to final position
  const block1Variants: Variants = {
    initial: { opacity: 0, scale: 0.3, x: -35, y: -35 },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        opacity: { duration: 0.25, delay: 0.1 },
        scale: { duration: 0.3, delay: 0.1 },
        x: { duration: 0.65, delay: 0.6, ease: easeCurve },
        y: { duration: 0.65, delay: 0.6, ease: easeCurve },
      },
    },
  };

  const block2Variants: Variants = {
    initial: { opacity: 0, scale: 0.3, x: 35, y: -35 },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        opacity: { duration: 0.25, delay: 0.22 },
        scale: { duration: 0.3, delay: 0.22 },
        x: { duration: 0.65, delay: 0.6, ease: easeCurve },
        y: { duration: 0.65, delay: 0.6, ease: easeCurve },
      },
    },
  };

  const block3Variants: Variants = {
    initial: { opacity: 0, scale: 0.3, x: -35, y: 35 },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        opacity: { duration: 0.25, delay: 0.34 },
        scale: { duration: 0.3, delay: 0.34 },
        x: { duration: 0.65, delay: 0.6, ease: easeCurve },
        y: { duration: 0.65, delay: 0.6, ease: easeCurve },
      },
    },
  };

  const block4Variants: Variants = {
    initial: { opacity: 0, scale: 0.3, x: 35, y: 35 },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        opacity: { duration: 0.25, delay: 0.46 },
        scale: { duration: 0.3, delay: 0.46 },
        x: { duration: 0.65, delay: 0.6, ease: easeCurve },
        y: { duration: 0.65, delay: 0.6, ease: easeCurve },
      },
    },
  };

  // Outer logo glow expansion
  const glowVariants: Variants = {
    initial: { opacity: 0, scale: 0.6 },
    animate: {
      opacity: 1,
      scale: 1.15,
      transition: {
        duration: 0.7,
        delay: 1.1,
        ease: "easeOut",
      },
    },
  };

  // Text variants
  const axionTextVariants: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 1.25, ease: "easeOut" },
    },
  };

  const technologiesTextVariants: Variants = {
    initial: { opacity: 0, letterSpacing: "0.2em" },
    animate: {
      opacity: 1,
      letterSpacing: "0.34em",
      transition: { duration: 0.6, delay: 1.45, ease: "easeOut" },
    },
  };

  const taglineVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 0.75,
      transition: { duration: 0.6, delay: 1.65, ease: "easeOut" },
    },
  };

  // Final exit morph / scale-down
  const containerVariants: Variants = {
    visible: { scale: 1, x: 0, y: 0, opacity: 1 },
    exit: {
      scale: 0.35,
      x: -window.innerWidth * 0.35,
      y: -window.innerHeight * 0.43,
      opacity: 0,
      transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <AnimatePresence>
      {stage === "visible" && (
        <motion.div
          variants={bgVariants}
          initial="visible"
          exit="exit"
          className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden ${
            isDarkMode ? "bg-[#020817]" : "bg-[#0b1329]"
          }`}
        >
          {/* Subtle grid backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(77,163,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(77,163,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="visible"
            exit="exit"
            className="flex flex-col items-center"
          >
            {/* SVG Logo Assembly Canvas */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Soft expanding blue glow */}
              <motion.div
                variants={glowVariants}
                initial="initial"
                animate="animate"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(77,163,255,0.22) 0%, rgba(13,59,143,0.0) 70%)",
                  filter: "blur(24px)",
                }}
              />

              <svg
                width="112"
                height="112"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
              >
                <defs>
                  <linearGradient id="splash-grad-light-blue" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7ACCFF" />
                    <stop offset="50%" stopColor="#4DA3FF" />
                    <stop offset="100%" stopColor="#1F85FF" />
                  </linearGradient>

                  <linearGradient id="splash-grad-dark-blue" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1B5AE0" />
                    <stop offset="50%" stopColor="#0D3B8F" />
                    <stop offset="100%" stopColor="#06225B" />
                  </linearGradient>
                </defs>

                {/* Top Left Block */}
                <motion.rect
                  variants={block1Variants}
                  initial="initial"
                  animate="animate"
                  x="4"
                  y="4"
                  width="42"
                  height="42"
                  rx="12"
                  fill="url(#splash-grad-light-blue)"
                />

                {/* Top Right Block */}
                <motion.rect
                  variants={block2Variants}
                  initial="initial"
                  animate="animate"
                  x="54"
                  y="4"
                  width="42"
                  height="42"
                  rx="12"
                  fill="url(#splash-grad-dark-blue)"
                />

                {/* Bottom Left Block */}
                <motion.rect
                  variants={block3Variants}
                  initial="initial"
                  animate="animate"
                  x="4"
                  y="54"
                  width="42"
                  height="42"
                  rx="12"
                  fill="url(#splash-grad-dark-blue)"
                />

                {/* Bottom Right Block */}
                <motion.rect
                  variants={block4Variants}
                  initial="initial"
                  animate="animate"
                  x="54"
                  y="54"
                  width="42"
                  height="42"
                  rx="12"
                  fill="url(#splash-grad-light-blue)"
                />
              </svg>
            </div>

            {/* Typography Sequence */}
            <div className="flex flex-col items-center mt-6 text-center">
              <motion.h1
                variants={axionTextVariants}
                initial="initial"
                animate="animate"
                className="font-sans text-white text-3xl font-extrabold tracking-[0.25em] leading-none"
              >
                AXION
              </motion.h1>

              <motion.span
                variants={technologiesTextVariants}
                initial="initial"
                animate="animate"
                className="font-sans text-blue-400/90 text-xs font-semibold uppercase leading-none mt-3.5"
              >
                TECHNOLOGIES
              </motion.span>

              <motion.p
                variants={taglineVariants}
                initial="initial"
                animate="animate"
                className="font-sans text-slate-400 text-[11px] font-medium tracking-wide mt-6 max-w-sm px-6 leading-relaxed"
              >
                Transforming Businesses Through Intelligent Technology
              </motion.p>
            </div>
          </motion.div>

          {/* Telemetry watermark */}
          <div className="absolute bottom-8 left-8 flex items-center gap-2 text-[9px] font-mono tracking-widest text-slate-500 opacity-60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            AXION ENTERPRISE CORE SYSTEM LOCALIZED
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AxionSplashScreen;

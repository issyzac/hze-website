import { motion, useReducedMotion } from "framer-motion";
import { SECTIONS, type Section } from "../../data/careers";

interface ProgressRailProps {
  percent: number;
  answered: number;
  total: number;
  currentStep: number;
  completedSections: string[];
  onJump: (index: number) => void;
}

/** A cup that fills as the application is completed. */
const CoffeeCup = ({ percent }: { percent: number }) => {
  const reduceMotion = useReducedMotion();
  // Cup interior spans y=16 (rim) to y=52 (base).
  const top = 52 - (36 * Math.min(100, Math.max(0, percent))) / 100;

  return (
    <svg width="52" height="60" viewBox="0 0 60 66" aria-hidden className="shrink-0">
      <defs>
        <clipPath id="cup-inside">
          <path d="M12 16 H44 L41 50 A6 6 0 0 1 35 55 H21 A6 6 0 0 1 15 50 Z" />
        </clipPath>
      </defs>

      {/* Steam */}
      {percent > 0 && !reduceMotion && (
        <g stroke="#B37542" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.5">
          {[20, 30, 40].map((x, i) => (
            <motion.path
              key={x}
              d={`M${x} 12 C ${x - 3} 8, ${x + 3} 6, ${x} 2`}
              animate={{ opacity: [0.15, 0.6, 0.15], y: [0, -3, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35 }}
            />
          ))}
        </g>
      )}

      {/* Coffee level */}
      <g clipPath="url(#cup-inside)">
        <rect x="10" y="14" width="40" height="44" fill="#EEEBE7" />
        <motion.rect
          x="10"
          width="40"
          height="60"
          fill="#7A4E1E"
          initial={false}
          animate={{ y: top }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </g>

      {/* Cup outline + handle */}
      <path
        d="M12 16 H44 L41 50 A6 6 0 0 1 35 55 H21 A6 6 0 0 1 15 50 Z"
        fill="none"
        stroke="#3A2415"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M44 22 A7 7 0 0 1 44 38" fill="none" stroke="#3A2415" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 59 H46" stroke="#3A2415" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
};

export default function ProgressRail({
  percent,
  answered,
  total,
  currentStep,
  completedSections,
  onJump,
}: ProgressRailProps) {
  return (
    <div className="sticky top-16 sm:top-20 z-30 -mx-4 sm:mx-0 px-4 sm:px-6 py-4 bg-[#FBF7EE]/95 backdrop-blur border-b-2 border-dashed border-bronze-deep/25">
      <div className="flex items-center gap-4">
        <CoffeeCup percent={percent} />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-1.5">
            <span className="font-sans text-xs sm:text-sm font-medium tracking-[0.16em] uppercase text-bronze-deep">
              Kikombe chako — your cup
            </span>
            <span className="font-sans text-sm text-ink/70 tabular-nums shrink-0">
              <motion.span
                key={answered}
                initial={{ scale: 1.4, color: "#2B7A6E" }}
                animate={{ scale: 1, color: "#1C1408" }}
                transition={{ duration: 0.4 }}
                className="inline-block font-medium"
              >
                {answered}
              </motion.span>
              <span className="text-ink/45">/{total} · {percent}%</span>
            </span>
          </div>

          <div className="h-2.5 w-full bg-bronze-deep/15 overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-enzi-lb via-enzi-db to-bronze-deep rounded-full"
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            />
          </div>

          {/* Section stamps */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {SECTIONS.map((section: Section, i) => {
              const earned = completedSections.includes(section.id);
              const current = i === currentStep;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onJump(i)}
                  title={`${i + 1}. ${section.title}`}
                  aria-label={`Section ${i + 1}: ${section.title}${earned ? " — completed" : ""}`}
                  aria-current={current ? "step" : undefined}
                  className={`shrink-0 h-9 w-9 flex items-center justify-center text-base border-2 transition-all ${
                    earned
                      ? "bg-hze-teal/10 border-hze-teal text-hze-teal"
                      : current
                        ? "bg-enzi-db/10 border-enzi-db"
                        : "bg-transparent border-bronze-deep/20 opacity-45 hover:opacity-80"
                  }`}
                  style={{ transform: earned ? "rotate(-5deg)" : undefined }}
                >
                  <span aria-hidden>{earned ? section.stamp : i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

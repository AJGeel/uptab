import {
  CarrotIcon,
  CheckIcon,
  ConfettiIcon,
  Icon,
  SnowflakeIcon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

import { eggs, EggId } from "@/src/services/easterEggs/eggs";

/** The icon of each egg, and the colour it's drawn in on its white tile. */
const EGG_ICONS: Record<EggId, { icon: Icon; color: string }> = {
  Sinterklaas: { icon: CarrotIcon, color: "text-orange-500" },
  Christmas: { icon: SnowflakeIcon, color: "text-sky-500" },
  "Oud & Nieuw": { icon: ConfettiIcon, color: "text-fuchsia-500" },
};

/** The banner of an unlocked achievement: the egg's own photo, a medal, and a shine. */
const EggAchievement = ({ egg }: { egg: EggId }) => {
  const shouldReduceMotion = useReducedMotion();
  const { achievement, background } = eggs[egg];
  const { icon: EggIcon, color } = EGG_ICONS[egg];
  // Still for people who prefer less motion.
  const motionOff = !!shouldReduceMotion;

  return (
    <div
      className="relative flex h-44 items-center gap-5 overflow-hidden px-6 text-white"
      style={{
        backgroundImage: `${achievement.tint}, url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-scrim/50 to-transparent" />

      {/* A shine that sweeps across now and then. */}
      {!motionOff && (
        <motion.div
          className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["0%", "600%"] }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
            delay: 0.5,
            repeat: Infinity,
            repeatDelay: 3.5,
          }}
        />
      )}

      {/* The icon, on a white tile like the buttons in the app, with a check for unlocked. */}
      <motion.div
        className="relative shrink-0"
        initial={motionOff ? false : { scale: 0.4, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
      >
        <div className="absolute inset-0 rounded-3xl bg-white/40 blur-xl" />
        <div className="relative grid size-20 place-items-center rounded-3xl bg-white shadow-lg">
          <EggIcon weight="duotone" size={44} className={color} />
        </div>
        <span className="absolute -right-2 -bottom-2 grid size-7 place-items-center rounded-full bg-sky-500 text-white shadow-md ring-4 ring-white/80">
          <CheckIcon weight="bold" size={14} />
        </span>
      </motion.div>

      <motion.div
        className="relative min-w-0 text-shadow-md text-shadow-scrim/40"
        initial={motionOff ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.35 }}
      >
        <p className="text-sm font-semibold text-white/85">
          You found an easter egg
        </p>
        <p className="mt-1 text-2xl leading-tight font-extrabold">
          {achievement.name}
        </p>
      </motion.div>
    </div>
  );
};

export default EggAchievement;

"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  imageUrl?: string | null;
  fallbackColor?: string | null;
};

export default function CinematicBackground({ imageUrl, fallbackColor }: Props) {
  const glow = fallbackColor || "#0b0f14";

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: `radial-gradient(900px 500px at 60% 40%, ${glow}55, transparent 60%), #050608`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={imageUrl || "none"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {imageUrl && (
            <>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(18px)",
                  opacity: 0.55,
                }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

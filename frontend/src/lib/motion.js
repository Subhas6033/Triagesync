export const durations = { fast: 0.12, base: 0.2, slow: 0.32 };
export const easeOutExpo = [0.16, 1, 0.3, 1];
export const panelSpring = { type: "spring", stiffness: 360, damping: 32, mass: 0.8 };
export const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easeOutExpo } } };
export const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.035, delayChildren: 0 } } };
export const scaleIn = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: panelSpring } };
export const slideOver = { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: panelSpring } };

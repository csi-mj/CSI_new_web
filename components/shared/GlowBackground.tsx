/**
 * Faint blurred glows anchored to the page (not the screen), so they scroll with the content
 * and stay underneath it: one behind the hero (top-left), one behind the form (bottom-right).
 * The parent must be `relative`. The drift animation is skipped for prefers-reduced-motion.
 */
export default function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -left-[10vw] top-[2vh] h-[34vw] w-[34vw] rounded-full bg-[#ff2a3d]/[0.14] blur-[100px] motion-safe:animate-[glow-drift_26s_ease-in-out_infinite_alternate]" />
      <div className="absolute -right-[10vw] bottom-[6vh] h-[32vw] w-[32vw] rounded-full bg-[#960e28]/[0.2] blur-[100px] motion-safe:animate-[glow-drift_32s_ease-in-out_infinite_alternate-reverse]" />
    </div>
  );
}

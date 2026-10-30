import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/** Lightweight React-Bits-inspired cursor spotlight, implemented locally. */
export default function Spotlight() {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return;
    const node = ref.current;
    const xTo = gsap.quickTo(node, '--spot-x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(node, '--spot-y', { duration: 0.35, ease: 'power3' });
    const move = (event) => { xTo(`${event.clientX}px`); yTo(`${event.clientY}px`); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div ref={ref} className="cursor-spotlight" aria-hidden="true" />;
}

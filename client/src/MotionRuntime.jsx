import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

/** Global smooth scrolling + restrained GSAP entrance/hover motion. */
export default function MotionRuntime() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const lenis = new Lenis({ autoRaf: true, smoothWheel: true, anchors: true });
    const ctx = gsap.context(() => {
      gsap.fromTo('.nav', { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', clearProps: 'transform,opacity' });
      gsap.utils.toArray('.btn').forEach((button) => {
        const enter = () => gsap.to(button, { y: -2, duration: 0.18, ease: 'power2.out', overwrite: true });
        const leave = () => gsap.to(button, { y: 0, duration: 0.22, ease: 'power2.out', overwrite: true });
        button.addEventListener('pointerenter', enter);
        button.addEventListener('pointerleave', leave);
        button.__botlensCleanup = () => {
          button.removeEventListener('pointerenter', enter);
          button.removeEventListener('pointerleave', leave);
        };
      });
    });

    return () => {
      ctx.revert();
      document.querySelectorAll('.btn').forEach((button) => button.__botlensCleanup?.());
      lenis.destroy();
    };
  }, []);
  return null;
}

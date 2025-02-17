"use client"
import { useEffect, useRef } from "react";
import { Synth, Delay, LFO } from "tone";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const synthRef = useRef<Synth | null>(null);
  const delayRef = useRef<Delay | null>(null);
  const lfoRef = useRef<LFO | null>(null);

  useEffect(() => {
    if (!synthRef.current && !delayRef.current && !lfoRef.current) {
      const newSynth = new Synth().toDestination();
      const newDelay = new Delay().toDestination();
      const newLFO = new LFO(0.5, 0.1, 1).start();

      newSynth.connect(newDelay);
      newLFO.connect(newDelay.delayTime);

      synthRef.current = newSynth;
      delayRef.current = newDelay;
      lfoRef.current = newLFO;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (lfoRef.current) {
        const mouseX = e.clientX / window.innerWidth;
        lfoRef.current.frequency.value = mouseX * 10;
      }
    };

    const handleClick = () => {
      if (synthRef.current) {
        const randomNote = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"][
          Math.floor(Math.random() * 7)
          ];
        synthRef.current.triggerAttackRelease(randomNote, "8n");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10 text-white text-center">
        <h1 className="text-3xl">Tone.js experiment</h1>
        <p>Move the mouse and click in different spots</p>
      </div>
    </div>
  );
}

// Web Audio engine: koi mp3 file nahi chahiye, sab browser me generate hota hai.
export type AudioTheme = "lofi" | "synthwave";

const CHORDS = [
  [220, 261.63, 329.63, 392],     // Am7
  [174.61, 220, 261.63, 329.63],  // Fmaj7
  [261.63, 329.63, 392, 493.88],  // Cmaj7
  [196, 246.94, 293.66, 329.63],  // G6
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicGain!: GainNode;
  private filter!: BiquadFilterNode;
  private sfxGain!: GainNode;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  vibe = false;
  theme: AudioTheme = "lofi";

  /** Kisi user click ke andar hi call karo (browser autoplay rule). */
  init() {
    if (this.ctx) { void this.ctx.resume(); return; }
    const C = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new C();
    this.master = this.ctx.createGain(); this.master.gain.value = 0.8;
    this.filter = this.ctx.createBiquadFilter(); this.filter.type = "lowpass";
    this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0;
    this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = 0.5;
    this.musicGain.connect(this.filter).connect(this.master);
    this.sfxGain.connect(this.master);
    this.master.connect(this.ctx.destination);
  }

  setVibe(on: boolean) {
    this.vibe = on;
    if (on) { this.init(); this.startMusic(); } else this.stopMusic();
  }

  setTheme(t: AudioTheme) {
    this.theme = t;
    if (this.vibe) { this.stopMusic(true); this.startMusic(); }
  }

  /** Click SFX: sirf vibe mode me bajta hai. */
  click() {
    if (!this.vibe || !this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = "square";
    o.frequency.setValueAtTime(1200, t);
    o.frequency.exponentialRampToValueAtTime(420, t + 0.07);
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    o.connect(g).connect(this.sfxGain);
    o.start(t); o.stop(t + 0.1);
  }

  private tone(freq: number, when: number, dur: number, type: OscillatorType, vol: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g).connect(this.musicGain);
    o.start(when); o.stop(when + dur + 0.05);
  }

  private startMusic() {
    if (!this.ctx || this.timer) return;
    const ctx = this.ctx;
    const lofi = this.theme === "lofi";
    const stepDur = 60 / (lofi ? 72 : 108) / 2;
    this.filter.frequency.value = lofi ? 1100 : 3200;
    this.musicGain.gain.cancelScheduledValues(ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.2);
    this.nextTime = ctx.currentTime + 0.1;
    this.step = 0;

    this.timer = window.setInterval(() => {
      while (this.nextTime < ctx.currentTime + 0.3) {
        const bar = Math.floor(this.step / 8) % CHORDS.length;
        const chord = CHORDS[bar];
        const s = this.step % 8;
        if (lofi) {
          if (s === 0) chord.forEach((f) => this.tone(f / 2, this.nextTime, stepDur * 8, "sine", 0.05));
          if (Math.random() > 0.3) this.tone(chord[(s * 3) % 4] * 2, this.nextTime, stepDur * 1.5, "triangle", 0.035);
          if (s % 4 === 0) this.tone(chord[0] / 4, this.nextTime, stepDur * 2, "sine", 0.09);
        } else {
          this.tone(chord[0] / 2, this.nextTime, stepDur * 0.9, "sawtooth", 0.06);
          this.tone(chord[s % 4] * 2, this.nextTime, stepDur * 0.7, "square", 0.025);
          if (s === 0) chord.forEach((f) => this.tone(f, this.nextTime, stepDur * 8, "sawtooth", 0.015));
        }
        this.nextTime += stepDur;
        this.step++;
      }
    }, 100);
  }

  private stopMusic(instant = false) {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(t);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
    this.musicGain.gain.linearRampToValueAtTime(0, t + (instant ? 0.05 : 0.6));
  }
}

export const audio = new AudioEngine();

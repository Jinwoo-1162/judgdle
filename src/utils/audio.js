// Synthesized Web Audio Courtroom Soundscape
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Slower, deliberate heavy wooden gavel strike
function playGavel(ctx, now) {
  [0, 0.28].forEach((offset, idx) => {
    const isSecond = idx === 1;
    const strikeTime = now + offset;
    const volume = isSecond ? 0.42 : 0.32;

    // Wooden strike body (triangle pitch drop)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, strikeTime);
    osc.frequency.exponentialRampToValueAtTime(36, strikeTime + 0.16);

    gain.gain.setValueAtTime(volume, strikeTime);
    gain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(strikeTime);
    osc.stop(strikeTime + 0.19);

    // Deep sound-block sub resonance
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(80, strikeTime);
    sub.frequency.exponentialRampToValueAtTime(28, strikeTime + 0.22);
    subGain.gain.setValueAtTime(volume * 0.75, strikeTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.24);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(strikeTime);
    sub.stop(strikeTime + 0.25);
  });
}

// 2. Success Chime (Warm, understated acoustic confirmation)
function playSuccessChime(ctx, now) {
  const notes = [
    { freq: 440.0, time: 0, dur: 0.3 },    // A4 (warm fundamental)
    { freq: 659.25, time: 0.06, dur: 0.36 } // E5 (consonant fifth)
  ];

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(n.freq, now + n.time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now + n.time);

    gain.gain.setValueAtTime(0.001, now + n.time);
    gain.gain.linearRampToValueAtTime(0.075, now + n.time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + n.time);
    osc.stop(now + n.time + n.dur + 0.02);
  });
}

// 3. Subtle Upward Cue (Muted, warm acoustic lift for 'higher')
function playTwangUp(ctx, now) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(190, now);
  osc.frequency.exponentialRampToValueAtTime(290, now + 0.22);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(550, now);
  filter.Q.value = 1.0;

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.085, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.27);
}

// 4. Subtle Downward Cue (Muted, warm acoustic descent for 'lower')
function playTwangDown(ctx, now) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(550, now);
  filter.Q.value = 1.0;

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.085, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.27);
}

// 5. Page Turn (Filtered paper friction rustle)
function playPageTurn(ctx, now) {
  try {
    const bufferSize = Math.floor(ctx.sampleRate * 0.22);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, now);
    filter.frequency.exponentialRampToValueAtTime(550, now + 0.2);
    filter.Q.value = 1.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.22);
  } catch (e) {
    // Audio buffer fallback
  }
}

// 6. Jail Bars Closing (Metallic rattle + heavy iron slam + steel bar resonance)
function playJailBars(ctx, now) {
  // A. Sliding bars rattle (t = 0 to 0.16s)
  try {
    const rattleSize = Math.floor(ctx.sampleRate * 0.16);
    const rattleBuf = ctx.createBuffer(1, rattleSize, ctx.sampleRate);
    const rattleData = rattleBuf.getChannelData(0);
    for (let i = 0; i < rattleSize; i++) {
      rattleData[i] = (Math.random() * 2 - 1) * (i % 60 < 30 ? 1 : 0.25);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = rattleBuf;
    const nFilter = ctx.createBiquadFilter();
    nFilter.type = 'highpass';
    nFilter.frequency.setValueAtTime(2400, now);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.07, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.16);
  } catch (e) {
    // Safe buffer fallback
  }

  // B. Heavy iron slam impact (t = 0.17s)
  const slamTime = now + 0.17;
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'triangle';
  sub.frequency.setValueAtTime(110, slamTime);
  sub.frequency.exponentialRampToValueAtTime(30, slamTime + 0.35);
  subGain.gain.setValueAtTime(0.42, slamTime);
  subGain.gain.exponentialRampToValueAtTime(0.001, slamTime + 0.38);
  sub.connect(subGain);
  subGain.connect(ctx.destination);
  sub.start(slamTime);
  sub.stop(slamTime + 0.4);

  // C. Ringing steel bar resonant overtones (t = 0.17s to 1.1s)
  const barFrequencies = [440, 587, 880, 1175];
  barFrequencies.forEach((freq, idx) => {
    const barOsc = ctx.createOscillator();
    const barGain = ctx.createGain();
    barOsc.type = 'sine';
    barOsc.frequency.setValueAtTime(freq, slamTime);
    barGain.gain.setValueAtTime(0.12 / (idx + 1), slamTime);
    barGain.gain.exponentialRampToValueAtTime(0.001, slamTime + 0.65 + idx * 0.12);
    barOsc.connect(barGain);
    barGain.connect(ctx.destination);
    barOsc.start(slamTime);
    barOsc.stop(slamTime + 0.75 + idx * 0.12);
  });
}

// 7. Courtroom Oak Door Closing (Heavy wooden thud & latch lock)
function playDoorClose(ctx, now) {
  // Heavy sub impact of solid oak door
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'triangle';
  sub.frequency.setValueAtTime(110, now);
  sub.frequency.exponentialRampToValueAtTime(28, now + 0.38);
  subGain.gain.setValueAtTime(0.45, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
  sub.connect(subGain);
  subGain.connect(ctx.destination);
  sub.start(now);
  sub.stop(now + 0.44);

  // Hollow wooden doorframe resonance
  const wood = ctx.createOscillator();
  const woodGain = ctx.createGain();
  wood.type = 'sine';
  wood.frequency.setValueAtTime(180, now);
  wood.frequency.exponentialRampToValueAtTime(50, now + 0.28);
  woodGain.gain.setValueAtTime(0.24, now);
  woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  wood.connect(woodGain);
  woodGain.connect(ctx.destination);
  wood.start(now);
  wood.stop(now + 0.32);

  // Heavy metal latch click at t = 0.08s
  const clickTime = now + 0.08;
  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = 'sawtooth';
  click.frequency.setValueAtTime(750, clickTime);
  click.frequency.exponentialRampToValueAtTime(180, clickTime + 0.04);
  clickGain.gain.setValueAtTime(0.15, clickTime);
  clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.05);
  click.connect(clickGain);
  clickGain.connect(ctx.destination);
  click.start(clickTime);
  click.stop(clickTime + 0.06);
}

// Master Dispatcher
export function playSound(type, soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case 'gavel':
        playGavel(ctx, now);
        break;
      case 'correct':
        playSuccessChime(ctx, now);
        break;
      case 'higher':
        playTwangUp(ctx, now);
        break;
      case 'lower':
        playTwangDown(ctx, now);
        break;
      case 'pageTurn':
        playPageTurn(ctx, now);
        break;
      case 'jailBars':
        playJailBars(ctx, now);
        break;
      case 'doorClose':
        playDoorClose(ctx, now);
        break;
      case 'win':
        playJailBars(ctx, now);
        break;
      default:
        break;
    }
  } catch (e) {
    // Safe fallback for unmounted/restricted contexts
  }
}

const app = document.getElementById('app');

app.innerHTML = `
  <main class="app">
    <div class="title">
      <h1>zz장구</h1>
      <p>왼쪽은 북편 · 오른쪽은 채편</p>
    </div>

    <section class="janggu-wrap" aria-label="장구">
      <div class="body-strap" aria-hidden="true"></div>
      <div class="rope" style="left:28%" aria-hidden="true"></div>
      <div class="rope" style="left:39%" aria-hidden="true"></div>
      <div class="rope" style="left:50%" aria-hidden="true"></div>
      <div class="rope" style="left:61%" aria-hidden="true"></div>
      <div class="rope" style="left:72%" aria-hidden="true"></div>

      <button class="face left" data-sound="buk" aria-label="북편">
        <span class="face-label">북편</span>
      </button>
      <button class="face right subtle-right" data-sound="chae" aria-label="채편">
        <span class="face-label">채편</span>
      </button>
    </section>

    <div class="hint">태블릿에서 양쪽 면을 터치해 소리를 들어보세요.</div>

    <footer class="footer">Made by Chatrue</footer>
  </main>
`;

let audioContext;

function getAudioContext() {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioContext = new Ctx();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function createEnvelope(ctx, destination, now, attack, decay, peak, endGain = 0.0001) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(endGain, now + attack + decay);
  gain.connect(destination);
  return gain;
}

function playBuk() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.value = 0.95;
  master.connect(ctx.destination);

  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(118, now);
  osc1.frequency.exponentialRampToValueAtTime(76, now + 0.16);

  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(176, now);
  osc2.frequency.exponentialRampToValueAtTime(102, now + 0.14);

  const lowEnv = createEnvelope(ctx, master, now, 0.003, 0.44, 0.6);
  const midEnv = createEnvelope(ctx, master, now, 0.002, 0.26, 0.22);

  osc1.connect(lowEnv);
  osc2.connect(midEnv);

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 780;
  const noiseEnv = createEnvelope(ctx, master, now, 0.001, 0.05, 0.14);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseEnv);

  osc1.start(now);
  osc2.start(now);
  noise.start(now);

  osc1.stop(now + 0.5);
  osc2.stop(now + 0.4);
  noise.stop(now + 0.07);
}

function playChae() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(820, now);
  osc1.frequency.exponentialRampToValueAtTime(520, now + 0.06);

  const osc2 = ctx.createOscillator();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(1460, now);
  osc2.frequency.exponentialRampToValueAtTime(860, now + 0.04);

  const env1 = createEnvelope(ctx, master, now, 0.001, 0.09, 0.18);
  const env2 = createEnvelope(ctx, master, now, 0.001, 0.04, 0.08);

  osc1.connect(env1);
  osc2.connect(env2);

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.035, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length * 0.85);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1800;
  bandpass.Q.value = 0.7;
  const noiseEnv = createEnvelope(ctx, master, now, 0.001, 0.03, 0.18);
  noise.connect(bandpass);
  bandpass.connect(noiseEnv);

  osc1.start(now);
  osc2.start(now);
  noise.start(now);

  osc1.stop(now + 0.12);
  osc2.stop(now + 0.08);
  noise.stop(now + 0.04);
}

function activate(button) {
  button.classList.add('active');
  window.clearTimeout(button._timer);
  button._timer = window.setTimeout(() => button.classList.remove('active'), 90);
}

function hit(button) {
  const sound = button.dataset.sound;
  activate(button);
  if (sound === 'buk') playBuk();
  if (sound === 'chae') playChae();
}

const buttons = [...document.querySelectorAll('.face')];
buttons.forEach((button) => {
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    hit(button);
  });
});

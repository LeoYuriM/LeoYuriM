"""Gera efeitos sonoros sinteticos (whoosh, pop, impact...) em public/sfx."""
import numpy as np, wave, os
from scipy.signal import butter, sosfilt

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)


def save(name, x, gain=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def t(d):
    return np.arange(int(SR * d)) / SR


def sweep_noise(d, f0, f1, peak=0.5, q=1.5):
    """Ruido filtrado com banda que varre de f0 a f1 (efeito whoosh)."""
    n = rng.standard_normal(int(SR * d))
    out = np.zeros_like(n); blk = 256
    freqs = np.geomspace(f0, f1, len(n) // blk + 1)
    zi = None
    for i in range(0, len(n), blk):
        f = freqs[i // blk]
        sos = butter(2, [max(30, f / q), min(SR / 2 - 100, f * q)], "bandpass", fs=SR, output="sos")
        out[i:i + blk] = sosfilt(sos, n[i:i + blk])
    x = t(d) / d
    env = np.where(x < peak, (x / peak) ** 2, ((1 - x) / (1 - peak)) ** 1.6)
    return out * env


save("whoosh", sweep_noise(0.45, 300, 4500, 0.55) + 0.6 * sweep_noise(0.45, 150, 1200, 0.6), 0.8)
save("whoosh_fast", sweep_noise(0.25, 600, 7000, 0.45), 0.8)
save("swoosh_down", sweep_noise(0.4, 5000, 400, 0.35), 0.75)

tt = t(0.12)
save("pop", np.sin(2 * np.pi * (500 + 900 * np.exp(-tt * 40)) * tt) * np.exp(-tt * 38), 0.7)

tt = t(0.05)
save("click", rng.standard_normal(len(tt)) * np.exp(-tt * 180) + np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 120), 0.5)

tt = t(0.9)
boom = np.sin(2 * np.pi * (45 + 90 * np.exp(-tt * 12)) * tt) * np.exp(-tt * 4.5)
crack = sosfilt(butter(2, 2500, "low", fs=SR, output="sos"), rng.standard_normal(len(tt))) * np.exp(-tt * 25)
save("impact", boom + 0.6 * crack, 0.95)

tt = t(0.9)
ding = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, a, k in [(1760, 1, 5), (2637, .5, 7), (3520, .25, 9)])
save("ding", ding * np.minimum(1, tt * 400), 0.55)

tt = t(1.3)
riser = sweep_noise(1.3, 200, 9000, 0.95, 1.3) + 0.3 * np.sin(2 * np.pi * (200 + 600 * (tt / 1.3) ** 2) * tt) * (tt / 1.3)
save("riser", riser, 0.6)

tt = t(0.22)
g = np.sign(np.sin(2 * np.pi * 90 * tt)) * (rng.random(len(tt)) > 0.5)
g = g * np.repeat(rng.random(len(tt) // 400 + 1) > 0.4, 400)[:len(tt)]
save("glitch", g * np.exp(-tt * 6), 0.4)

tt = t(0.35)
save("shutter", (rng.standard_normal(len(tt)) * (np.exp(-tt * 70) + 0.7 * np.exp(-np.maximum(0, tt - 0.08) * 60) * (tt > 0.08))), 0.55)
print(sorted(os.listdir(OUT)))

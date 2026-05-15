Hero background video
=====================

Current asset: `nyc.mp4` (H.264 MP4). Referenced from `Hero.tsx`.

Optional additions:

  - WebM copy (smaller): add `*.webm` and a `<source type="video/webm" />` before MP4.
  - Poster still: e.g. `../images/hero-nyc-poster.jpg`; add `poster` on the `<video>` for faster first paint.

If the video fails to load, the hero keeps the gradient-only fallback.

(() => {
  const videos = document.querySelectorAll('.research-media video');
  if (!videos.length) return;

  // Auto-playing motion is opt-out for people who ask for reduced motion.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const play = video => {
    if (video.preload === 'none') video.preload = 'auto';
    // Rejects when the browser still wants a gesture; controls remain as the fallback.
    video.play?.()?.catch(() => {});
  };

  // Only fetch a clip once it is actually on screen: the four clips total ~26 MB.
  if (!('IntersectionObserver' in window)) {
    videos.forEach(play);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target: video, isIntersecting }) => {
      if (isIntersecting) {
        if (video.dataset.userPaused !== 'true') play(video);
      } else if (!video.paused) {
        video.dataset.autoPaused = 'true';
        video.pause();
      }
    });
  }, { threshold: 0.25 });

  videos.forEach(video => {
    // Set the property too: the attribute alone is not always honoured on restore.
    video.muted = true;
    // A pause we did not trigger is the viewer's, so leave that clip alone from then on.
    video.addEventListener('pause', () => {
      if (video.dataset.autoPaused === 'true') delete video.dataset.autoPaused;
      else video.dataset.userPaused = 'true';
    });
    video.addEventListener('play', () => delete video.dataset.userPaused);
    observer.observe(video);
  });
})();

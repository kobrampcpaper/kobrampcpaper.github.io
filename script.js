const PLAYBACK_RATE = 2;
const SEEK_MAX = 1000;

const videos = document.querySelectorAll('video.fast-video');

videos.forEach((video) => {
  const applyRate = () => { video.playbackRate = PLAYBACK_RATE; };
  applyRate();
  video.addEventListener('loadedmetadata', applyRate);
  video.addEventListener('play', applyRate);
  video.addEventListener('ratechange', () => {
    if (video.playbackRate !== PLAYBACK_RATE) applyRate();
  });
});

document.querySelectorAll('.video-card').forEach((card) => {
  const video = card.querySelector('video');
  const playPauseBtn = card.querySelector('.ctrl-play-pause');
  const restartBtn = card.querySelector('.ctrl-restart');
  const seek = card.querySelector('.ctrl-seek');
  let seeking = false;

  const syncIcon = () => {
    playPauseBtn.innerHTML = video.paused ? '&#9654;' : '&#10074;&#10074;';
  };

  playPauseBtn.addEventListener('click', () => {
    if (video.paused) video.play(); else video.pause();
  });

  restartBtn.addEventListener('click', () => {
    video.currentTime = 0;
    video.play();
  });

  video.addEventListener('play', syncIcon);
  video.addEventListener('pause', syncIcon);
  syncIcon();

  video.addEventListener('timeupdate', () => {
    if (seeking || !video.duration) return;
    seek.value = String((video.currentTime / video.duration) * SEEK_MAX);
  });

  seek.addEventListener('input', () => {
    if (!video.duration) return;
    seeking = true;
    video.currentTime = (Number(seek.value) / SEEK_MAX) * video.duration;
  });

  seek.addEventListener('change', () => { seeking = false; });
});

document.querySelectorAll('.traj-group').forEach((group) => {
  const btn = group.querySelector('.play-traj-btn');
  const row = document.getElementById(btn.dataset.target);
  const rowVideos = row.querySelectorAll('video');
  const iconEl = btn.querySelector('.play-icon');
  const labelNode = iconEl.nextSibling;

  const resetToPlayAll = () => {
    iconEl.innerHTML = '&#9654;';
    labelNode.textContent = ' Play All';
    btn.classList.remove('is-playing');
  };

  btn.addEventListener('click', () => {
    if (btn.classList.contains('is-playing')) {
      rowVideos.forEach((v) => v.pause());
      resetToPlayAll();
      return;
    }
    rowVideos.forEach((v) => {
      v.currentTime = 0;
      v.play();
    });
    iconEl.innerHTML = '&#10074;&#10074;';
    labelNode.textContent = ' Pause All';
    btn.classList.add('is-playing');
  });

  row.querySelectorAll('.video-wrap').forEach((wrap) => {
    wrap.addEventListener('mouseenter', resetToPlayAll);
  });

  resetToPlayAll();
});

const DEFAULT_VIDEO_ID = "Eq7_v0VgUVA";

let player = null;
let playerReady = false;
let pendingVideoId = null;
let pendingTitle = null;
let pendingSubtitle = null;
let progressTimer = null;

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const titleEl = document.querySelector(".track-title");
const artistEl = document.querySelector(".track-artist");
const progressEl = document.querySelector(".progress-track span");
const durationEl = document.querySelector(".duration");

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function updateProgress() {
  if (!player || !playerReady) return;

  const current = player.getCurrentTime() || 0;
  const total = player.getDuration() || 0;

  if (progressEl && total > 0) {
    progressEl.style.width = `${Math.min(100, (current / total) * 100)}%`;
  }

  if (durationEl && total > 0) {
    durationEl.textContent = `${formatTime(current)} / ${formatTime(total)}`;
  }

  if (playBtn) {
    playBtn.textContent =
      player.getPlayerState() === YT.PlayerState.PLAYING ? "Ⅱ" : "▶";
  }
}

function updateTrackInfoFromYouTube() {
  if (!player || !playerReady) return;
  const data = player.getVideoData();
  if (data && data.title && titleEl) titleEl.textContent = data.title;
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    width: "1",
    height: "1",
    videoId: DEFAULT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      playsinline: 1,
      modestbranding: 1
    },
    events: {
      onReady: function () {
        playerReady = true;
        if (titleEl) titleEl.textContent = "Arijit Singh • Essentials";
        if (artistEl) artistEl.textContent = "The best of Arijit Singh";

        player.cueVideoById(DEFAULT_VIDEO_ID);

        clearInterval(progressTimer);
        progressTimer = setInterval(updateProgress, 500);
        updateProgress();

        if (pendingVideoId) {
          const videoId = pendingVideoId;
          const title = pendingTitle;
          const subtitle = pendingSubtitle;
          pendingVideoId = pendingTitle = pendingSubtitle = null;
          startYouTubeVideo(videoId, title, subtitle);
        }
      },

      onStateChange: function () {
        updateTrackInfoFromYouTube();
        updateProgress();
      },

      onError: function (event) {
        console.error("YouTube player error:", event.data);
        if (pendingVideoId) {
          const id = pendingVideoId;
          pendingVideoId = pendingTitle = pendingSubtitle = null;
          window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`, "_blank", "noopener");
        }
      }
    }
  });
}

function startYouTubeVideo(videoId, title, subtitle) {
  if (!videoId) return;

  if (titleEl && title) titleEl.textContent = title;
  if (artistEl && subtitle) artistEl.textContent = subtitle;
  if (progressEl) progressEl.style.width = "0%";
  if (durationEl) durationEl.textContent = "0:00";

  if (!playerReady || !player) {
    pendingVideoId = videoId;
    pendingTitle = title;
    pendingSubtitle = subtitle;
    return;
  }

  player.unMute();
  player.loadVideoById(videoId);
  player.playVideo();
}

document.querySelectorAll(".playlist-item").forEach((button) => {
  button.addEventListener("click", function () {
    const videoId = this.dataset.playlist || DEFAULT_VIDEO_ID;
    const title = this.dataset.title || "Arijit Singh • Essentials";
    const subtitle = this.dataset.subtitle || "The best of Arijit Singh";

    document.querySelectorAll(".playlist-item").forEach((item) => item.classList.remove("active"));
    this.classList.add("active");

    startYouTubeVideo(videoId, title, subtitle);
  });
});

if (playBtn) {
  playBtn.addEventListener("click", function () {
    if (!playerReady || !player) {
      pendingVideoId = DEFAULT_VIDEO_ID;
      pendingTitle = "Arijit Singh • Essentials";
      pendingSubtitle = "The best of Arijit Singh";
      return;
    }

    const state = player.getPlayerState();

    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED) {
      player.unMute();
      player.playVideo();
    } else {
      startYouTubeVideo(DEFAULT_VIDEO_ID, "Arijit Singh • Essentials", "The best of Arijit Singh");
    }
  });
}

if (prevBtn) prevBtn.addEventListener("click", () => {
  if (playerReady && player) player.seekTo(0, true);
});

if (nextBtn) nextBtn.addEventListener("click", () => {
  if (playerReady && player) player.seekTo(0, true);
});

function updateDateTime() {
  const dateEl = document.getElementById("live-date");
  const timeEl = document.getElementById("live-time");
  if (!dateEl && !timeEl) return;

  const now = new Date();

  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
}

updateDateTime();
setInterval(updateDateTime, 1000);

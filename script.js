// Use the browser API if available (Chrome or Firefox)
const brws = typeof browser !== 'undefined' ? browser : chrome;

/**
 * Mimic asynchronous retrieval of options (for instance, a track database)
 * If running in a Chrome extension, this will use chrome.storage.local;
 * otherwise, you might fall back to localStorage or a hardcoded default.
 */
async function getOptions() {
  return new Promise((resolve) => {
    if (brws && brws.storage && brws.storage.local) {
      // Retrieve options from extension storage
      brws.storage.local.get('options').then((result) => {
        resolve(result.options || {}); // Options may include a custom playlist
      }).catch(() => {
        resolve({});
      });
    } else {
      // Fallback: use localStorage or default options
      let opts = localStorage.getItem('options');
      resolve(opts ? JSON.parse(opts) : {});
    }
  });
}

/* --- Audio Player Code --- */

// Default playlist – can be overridden by options
let playlist = [
  { src: 'track1.mp3', title: 'LoFi Beat 1' },
  { src: 'track2.mp3', title: 'LoFi Beat 2' },
  { src: 'track3.mp3', title: 'LoFi Beat 3' }
];
let currentTrackIndex = 0;

const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');
const prevBtn = document.getElementById('prevBtn');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextBtn = document.getElementById('nextBtn');

// Load a given track into the audio player
function loadTrack(index) {
  const track = playlist[index];
  audioSource.src = track.src;
  audioPlayer.load();
  // Optionally update UI with track.title
}

// Player Controls
playPauseBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});
nextBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  audioPlayer.play();
});
prevBtn.addEventListener('click', () => {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  audioPlayer.play();
});
audioPlayer.addEventListener('ended', () => {
  // Auto play next track when current one ends
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  audioPlayer.play();
});

/* --- Initialization --- */

// Retrieve options (which might include a custom playlist) and initialize the player.
(async function init() {
  const options = await getOptions();
  if (options.playlist && Array.isArray(options.playlist) && options.playlist.length) {
    // Replace default playlist if provided in options.
    playlist = options.playlist;
  }
  loadTrack(currentTrackIndex);
})();

/* --- (Optional) Custom Event Listeners --- */

// For example, you might want to listen for custom events similar to your extension code.
// Here’s how you could listen for a custom event that might update the playlist.
document.addEventListener('ff53054c0e13_updatePlaylist', (event) => {
  const newPlaylist = event.detail;
  if (Array.isArray(newPlaylist) && newPlaylist.length) {
    playlist = newPlaylist;
    currentTrackIndex = 0;
    loadTrack(currentTrackIndex);
    console.log('Playlist updated via custom event.');
  }
});

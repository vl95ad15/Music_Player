/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prefer-const */

let player = document.querySelector(".player");
let currTrack = document.createElement("audio");

let trackArt = document.querySelector(".track-art");
let trackName = document.querySelector(".track-name");
let trackArtist = document.querySelector(".track-artist");

let playpauseBtn = document.querySelector(".playpause-track");
let nextBtn = document.querySelector(".next-track");
let prevBtn = document.querySelector(".prev-track");
let repeatBtn = document.querySelector(".repeat-track");
let shuffleBtn = document.querySelector(".shuffle");

let seekSlider = document.querySelector(".seek_slider");
let volumeSlider = document.querySelector(".volume_slider");
let currTime = document.querySelector(".current-time");
let totalDuration = document.querySelector(".total-duration");

let list = document.querySelector(".list");
let toggleSongList = document.querySelector(".toggle-list");

let trackIndex = 0;
let isPlaying = false;
let updateTimer;

const trackList = [{
    name: "Maito",
    artist: "Smarnav",
    image: "https://avatars.yandex.net/get-music-content/108289/f5621048.a.7522327-1/m1000x1000",
    path: "https://vl95ad15.github.io/Music_Player/music/Smarnav_Maito.mp3",
  },
  {
    name: "Light of Eternity",
    artist: "Domitori Taranofu",
    image: "https://sun9-18.userapi.com/d-JINWMY2QBkmzoQ7wA20hlzQL-fAj2_zc29iA/eXZBU3cqTD8.jpg",
    path: "https://vl95ad15.github.io/Music_Player/music/Domitori_Taranofu_Light_of_Eternity.mp3",
  },
  {
    name: "Wood",
    artist: "Dan Henig",
    image: "https://i.ytimg.com/vi/jQtViazW_mM/maxresdefault.jpg",
    path: "https://vl95ad15.github.io/Music_Player/music/Dan_Henig_Wood.mp3",
  },
  {
    name: "Omega",
    artist: "Scott Buckley",
    image: "https://www.scottbuckley.com.au/library/wp-content/uploads/2019/08/Omega-wide-01.jpg",
    path: "https://vl95ad15.github.io/Music_Player/music/Scott_Buckley_Omega.mp3",
  },
  {
    name: "Ruska",
    artist: "Kupla",
    image: "https://chillhop.com/wp-content/uploads/2018/12/Bandcamp-Background-only-winter2018.jpg",
    path: "https://vl95ad15.github.io/Music_Player/music/Kupla_Ruska.mp3",
  },
  {
    name: "Lost Love",
    artist: "Toonorth",
    image: "https://i.ytimg.com/vi/gOJ5jH5InsQ/maxresdefault.jpg",
    path: "https://vl95ad15.github.io/Music_Player/music/Toonorth_Lost Love.mp3",
  },
];

function resetValues() {
  currTime.textContent = "00:00";
  totalDuration.textContent = "00:00";
  seekSlider.value = 0;
}

shuffleBtn.addEventListener("click", function shuffleTrack() {
  let currentIndex = trackList.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = trackList[currentIndex];
    trackList[currentIndex] = trackList[randomIndex];
    trackList[randomIndex] = temporaryValue;
  }
  shuffleBtn.classList.add("shuffle-enabled");
  return trackList;
});

repeatBtn.onclick = function() {
  currTrack.loop = true;
  repeatBtn.style.color = "aqua";
  repeatBtn.classList.add("loop-enabled");
}

function seekUpdate() {
  let seekPosition = 0;

  if (!Number.isNaN(currTrack.duration)) {
    seekPosition = currTrack.currentTime * (100 / currTrack.duration);
    seekSlider.value = seekPosition;

    let currentMinutes = Math.floor(currTrack.currentTime / 60);
    let currentSeconds = Math.floor(
      currTrack.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(currTrack.duration / 60);
    let durationSeconds = Math.floor(currTrack.duration - durationMinutes * 60);

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    currTime.textContent = currentMinutes + ":" + currentSeconds;
    totalDuration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

function loadTrack(trackIndex) {
  clearInterval(updateTimer);
  resetValues();

  currTrack.src = trackList[trackIndex].path;
  currTrack.load();

  trackArt.style.backgroundImage = "url(" + trackList[trackIndex].image + ")";
  document.body.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), 
    url("${trackList[trackIndex].image}") center fixed no-repeat`;
  document.body.style.backgroundSize = "cover";
  trackName.textContent = trackList[trackIndex].name;
  trackArtist.textContent = trackList[trackIndex].artist;

  updateTimer = setInterval(seekUpdate, 1000);

  currTrack.addEventListener("ended", nextBtn.onclick);
}

function playTrack() {
  currTrack.play();
  isPlaying = true;

  playpauseBtn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  currTrack.pause();
  isPlaying = false;

  playpauseBtn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

playpauseBtn.onclick = function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
};

nextBtn.onclick = function nextTrack() {
  if (trackIndex < trackList.length - 1) trackIndex += 1;
  else trackIndex = 0;

  loadTrack(trackIndex);
  playTrack();
};

prevBtn.onclick = function prevTrack() {
  if (trackIndex > 0) trackIndex -= 1;
  else trackIndex = trackList.length;

  loadTrack(trackIndex);
  playTrack();
};

seekSlider.onchange = function seekTo() {
  let seekto = currTrack.duration * (seekSlider.value / 100);

  currTrack.currentTime = seekto;
};

volumeSlider.onchange = function setVolume() {
  currTrack.volume = volumeSlider.value / 100;
};

toggleSongList.addEventListener("click", function () {
  toggleSongList.classList.toggle("active");
  player.classList.toggle("activeSongList");
});

list.innerHTML = trackList
  .map(function (track, trackIndex) {
    return `
    <div class="item" songIndex="${trackIndex}">
    <div class="info">
      <div class="cover">
				<img src="${track.image}">
			</div>
			<div class="details-list">
				<p class="track-list-name">${track.name}<p>
				<p class="track-list-artist">${track.artist}</p>
      </div>
      </div>
      <div class="is-playing-now">
        <i class="fa fa-volume-up"></i>
      </div>
		</div>
	`;
  })
  .join("");

  // let isPlayingNow = document.querySelector(".is-playing-now");

  // if (!Audio.paused) {
  //   isPlayingNow.style.display = "block";
  // }

let trackListItems = document.querySelectorAll(".item");
for (let i = 0; i < trackListItems.length; i += 1) {
  trackListItems[i].addEventListener("click", function () {
    trackIndex = parseInt(trackListItems[i].getAttribute("songIndex"));
    loadTrack(trackIndex);
    playTrack();
    player.classList.remove("activeSongList");
    toggleSongList.classList.remove("active");
  });
};

loadTrack(trackIndex);

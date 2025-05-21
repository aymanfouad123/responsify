console.log("Testing script");

let currentSong = new Audio()
currentSong.volume = 0.2
let currentSongFilename = null; 
let currentSongText = null; 
let songs = []; 

async function getSongs(){
    let a =  await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

function getCurrentSongIndex(){
    return songs.indexOf(currentSongFilename);
}

function playSongAtIndex(index) {
    if (index >= 0 && index < songs.length) {
        currentSongFilename = songs[index];
        // Find the corresponding song card to get the display name
        const songCards = document.querySelectorAll('.songlist li');
        if (songCards[index]) {
            currentSongText = songCards[index].getAttribute('data-textname');
        } else {
            currentSongText = '';
        }
        playMusic(currentSongFilename);
    }
}

function setupMobileMenu() {
    // Get our elements
    const hamburger = document.querySelector('.header .hamburger-menu');
    const closeButton = document.querySelector('.left .close-button');
    const leftMenu = document.querySelector('.left');
    const body = document.body;

    // Create overlay element if it doesn't exist
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        body.appendChild(overlay);
    }

    function toggleMenu() {
        leftMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = leftMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Open menu with hamburger button
    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    
    // Close menu with X button
    if (closeButton) closeButton.addEventListener('click', toggleMenu);
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', toggleMenu);

    // Close menu when resizing to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && leftMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}


function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const playMusic = (track) => {
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play.src = "images/pause.svg";
    document.querySelector(".barsonginfo").innerHTML = currentSongText;
}

async function main(){
    songs = await getSongs()
    setupMobileMenu();
    const songImageMap = {
        "Trippie Redd  Weeeeee (Official Music Video).mp3": "weeetrippie.jpeg",
        "The Weeknd  Timeless with Playboi Carti (Official Music Video).mp3": "timeless.jpeg"
      };

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        let [artist, songWithExt] = song.replaceAll("%20", " ").split("  ");
        let songName = songWithExt ? songWithExt.replace(".mp3", "") : "";

        // Get the image filename from the map
        let imageFile = songImageMap[song.replaceAll("%20", " ")] || "images/home.svg"; // fallback to home.svg


        songUl.innerHTML = songUl.innerHTML + `
        <li class="song-card" data-textname="${songName}" data-filename="${song}">
            <div class="song-img-container">
                <img class="song-img" src="images/${imageFile}" alt="Song Cover">
                <div class="play-overlay">
                    <img src="images/play.svg" alt="Play">
                </div>
            </div>
            <div class="song-info">
                <div class="song-title">${songName}</div>
                <div class="song-artist">${artist}</div>
            </div>
        </li>
    `;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e => {
            const filename = element.getAttribute("data-filename");
            currentSongFilename = filename;
            currentSongText = element.getAttribute("data-textname");
            playMusic(filename)
        })
    });

    play.addEventListener("click", ()=>{
        if (!currentSongFilename) {
            // No song selected yet, play the first song
            if (songs.length > 0) {
                currentSongFilename = songs[0];
                const firstSongCard = document.querySelector(".songlist li");
                if (firstSongCard) {
                    currentSongText = firstSongCard.getAttribute("data-textname");
                } else {
                    currentSongText = ""; // fallback
                }
                playMusic(currentSongFilename);
            }
        } else if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

        let barlength = (currentSong.currentTime/currentSong.duration)*100;
        document.querySelector(".seekbar-progress").style.width = barlength + "%";
        document.querySelector(".circle").style.left = barlength + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        // Always get the seekbar element, not whatever was clicked
        const seekbar = document.querySelector(".seekbar");
        const rect = seekbar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        
        // Add error checking for audio duration
        if (currentSong.duration) {
            const newTime = percent * currentSong.duration;
            currentSong.currentTime = newTime;
        
            // Manually update UI for instant feedback
            document.querySelector(".seekbar-progress").style.width = (percent * 100) + "%";
            document.querySelector(".circle").style.left = (percent * 100) + "%";
        }
    });

    document.getElementById('previous').addEventListener('click', () => {
        let idx = getCurrentSongIndex();
        console.log(idx);
        if (idx > 0) {
            playSongAtIndex(idx - 1);
        }
        else {
            // If at the first song, go to the last
            playSongAtIndex(songs.length - 1);
        }
    });
    
    document.getElementById('next').addEventListener('click', () => {
        let idx = getCurrentSongIndex();
        if (idx < songs.length - 1) {
            playSongAtIndex(idx + 1);
        } else {
            // If at the last song (or idx is -1), go to the first
            playSongAtIndex(0);
        }
    });
}

main()
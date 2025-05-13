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
    let songs = await getSongs()

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
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        let barlength = (currentSong.currentTime/currentSong.duration)*100;
        document.querySelector(".seekbar-progress").style.width = barlength + "%";
        document.querySelector(".circle").style.left = barlength + "%";
    })

    let isSeeking = false;

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100;
        document.querySelector(".seekbar-progress").style.width = percent + "%";
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration)*percent / 100
    })
}

main()
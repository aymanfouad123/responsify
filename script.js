console.log("Testing script");

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

async function main(){
    let songs = await getSongs()
    console.log(songs)

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
        <li>
            <img class="invert" src="images/${imageFile}" alt="">
            <div class="info">
                <div>${songName}</div>
                <div>${artist}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="images/play.svg" alt="">
            </div>
        </li>
    `;
    }

    const playBtn = document.querySelector('.playbut');
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            var audio = new Audio(songs[0]);
            audio.play();
        });
    } else {
        console.error("Play button image not found!");
    }
}

main()
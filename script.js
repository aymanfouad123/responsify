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
        <li class="song-card">
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

}

main()
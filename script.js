/* =========================================================
   BIRTHDAY FLOWER PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;

  const intro = document.getElementById("intro");
  const startButton = document.getElementById("startButton");

  const music = document.getElementById("birthdayMusic");
  const musicControl = document.getElementById("musicControl");

  const musicIcon =
    musicControl.querySelector(".music-icon");


  /* =======================================================
     MUSIC START POSITION

     2 minutes 10 seconds = 130 seconds
  ======================================================= */

  const MUSIC_START_TIME = 130;


  /* =======================================================
     MUSIC UI
  ======================================================= */

  function setMusicPlayingUI(isPlaying) {

    if (isPlaying) {

      musicControl.classList.add("playing");

      musicIcon.textContent = "♫";

      musicControl.setAttribute(
        "aria-label",
        "Pause music"
      );

      musicControl.setAttribute(
        "title",
        "Pause music"
      );

    } else {

      musicControl.classList.remove("playing");

      musicIcon.textContent = "♪";

      musicControl.setAttribute(
        "aria-label",
        "Play music"
      );

      musicControl.setAttribute(
        "title",
        "Play music"
      );
    }
  }


  /* =======================================================
     START MUSIC FROM 2:10

     The click on "Open Your Surprise" counts as a user
     interaction, so browsers will normally allow audio.
  ======================================================= */

  async function startMusic() {

    try {

      /*
       * Set the position before playing.
       * readyState >= 1 means metadata is available.
       */

      if (music.readyState >= 1) {

        if (
          Number.isFinite(music.duration) &&
          music.duration > MUSIC_START_TIME
        ) {
          music.currentTime = MUSIC_START_TIME;
        }

      } else {

        music.addEventListener(
          "loadedmetadata",
          () => {

            if (
              Number.isFinite(music.duration) &&
              music.duration > MUSIC_START_TIME
            ) {
              music.currentTime = MUSIC_START_TIME;
            }

          },
          { once: true }
        );
      }

      await music.play();

      setMusicPlayingUI(true);

    } catch (error) {

      /*
       * If autoplay is blocked for any reason,
       * the music button remains available.
       */

      console.warn(
        "Music could not start automatically:",
        error
      );

      setMusicPlayingUI(false);
    }
  }


  /* =======================================================
     OPEN SURPRISE
  ======================================================= */

  startButton.addEventListener("click", async () => {

    body.classList.add("started");

    intro.classList.add("hide");

    await startMusic();

  });


  /* =======================================================
     MUSIC BUTTON
  ======================================================= */

  musicControl.addEventListener("click", async () => {

    if (music.paused) {

      /*
       * If the song has never started, begin at 2:10.
       */

      if (
        music.currentTime === 0 ||
        !Number.isFinite(music.currentTime)
      ) {

        if (
          Number.isFinite(music.duration) &&
          music.duration > MUSIC_START_TIME
        ) {
          music.currentTime = MUSIC_START_TIME;
        }
      }

      try {

        await music.play();

        setMusicPlayingUI(true);

      } catch (error) {

        console.warn(
          "Music could not be played:",
          error
        );

      }

    } else {

      music.pause();

      setMusicPlayingUI(false);
    }

  });


  /* =======================================================
     KEEP UI IN SYNC
  ======================================================= */

  music.addEventListener("play", () => {
    setMusicPlayingUI(true);
  });

  music.addEventListener("pause", () => {
    setMusicPlayingUI(false);
  });


  /* =======================================================
     AUDIO ERROR
  ======================================================= */

  music.addEventListener("error", () => {

    console.warn(
      "Could not load ./music/birthday.mp3"
    );

    setMusicPlayingUI(false);

  });


  /* =======================================================
     SAFETY:
     If the audio metadata loads after the page opens,
     don't start it automatically. It starts when the
     surprise button is clicked.
  ======================================================= */

  music.load();

});

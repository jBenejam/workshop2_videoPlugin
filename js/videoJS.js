var vid, seekSlider, seekTime, playPause, stop, fullScreen1, volumeSlider, mute, playRate;
$(document).ready(function () {
    /* var KeyMap = {
     FULL_SCREEN: 46
     }*/

    vid = $("#video").get(0);
    playPause = $("#PlayPauseButton").get(0);
    seekSlider = $("#seekBar").get(0);
    seekTime = $("#numberSeek").get(0);
    stop = $("#stopButton").get(0);
    fullScreen1 = $("#fullScreenButton").get(0);
    volumeSlider = $("#volumeBar").get(0);
    mute = $("#muteButton").get(0);
    playRate = $("#playRateList").get(0);
    var flag = true;

    /* $(document).keydown(function (event) {
     switch (event.keyCode) {
     case KeyMap.FULL_SCREEN:
     http://www.intheloftstudios.com/blog/detecting-html5-video-fullscreen-and-events
     var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

     if ( flag== true) {
     fFullScreen();
     vid.controls = true;
     flag = false;
     } else {
     vid.controls = false;
     flag = true;
     }

     break;
     }
     });*/

    function fPlayPause() {
        if (vid.paused) {
            vid.play();
            playPause.className = "btn btn-default  btn-sm glyphicon glyphicon-pause";
        } else {
            vid.pause();
            playPause.className = "btn btn-default  btn-sm glyphicon glyphicon-play";

        }
    }

    function TimeBar() {
        vid.currentTime = vid.duration * (seekSlider.value / 100);
    }

    function TimeBarMouseDown() {
        playPause.className = "btn btn-default  btn-sm glyphicon glyphicon-play";
        vid.pause();
    }

    function TimeBarMouseUp() {
        playPause.className = "btn btn-default  btn-sm glyphicon glyphicon-pause";
        vid.play();
    }

    function fMute() {
        if (vid.muted) {
            vid.muted = false;
            mute.className = "btn btn-default  btn-sm glyphicon glyphicon-volume-up";
            volumeSlider.value = vid.volume * 100;
        } else {
            vid.muted = true;
            mute.className = "btn btn-default  btn-sm glyphicon glyphicon-volume-off";
            volumeSlider.value = 0;

        }
    }

    function volume() {
        vid.volume = volumeSlider.value / 100;
        if (vid.volume === 0) {
            mute.className = "btn btn-default  btn-sm glyphicon glyphicon-volume-off";
        }
        else {
            mute.className = "btn btn-default  btn-sm glyphicon glyphicon-volume-up";
        }
    }

    function fFullScreen() {
        if (vid.requestFullscreen) {
            vid.requestFullscreen();
        } else if (vid.mozRequestFullScreen) {
            vid.mozRequestFullScreen();
        } else if (vid.webkitRequestFullScreen) {
            vid.webkitRequestFullScreen();
        } else if (vid.msRequestFullscreen) {
            vid.msRequestFullscreen();
        }
    }

    function fStop() {
        vid.currentTime = 0;
        vid.pause();
    }

    function fPlayRate() {
        vid.playbackRate = playRate.value;
    }

    function TimeVideo() {
        seekSlider.value = vid.currentTime * (100 / vid.duration);
        var mins = Math.floor(vid.currentTime / 60);
        var secs = Math.floor(vid.currentTime - mins * 60);
        if (secs < 10) {
            secs = "0" + secs;
        }
        if (mins < 10) {
            mins = "0" + mins;
        }
        seekTime.innerHTML = mins + ":" + secs;
    }

    $("#PlayPauseButton").click(function () {
        fPlayPause();
    });

    $("#seekBar").change(function () { /*mousedown*/
        TimeBar();
    });

    $("#seekBar").mousedown(function () {
        TimeBarMouseDown();
    });

    $("#seekBar").mouseup(function () {
        TimeBarMouseUp();
    });
    $("#video").on("timeupdate", function () {
        TimeVideo();
    });

    $("#muteButton").click(function () {
        fMute();
    });

    $("#volumeBar").on("input", function () {
        volume();
    });

    $("#fullScreenButton").click(function () {
        fFullScreen();
    });

    $("#stopButton").click(function () {
        fStop();
    });

    $("#playRateList").change(function () {
        fPlayRate();
    });


    /*-----FullScreen controls-------*/
    /* var myVar = setInterval(myTimer, 1000);
     function myTimer() {
     if (!document.mozFullScreen){
     vid.controls = false;
     }
     }

     $(document).keydown(function(event){
     if (event.keyCode==27){
     console.log(event.keyCode);
     vid.controls = false;
     }
     });

     document.addEventListener("fullscreenChange", function () {
     if (document.fullscreenElement != null) {
     vid.controls = false;
     }
     });*/
    /*------------*/
});

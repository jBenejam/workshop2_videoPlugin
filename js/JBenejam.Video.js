(function($){
    if(!$.JBenejam){
        $.JBenejam = new Object();
    };
    /*String.prototype.format = function () {
        var args = arguments;
        return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (curlyBrack, index) {
            return ((curlyBrack == "{{") ? "{" : ((curlyBrack == "}}") ? "}" : args[index]));
        });
    };
    base.format = function (txt,args){
        return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (curlyBrack, index) {
            return ((curlyBrack == "{{") ? "{" : ((curlyBrack == "}}") ? "}" : args[index]));
        });
    };*/

    $.JBenejam.Video = function(el, getData, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("jBenejam.video", base);
        base.init = function(){
            base.getData = getData;
            base.options = $.extend({},$.JBenejam.Video.defaultOptions, options);
            base.htmlTags = $.extend({},$.JBenejam.Video.htmlTags/*, options["htmlTags"]*/);
            // Put your initialization code here
            base.render();
            base.addEvents();
        };
        /**
         * remplace {} for correct value
         * @param str
         * @param col
         * @returns {XML|string|void}
         */
         base.format = function (str, col) {
             col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);
             return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
                 if (m == "{{") {
                     return "{";
                 }
                 if (m == "}}") {
                     return "}";
                 }
                 return col[n];
             });
         };

        /**
         * Creates html output with values and method format
         * @param paramaters
         */
         base.render = function(paramaters){
             //var video="";

             var outputVideo= base.format(base.htmlTags.videoTag,{
                 poster:base.options.poster,
                 src: base.options.src,
                 type: base.options.type,
                 msg: base.options.msg
             });
             var outputButtons= base.format(base.htmlTags.buttonsTag,{
                 space:base.options.NameKeyMap.space,
                 Trow: base.options.NameKeyMap.Trow,
                 Vrow: base.options.NameKeyMap.Vrow,
                 tab:base.options.NameKeyMap.tab,
                 rateList: base.options.NameKeyMap.rateList

             });
             //var output= base.format("<h1>{elem}</h1>",{elem:base.options.txt});
             var output=outputVideo+" "+outputButtons;
             base.$el.html(output);
         };
        /**
         * Initialize callback methods javascript
         */
        base.addEvents = function(){

           var vid = $("#video").get(0);
           //base.options.vid

            var playPause = $("#PlayPauseButton").get(0);
            var seekSlider = $("#seekBar").get(0);
            var seekTime = $("#numberSeek").get(0);
            var stop = $("#stopButton").get(0);
            var fullScreen1 = $("#fullScreenButton").get(0);
            var volumeSlider = $("#volumeBar").get(0);
            var mute = $("#muteButton").get(0);
            var playRate = $("#playRateList").get(0);

            /**
             * Control video events with keyboard
             * @type {boolean}
             */
            var flag='pause';
            $(document).keydown(function (event) {
                switch (event.keyCode) {
                    case base.options.KeyMap.FULL_SCREEN:

                        if (document.getElementById('modalStore').style.display!='block') {     //if the Modal is open, don't make video features
                            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                                FFullScreen();
                            } else {
                                FFullScreenExit();
                            }
                        }
                        break;

                    case base.options.KeyMap.PLAY_PAUSE:
                        if (document.getElementById('modalStore').style.display!='block') { //if the Modal is open, don't make video features
                            event.preventDefault();
                            console.log('Video Paused? ' + flag);
                            FPlayPause();
                        }
                        break;

                    case base.options.KeyMap.FAST_FORWARD:
                        if (playRate.value<2) {
                            playRate.value = parseFloat(playRate.value) + 0.5;
                            console.log('PlayRate: ' + playRate.value);
                            FPlayRate();
                        }
                        break;

                    case base.options.KeyMap.BACKWARD:
                        if (playRate.value>0.5) {
                            playRate.value = parseFloat(playRate.value) - 0.5;
                            console.log('PlayRate: ' + playRate.value);
                            FPlayRate();
                        }
                        break;

                    case base.options.KeyMap.CHANGE_TIME_UP:
                        if (seekSlider.value<100){
                            vid.pause();
                            seekSlider.value=parseInt(seekSlider.value)+1;
                            TimeBar();
                            TimeVideo();
                            vid.play();
                        }
                        break;

                    case base.options.KeyMap.CHANGE_TIME_DOWN:
                        if (seekSlider.value>0){
                            vid.pause();
                            seekSlider.value=parseInt(seekSlider.value)-1;
                            TimeBar();
                            TimeVideo();
                            vid.play();
                        }
                        break;

                    case base.options.KeyMap.VOLUME_UP:
                        event.preventDefault();
                        if (volumeSlider.value<100) {
                            volumeSlider.value = (parseInt(volumeSlider.value)+1);
                            console.log('volume :' + volumeSlider.value);
                            volume();
                        }
                        break;

                    case base.options.KeyMap.VOLUME_DOWN:
                        event.preventDefault();
                        if (volumeSlider.value>0) {
                            volumeSlider.value = (parseInt(volumeSlider.value)-1);
                            console.log('volume :' + volumeSlider.value);
                            volume();
                        }
                        break;
                }
             });
            /**
             * if the video is paused, status and  button icon changes, the same in reverse
             */
            function FPlayPause() {
                if (vid.paused) {
                    vid.play();
                    flag='play';
                    playPause.className = "btn btn-default  btn-sm glyphicon glyphicon-pause";
                } else {
                    vid.pause();
                    flag='pause';
                    playPause.className = "btn btn-default  btn-sm glyphicon glyphicon-play";

                }
            }

            /**
             * updated video time if the bar changes
             */
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

            /**
             * if the video is muted, status,  button icon and volume bar changes, the same in reverse
             */
            function FMute() {
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

            /**
             * if you change volume bar, the video volume actualize automatically
             * if volume video is 0 change icon, the same in reverse
             */
            function volume() {
                vid.volume = volumeSlider.value / 100;
                if (vid.volume === 0) {
                    mute.className = "btn btn-default  btn-sm glyphicon glyphicon-volume-off";
                }
                else {
                    mute.className = "btn btn-default  btn-sm glyphicon glyphicon-volume-up";
                }
            }

            /**
             * check if video is in full screen or not and change mode
             */
            function FFullScreen() {
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

            function FFullScreenExit() {
                if (vid.exitFullscreen) {
                    vid.exitFullscreen();
                } else if (vid.mozCancelFullscreen) {
                    vid.mozCancelFullscreen();
                } else if (vid.webkitExitFullscreen) {
                    vid.webkitExitFullscreen();
                } else if (vid.msExitFullscreen) {
                    vid.msExitFullscreen();
                }
            }

            /**
             * change time video to 0 and pause video
             */
            function FStop() {
                vid.currentTime = 0;
                vid.pause();
                playPause.className = "btn btn-default  btn-sm glyphicon glyphicon-play";
            }

            /**
             *  depending on value of playRate (tag select) you active fast_forward or backward
             */
            function FPlayRate() {
                vid.playbackRate = playRate.value;
            }

            /**
             * actualize (tag span) with current time of video
             *
             */
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

                if ( vid.currentTime == vid.duration){
                    vid.currentTime=0;
                    playPause.className = "btn btn-default  btn-sm glyphicon glyphicon-play";
                    seekSlider.value=0;
                    seekTime.innerHTML= "00:00";
                }
            }

            /**
             * actualize info of video
             */
            var status = $("#status").get(0);
            var time = $("#time").get(0);
            var vol = $("#vol").get(0);
            var rate = $("#rate").get(0);

            function ValuesVideo() {
                status.innerHTML= flag;
                time.innerHTML= vid.currentTime;
                vol.innerHTML= volumeSlider.value;
                rate.innerHTML= playRate.value;
            }

            /**
             * take the different elements of DOM and associate an event
             */
            $("#PlayPauseButton").click(function () { FPlayPause(); });
            $("#video").click(function () { FPlayPause(); });
            $("#seekBar").change(function () { /*mousedown*/ TimeBar(); });
            $("#seekBar").mousedown(function () { TimeBarMouseDown(); });
            $("#seekBar").mouseup(function () { TimeBarMouseUp(); });
            $("#video").on("timeupdate", function () { TimeVideo(); ValuesVideo();});
            $("#muteButton").click(function () { FMute(); });
            $("#volumeBar").on("input", function () { volume(); });
            $("#fullScreenButton").click(function () { FFullScreen(); });
            $("#stopButton").click(function () { FStop(); });
            $("#playRateList").change(function () { FPlayRate(); });

            //Video Scenes
            /**
             * get inputs in Modal
             */
            var nameScene=$("#recipient-name").get(0);
            var messageScene=$("#message-text").get(0);

            //buttons to save and view
            $("#store").click(function () { StoreScene(); });
            $("#show").click(function () { ShowSceenes(); });
            $("#delete").click(function () { DeleteScenes(); });

            /**
             * get saved scenes in localStorage and add the scene created in the array
             */
            function StoreScene(){
                vid.pause();
                var scenesStored = localStorage.getItem('scenes');
                var  scenes= [];
                if (scenesStored) {
                    scenes = JSON.parse(scenesStored);
                }
                var o= { name: nameScene.value, time: vid.currentTime, description: messageScene.value };
                scenes.push(o);
                localStorage.setItem('scenes', JSON.stringify(scenes));

                nameScene.value="";
                messageScene.value="";

            }

            /**
             * each saved scene show a button
             */
            function ShowSceenes(){
                $("#scenes").get(0).innerHTML="";
                var scenesStored = localStorage.getItem('scenes');
                var  scenes= [];
                if (scenesStored) {
                    scenes = JSON.parse(scenesStored);
                }
                var scene;
                for (var i=0; i<scenes.length; i++){
                    scene=scenes[i];
                    $("#scenes").append("<button type='button' id='button"+i+"' class='buttonScene btn btn-link btn-xs' data-toggle='popover' data-trigger='hover' title='Description:("+scene.time+")' data-content='"+scene.description+"' value='"+scene.time+"'>"+scene.name+"</button><br/>");

                }

                //activate popover
                $('[data-toggle="popover"]').popover();

                /**
                 * get the id of the button pressed and assign its value at the time of video
                 */
                $(".buttonScene").click(function() {
                   vid.currentTime=$("#"+this.id).get(0).value;
                    vid.pause();
                });

            }

            function DeleteScenes(){

                var  scenes= [];
                localStorage.setItem('scenes', JSON.stringify(scenes));
                $("#scenes").get(0).innerHTML="";

            }
        };

        // Run initializer
        base.init();
    };

    /**
     * values of html
     * @type {{txt: string, poster: string, src: string, type: string, msg: string, NameKeyMap: {space: string, Trow: string, Vrow: string, rateList: string}, KeyMap: {FULL_SCREEN: number, PLAY_PAUSE: number, FAST_FORWARD: number, BACKWARD: number, CHANGE_TIME_UP: number, CHANGE_TIME_DOWN: number, VOLUME_UP: number, VOLUME_DOWN: number}}}
     */
    $.JBenejam.Video.defaultOptions = {
        //vid : $("#video").get(0),
        poster : "",
        src: "",
        type: "",
        msg: "",

        NameKeyMap: {
            tab:"tab",
            space: "space",
            Trow: "row right/left",
            Vrow: "row up/down",
            rateList: "+/-"
        },

        KeyMap: {
                FULL_SCREEN: 9,//tab //46,
                PLAY_PAUSE: 32,  //space
                FAST_FORWARD: 107, //+
                BACKWARD: 109, //-
                CHANGE_TIME_UP:39, //row right
                CHANGE_TIME_DOWN:37, //row left
                VOLUME_UP:38, //row up
                VOLUME_DOWN: 40, //row down
        }
    };

    /**
     * html structure of video and buttons
     * @type {{videoTag: string, buttonsTag: string}}
     */
    $.JBenejam.Video.htmlTags = {
        videoTag:"<video id='video' poster='{poster}' class='center-block'><source src='{src}' type='{type}'>{msg}</video>",
        buttonsTag:"<div class='videoButtons' > " +
        "<ul class='videoToolbar control-buttons'> " +
        "<li class='col-xs-3 col-md-1 col-sm-1'> " +
        "<button type='button' id='PlayPauseButton' title='{space}' class='btn btn-default btn-sm glyphicon glyphicon-play'>" +
        "</button> " +
        "</li> " +
        "<li class='col-sm-4 hidden-xs'> " +
        "<div> " +
        "<input type='range' id='seekBar' title='{Trow}' class='range pull-left' min='0' max='100' value='0' step='1' style='min-width: 150px; width: 200px;'> " +
        "<span id='numberSeek' class='pull-right' >00:00</span> " +
        "</div> " +
        "</li> " +
        "<li class='col-xs-3 col-md-1 col-sm-1'> " +
        "<button type='button' id='muteButton' class='btn btn-default btn-sm glyphicon glyphicon-volume-up'></button> " +
        "</li> " +
        "<li class='col-sm-2 hidden-xs'> " +
        "<div> " +
        "<input type='range' id='volumeBar' title='{Vrow}' class='range' min='0' max='100' value='100' step='1'> " +
        "</div> " +
        "</li> " +
        "<li class='col-xs-3 col-md-1 col-sm-1'> " +
        "<button type='button' id='fullScreenButton' title='{tab}' class='btn btn-default btn-sm glyphicon glyphicon-fullscreen'></button> " +
        "</li> " +
        "<li class='col-md-1 hidden-sm hidden-xs'> " +
        "<button type='button' id='stopButton' class='btn btn-default btn-sm glyphicon glyphicon-stop'></button> " +
        "</li> " +
        "<li class='col-xs-1 hidden-sm hidden-xs'> " +
        "<select id='playRateList' title='{rateList}'> " +
        "<option value='1'>1</option> " +
        "<option value='0.5'>0.5</option> " +
        "<option value='1.5'>1.5</option> " +
        "<option value='2'>2</option> " +
        "</select> " +
        "</li> " +
        "</ul> " +
        "</div>"

    };
    $.fn.JBenejam_Video = function(getData, options){
        return this.each(function(){
            (new $.JBenejam.Video(this, getData, options));
        });
    };
    // This function breaks the chain, but returns
    // the jBenejam.Video if it has been attached to the object.
    $.fn.getJBenejam_Video = function(){
        this.data("JBenejam.Video");
    };
})(jQuery);
// Tabs
$(document).ready(function(){
  $('.tab-trigger').on('click', function(){
    showTab($(this));
  });
  
  function showTab(tab){
    var tabBar = tab.parent().find('.tab-active-bar');
    tabBar.animate({
      left: parseInt(tab.position().left)+'px',
      width: parseInt(tab.innerWidth())+'px'
    });
    $('.tab-content').fadeOut(150).promise().done(function(){
      $(tab.data('target')).fadeIn(150);
    });
    
  }
  
  //showTab($('#tab1'));
  showTab($('[data-target="#radio"]'));
});

//

var streamURL = 'http://icecast.radonezh.cdnvideo.ru:8000/rad';
var dataURL = "https://artraut.com/radonezh.api";

var currentDate = function () {
	var fulldate = new Date();
	var date = '[' 
			+ ('0' + fulldate.getDate()).slice(-2) + '.' 
			+ ('0'+(fulldate.getMonth()+1)).slice(-2) + '.' 
			+ fulldate.getFullYear() + " " 
			+ ('0' + fulldate.getHours()).slice(-2) + ':' 
			+ ('0' + fulldate.getMinutes()).slice(-2) + ':' 
			+ ('0' + fulldate.getSeconds()).slice(-2) + '] ';
	return date;
}

$('#copyYear').html( function () {
	var fulldate = new Date();
	currentYear = fulldate.getFullYear();
	if (currentYear == '2017') {
		return '2017';
	} else {
		return '2017 - ' + currentYear;
	}
});

// Stream Data
var getData = function() {
	$('#current, #next').empty();
	$('.data-loading').show();
	$.ajax({
	    type: "GET",
	    url: dataURL,
	    dataType: 'jsonp',
	    success: function (data) {
	    	console.log (currentDate() + 'Stream data parsed');
	    	$('.data-loading').hide();
	        $('#current').html(data.current);
			$('#next').html(data.next);
			var update = data.updateTime;
			var update = 60000; // updating every minute thnx for Radonezh backend bug, comment when issue
			setTimeout(function(){
				getData();
			}, update);
	    },
	    error: function (jqXHR, exception) { 
	    	var error = '';
        	if (jqXHR.status === 0) {
	            error = 'Not connect. Verify Network. ';
	        } else if (jqXHR.status == 404) {
	            error = 'Requested page not found. [404] ';
	        } else if (jqXHR.status == 500) {
	            error = 'Internal Server Error [500]. ';
	        } else if (exception === 'parsererror') {
	            error = 'Requested JSON parse failed. ';
	        } else if (exception === 'timeout') {
	            error = 'Time out error. ';
	        } else if (exception === 'abort') {
	            error = 'Ajax request aborted. ';
	        } else {
	            error = 'Uncaught Error.\n' + jqXHR.responseText;
	        }
	    	console.log (currentDate() + error + 'Reloading stream data parsing...');
	    	getData();
	    }	
	});
}
getData();	

// Stream Player

var audio = new Audio(streamURL);
var playing = false;

audio.oncanplay = function () {
	$('#play').show();
	$('#pause').hide();
	$('#activity').hide();
	console.log (currentDate() + 'Stream can play');
}

audio.onplaying = function () {
	$('#play').hide();
	$('#pause').show();
	$('#activity').hide();
	$('.progress').show();
	playing = true;
	console.log (currentDate() + 'Stream playing...');
}

audio.onpause = function () {
	$('#play').show();
	$('#pause').hide();
	$('#activity').hide();
	$('.progress').hide();
	playing = false;
	console.log (currentDate() + 'Paused');
}

audio.onwaiting = function () {
	$('#play').hide();
	$('#pause').hide();
	$('#activity').show();
	$('.progress').hide();
	console.log (currentDate() + 'Buffering...');
}

audio.onerror = function () {
	$('#play').hide();
	$('#pause').hide();
	$('#activity').show();
	$('.progress').hide();
	console.log (currentDate() + 'Something wrong, error. Reloading stream...');
    audio.load();
    console.log (currentDate() + audio.src + ' Loaded');
    if (playing == true) {
    	console.log (currentDate() + 'Restart playing');
    	Materialize.Toast.removeAll();
    	Materialize.toast('Ошибка сети. Перезапускаю вещание...', 5000);
    	audio.play();
	}
}

//Materialize.toast('Ошибка сети. Перезапускаю вещание...', 500000);

$('#play').click( function() {
	audio.play();
});

$('#pause').click( function() {
	audio.pause();
});

/*
$('#play').click( function() {
	
	audio.play();
	
	readyStateInterval = setInterval(function(){
		if (audio.readyState <= 2) {
			$('#play').hide();
			$('#activity').show();
		}	
	}, 1000);

	audio.onplay = function () {
		$('#play').hide();
		$('#stop').show();
		$('#activity').hide();
		$('.progress').show();
		console.log ('Stream playing...')
    }	
});
$('#stop').click( function() {
	clearInterval(readyStateInterval);
	audio.pause();
	$('#stop').hide();
	$('#play').show();
	$('.progress').hide();
});
/*
playButton = document.getElementById('playbutton');
stopButton = document.getElementById('stopbutton');
activityIndicator = document.getElementById('activityindicator');

var playButton;
var stopButton;
var activityIndicator;

function onError(error) 
{
    console.log(error.message);
}

function onConfirmRetry(button) {
    if (button == 1) {
        html5audio.play();
    }
}

function pad2(number) {
    return (number < 10 ? '0' : '') + number
}

var myaudioURL = 'http://icecast.radonezh.cdnvideo.ru:8000/rad';
var myaudio = new Audio(myaudioURL);
var isPlaying = false;
var readyStateInterval = null;

var html5audio = {
    play: function()
    {
        isPlaying = true;
        myaudio.play();

        readyStateInterval = setInterval(function(){
            if (myaudio.readyState <= 2) {
                playButton.style.display = 'none';
                activityIndicator.style.display = 'block';
            }
        },1000);
        myaudio.addEventListener("error", function() {
            console.log('myaudio ERROR');
        }, false);
        myaudio.addEventListener("canplay", function() {
            console.log('myaudio CAN PLAY');
        }, false);
        myaudio.addEventListener("waiting", function() {
            isPlaying = false;
            playButton.style.display = 'none';
            stopButton.style.display = 'none';
            activityIndicator.style.display = 'block';
        }, false);
        myaudio.addEventListener("playing", function() {
            isPlaying = true;
            playButton.style.display = 'none';
            activityIndicator.style.display = 'none';
            stopButton.style.display = 'block';
            $('.progress').show();
        }, false);
        myaudio.addEventListener("ended", function() {
            html5audio.stop();
            if (window.confirm('Streaming failed. Possibly due to a network error. Retry?')) {
                onConfirmRetry();
            }
        }, false);
    },
    pause: function() {
        isPlaying = false;
        clearInterval(readyStateInterval);
        myaudio.pause();
        stopButton.style.display = 'none';
        activityIndicator.style.display = 'none';
        playButton.style.display = 'block';
        $('.progress').hide();
    },
    stop: function() {
        isPlaying = false;
        clearInterval(readyStateInterval);
        myaudio.pause();
        stopButton.style.display = 'none';
        activityIndicator.style.display = 'none';
        playButton.style.display = 'block';
        $('.progress').hide();
        myaudio = null;
        myaudio = new Audio(myaudioURL);
    }
};
*/
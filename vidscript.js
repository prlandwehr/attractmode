//which folders to load videos from by type
var attractFolders = ["arcade","n64","neo_geo","psx","snes"];
var promoFolders = ["misc","promotional","commercial_playlists"];
var allFolders = attractFolders.concat(promoFolders);

//important page elements
var videoPlayerElement = document.getElementById("video_player");
var timeLeftElement = document.getElementById("time_left");
var fileNameElement = document.getElementById("file_name");
var progressBarElement = document.getElementById("progress_bar");

//modes: "random" "twotoone" "alternate" "attract" "promotional"
var currentMode = "twotoone";
var twotooneCount = 0;
var alternateCount = 0;

//queues
var attractQueue = [];
var promoQueue = [];
var allQueue = [];

//return seconds in HH:MM:SS format
var secondsToHMS = function(d) {
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	
	var hDisplay = h > 0 ? h + ":" : "00:";
	var mDisplay = m > 0 ? m + ":" : "00:";
	var sDisplay = s > 0 ? s : "00";
	
	if(h > 0 && h < 10) {
		hDisplay = "0" + hDisplay;
	}
	if(m > 0 && m < 10) {
		mDisplay = "0" + mDisplay;
	}
	if(s > 0 && s < 10) {
		sDisplay = "0" + sDisplay;
	}
	
	return hDisplay + mDisplay + sDisplay; 
};

//random int from 0 to max - 1
var getRandomInt = function(max) {
	return Math.floor(Math.random() * max);
};

//populate array of all attract videos
var buildAttractQueue = function() {
	for(var i = 0; i < attractFolders.length; i++) {
		var currentFolder = attractFolders[i];
		var currentFolderContents = file_manifest[currentFolder];
		for(j = 0; j < currentFolderContents.length; j++) {
			attractQueue.push(currentFolder + "/" + currentFolderContents[j]);
		}
	}
};

//populate array of all promo videos
var buildPromoQueue = function() {
	for(var i = 0; i < promoFolders.length; i++) {
		var currentFolder = promoFolders[i];
		var currentFolderContents = file_manifest[currentFolder];
		for(j = 0; j < currentFolderContents.length; j++) {
			promoQueue.push(currentFolder + "/" + currentFolderContents[j]);
		}
	}
};

//populate array of all videos
var buildAllQueue = function() {
	for(var i = 0; i < allFolders.length; i++) {
		var currentFolder = allFolders[i];
		var currentFolderContents = file_manifest[currentFolder];
		for(j = 0; j < currentFolderContents.length; j++) {
			allQueue.push(currentFolder + "/" + currentFolderContents[j]);
		}
	}
};

//get the path for a random attract video and remove it from the queue
var getRandomAttract = function() {
	var attractIndex = getRandomInt(attractQueue.length);
	var vidPath = attractQueue[attractIndex];
	attractQueue.splice(attractIndex, 1);
	if(attractQueue.length === 0) {
		buildAttractQueue();
	}
	return vidPath;
};

//get the path for a random promo video and remove it from the queue
var getRandomPromo = function() {
	var promoIndex = getRandomInt(promoQueue.length);
	var vidPath = promoQueue[promoIndex];
	promoQueue.splice(promoIndex, 1);
	if(promoQueue.length === 0) {
		buildPromoQueue();
	}
	return vidPath;
};

//get the path for a random video and remove it from the queue
var getRandomVideo = function() {
	var allIndex = getRandomInt(allQueue.length);
	var vidPath = allQueue[allIndex];
	allQueue.splice(allIndex, 1);
	if(allQueue.length === 0) {
		buildAllQueue();
	}
	return vidPath;
};

//select and play the next video based on the mode
var playNextVideo = function() {
	if(currentMode === "random") {
		videoPlayerElement.setAttribute("src", getRandomVideo());
	} else if(currentMode === "twotoone") {
		twotooneCount++;
		if(twotooneCount > 2) {
			videoPlayerElement.setAttribute("src", getRandomPromo());
			twotooneCount = 0;
		} else {
			videoPlayerElement.setAttribute("src", getRandomAttract());
		}
	} else if(currentMode === "alternate") {
		alternateCount++;
		if(alternateCount > 1) {
			videoPlayerElement.setAttribute("src", getRandomPromo());
			alternateCount = 0;
		} else {
			videoPlayerElement.setAttribute("src", getRandomAttract());
		}
	} else if(currentMode === "attract") {
		videoPlayerElement.setAttribute("src", getRandomAttract());
	} else if(currentMode === "promotional") {
		videoPlayerElement.setAttribute("src", getRandomPromo());
	} else {
		videoPlayerElement.setAttribute("src", getRandomVideo());
	}
};

//INIT
buildAttractQueue();
buildPromoQueue();
buildAllQueue();
playNextVideo();

//EVENT LISTENER SECTION
//update the UI according to uiUpdateInterval
var uiUpdateInterval = 1000;
var uiUpdate = setInterval(function(){
	var percentComplete = videoPlayerElement.currentTime / videoPlayerElement.duration * 100;
	progressBarElement.style["width"] = percentComplete + "%";
	
	var timeLeft = secondsToHMS( videoPlayerElement.duration - videoPlayerElement.currentTime );
	timeLeftElement.innerHTML = timeLeft;
	
	var currentFile = videoPlayerElement.getAttribute("src").split("/")[1];
	currentFile = currentFile.substring(0, currentFile.length - 4).toUpperCase();
	fileNameElement.innerHTML = currentFile;
}, uiUpdateInterval);

//on video complete queue next video
videoPlayerElement.addEventListener("ended", function() {
	playNextVideo();
});

//click to skip to next video
videoPlayerElement.addEventListener("click", function(event) {
	playNextVideo();
});
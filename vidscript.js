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
var stallCount = 0;
var stallMax = 90;
var lastTimeTic = "";

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

//Fill target array with all videos in the given folders
var buildQueue = function(folderArray, outputArray) {
	for(var i = 0; i < folderArray.length; i++) {
		var currentFolder = folderArray[i];
		var currentFolderContents = file_manifest[currentFolder];
		for(j = 0; j < currentFolderContents.length; j++) {
			outputArray.push(currentFolder + "/" + currentFolderContents[j]);
		}
	}
};

//Get the next random video for a queue and repopulate it if needed
var getRandomVideo = function(sourceFolders, sourceQueue) {
	var videoIndex = getRandomInt(sourceQueue.length);
	var vidPath = sourceQueue[videoIndex];
	sourceQueue.splice(videoIndex, 1);
	if(sourceQueue.length === 0) {
		console.log("Queue Empty - refreshing");
		buildQueue(sourceFolders, sourceQueue);
	}
	return vidPath;
};

//select and play the next video based on the mode
var playNextVideo = function() {
	stallCount = 0;
	if(currentMode === "twotoone") {
		twotooneCount++;
		if(twotooneCount > 2) {
			videoPlayerElement.setAttribute("src", getRandomVideo(promoFolders, promoQueue));
			twotooneCount = 0;
		} else {
			videoPlayerElement.setAttribute("src", getRandomVideo(attractFolders, attractQueue));
		}
	} else if(currentMode === "alternate") {
		alternateCount++;
		if(alternateCount > 1) {
			videoPlayerElement.setAttribute("src", getRandomVideo(promoFolders, promoQueue));
			alternateCount = 0;
		} else {
			videoPlayerElement.setAttribute("src", getRandomVideo(attractFolders, attractQueue));
		}
	} else if(currentMode === "attract") {
		videoPlayerElement.setAttribute("src", getRandomVideo(attractFolders, attractQueue));
	} else if(currentMode === "promotional") {
		videoPlayerElement.setAttribute("src", getRandomVideo(promoFolders, promoQueue));
	} else {
		videoPlayerElement.setAttribute("src", getRandomVideo(allFolders, allQueue));
	}
};

//INIT
console.log("building Attract Queue");
buildQueue(attractFolders, attractQueue);
console.log("building Promo Queue");
buildQueue(promoFolders, promoQueue);
console.log("building All Queue");
buildQueue(allFolders, allQueue);
console.log("playing first video");
playNextVideo();

//EVENT LISTENER SECTION
//update the UI according to uiUpdateInterval
var uiUpdateInterval = 1000;
var uiUpdate = setInterval(function(){
	if(timeLeftElement.innerHTML === lastTimeTic) {
		stallCount++;
		console.log("stall: " + stallCount);
	}
	if(stallCount >= stallMax) {
		stallCount = 0;
		playNextVideo();
		return;
	}
	
	var percentComplete = videoPlayerElement.currentTime / videoPlayerElement.duration * 100;
	progressBarElement.style["width"] = percentComplete + "%";
	
	lastTimeTic = timeLeftElement.innerHTML;
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
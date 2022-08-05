//folders sorted by type
var attractFolders = ["arcade","n64","neo_geo","psx","snes"];
var promoFolders = ["promotional","commercial_playlists"];
var allFolders = attractFolders.concat(promoFolders);

//important page elements
var videoPlayerElement = document.getElementById("video_player");
var timeLeftElement = document.getElementById("time_left");
var fileNameElement = document.getElementById("file_name");
var progressBarElement = document.getElementById("progress_bar");

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

//get the path for a random attract video
var getRandomAttract = function() {
	var attractFolder = attractFolders[getRandomInt(attractFolders.length)];
	var attractContents = file_manifest[attractFolder];
	var selectedFile = attractContents[getRandomInt(attractContents.length)];
	return attractFolder + "/" + selectedFile;
};

//get the path for a random promo video
var getRandomPromo = function() {
	var promoFolder = promoFolders[getRandomInt(promoFolders.length)];
	var promoContents = file_manifest[promoFolder];
	var selectedFile = promoContents[getRandomInt(promoContents.length)];
	return promoFolder + "/" + selectedFile;
};

//get the path for a random video
var getRandomVideo = function() {
	var videoFolder = allFolders[getRandomInt(allFolders.length)];
	var folderContents = file_manifest[videoFolder];
	var selectedFile = folderContents[getRandomInt(folderContents.length)];
	return videoFolder + "/" + selectedFile;
};

//start playing the first video
videoPlayerElement.setAttribute("src", getRandomVideo());

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
	videoPlayerElement.setAttribute("src",getRandomVideo());
});
var radio = new tire()

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "play"){
			radio.playStream(request.value);
		}
		if (request.action == "stop"){
			radio.stopStream();
		}
		if (request.action == "pause"){
			radio.pauseStream();
		}
		if (request.action == "updateOnlineRadioList"){
			radio.updateOnlineRadioList();
		}
		if (request.action == "player_volume"){
			radio.streamVolume(request.volume);
		}
});
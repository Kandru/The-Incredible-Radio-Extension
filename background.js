var radio = new tire()

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == "play"){
			radio.playStream(request.value);
		}
		else if (request.action == "stop"){
			radio.stopStream();
		}
		else if (request.action == "pause"){
			radio.pauseStream();
		}
		else if (request.action == "updateOnlineRadioList"){
			radio.updateOnlineRadioList();
		}
		else if (request.action == "player_volume"){
			radio.streamVolume(request.volume);
		}
});
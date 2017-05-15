function playRadio(radioItem) {
	chrome.runtime.sendMessage({action: 'play', value: radioItem});
	DisplayCurrentRadio(radioItem);
}

function getRadioList() {
	chrome.runtime.getBackgroundPage(function(bg) {
		var list = bg.radio.getRadioList();
		DisplayRadioList(list);
	});
}

function getFavoriteList() {
	chrome.runtime.getBackgroundPage(function(bg) {
		var list = bg.radio.getFavoriteList();
		DisplayRadioList(list);
	});
}

function getRadioListCategories() {
	chrome.runtime.getBackgroundPage(function(bg) {
		var list = bg.radio.getRadioListCategories();
		DisplayCategoryList(list);
	});
}

function getRadioListCategory(cat) {
	chrome.runtime.getBackgroundPage(function(bg) {
		var list = bg.radio.getRadioListByCategory(cat);
		DisplayRadioList(list);
	});
}

function getRadioListGenres() {
	chrome.runtime.getBackgroundPage(function(bg) {
		var list = bg.radio.getRadioListGenres();
		DisplayGenreList(list);
	});
}

function getRadioListGenre(cat) {
	chrome.runtime.getBackgroundPage(function(bg) {
		var list = bg.radio.getRadioListByGenre(cat);
		DisplayRadioList(list);
	});
}

function addFavoriteToList(radioItem) {
	chrome.runtime.getBackgroundPage(function(bg) {
		bg.radio.addFavoriteToList(radioItem);
		getFavoriteList();
	});
}

function setVolume(e) {
	var value = document.querySelector('#player_volume').value;
	value = value / 100;
	chrome.runtime.sendMessage({action: 'player_volume',volume: value});
}

function doSearch(e) {
	var value = document.querySelector('#player_search').value;
	chrome.runtime.getBackgroundPage(function(bg) {
		var list = bg.radio.getRadioListByName(value);
		DisplayRadioList(list);
	});
}

function DisplayCurrentRadio(radioItem) {
	var html = '';
	var slug = 'nostream';
	var title = 'Offline';
	var description = 'currently no radio playing';
	if (radioItem  && radioItem.state == 1) {
		slug = radioItem.slug;
		title = radioItem.name;
		description = radioItem.description;
		SetButtonState(true);
	}else{
		SetButtonState(false);
	}
	html = html + '<div class="media-left">';
	html = html + '<img class="media-object" src="https://api.kandru.de/tire/images/streams/'+slug+'.png" width="50px" alt="Stream Logo">';
	html = html + '</div>';
	html = html + '<div class="media-body">';
	html = html + '<h4 class="media-heading">' + title + '</h4>';
	html = html + description;
	html = html + '</div>';		
	document.querySelector('#player_current').innerHTML = html;
}

function DisplayRadioList(list)
{
	var html = "";
	
	for (var value in list)
	{
		var value = list[value];
		html = html + '<li class="list-group-item" id="radiolist-'+value.slug+'">';
		html = html + '<div class="media">';
		html = html + '<div class="media-left">';
		html = html + '<img class="media-object" src="https://api.kandru.de/tire/images/streams/'+value.slug+'.png" width="50px" alt="Logo">';
		html = html + '</div>';
		html = html + '<div class="media-body">';
		html = html + '<h4 class="media-heading">'+value.name+'</h4>';
		html = html + value.description;
		html = html + '</div>';
		html = html + '</div>';
		html = html + '</li>';
	}
	if (html == "")
	{
		html = html + '<li class="list-group-item">no radios listed</li>';
	}
	
	document.querySelector('#stream_list').innerHTML = html;
	
	for (var value in list)
	{
		var value = list[value];
		document.querySelector('#radiolist-'+value.slug).addEventListener('click',function(param1){param1.state = 1;playRadio(param1);}.bind(this,value));
	}
}

function DisplayCategoryList(list)
{
	var html = "";
	
	for (var value in list)
	{
		var value = list[value];
		html = html + '<li class="list-group-item" id="categorylist-'+value.category.replace(/\s+/g, '-')+'">';
		html = html + '<div class="media">';
		html = html + '<div class="media-body">';
		html = html + value.category;
		html = html + '</div>';
		html = html + '</div>';
		html = html + '</li>';
	}
	if (html == "")
	{
		html = html + '<li class="list-group-item">no categories found Oo. Check your internet connection!</li>';
	}
	
	document.querySelector('#stream_list').innerHTML = html;
	
	for (var value in list)
	{
		var value = list[value];
		document.querySelector('#categorylist-'+value.category.replace(/\s+/g, '-')).addEventListener('click',function(param1){getRadioListCategory(param1);}.bind(this,value.category));
	}
}

function DisplayGenreList(list)
{
	var html = "";
	
	for (var value in list)
	{
		var value = list[value];
		html = html + '<li class="list-group-item" id="genrelist-'+value.replace(/\s+/g, '-')+'">';
		html = html + '<div class="media">';
		html = html + '<div class="media-body">';
		html = html + value;
		html = html + '</div>';
		html = html + '</div>';
		html = html + '</li>';
	}
	if (html == "")
	{
		html = html + '<li class="list-group-item">no genres found -.- the world is going to destroy itself. Check your internet connection!</li>';
	}
	
	document.querySelector('#stream_list').innerHTML = html;
	
	for (var value in list)
	{
		var value = list[value];
		document.querySelector('#genrelist-'+value.replace(/\s+/g, '-')).addEventListener('click',function(param1){getRadioListGenre(param1);}.bind(this,value));
	}
}

function SetButtonState(type) {
	if (type) {
		document.getElementById("player_play").disabled = true;
		document.getElementById("player_stop").disabled = false;
		document.getElementById("player_homepage").disabled = false;
		document.getElementById("player_favorite").disabled = false;
	}else{
		document.getElementById("player_play").disabled = false;
		document.getElementById("player_stop").disabled = true;
		document.getElementById("player_homepage").disabled = true;
		document.getElementById("player_favorite").disabled = true;
	}
}

// after document is loaded
document.addEventListener('DOMContentLoaded', function () {
	DisplayCurrentRadio(JSON.parse(localStorage.getItem('data_radio')));
	document.querySelector('#player_volume').value = localStorage.getItem('player_volume') * 100;
	document.querySelector('#player_volume').addEventListener('input', setVolume);
	document.querySelector('#player_search').addEventListener('input', doSearch);
	document.querySelector('#player_favorite').addEventListener('click', function(e){
		var radioItem = JSON.parse(localStorage.getItem('data_radio'));
		if (radioItem) {
			addFavoriteToList(radioItem);
		}
	});
	document.querySelector('#player_play').addEventListener('click', function(e){
		var radioItem = JSON.parse(localStorage.getItem('data_radio'));
		if (radioItem) {
			radioItem.state = 1;
			playRadio(radioItem);
		}
	});
	document.querySelector('#player_category').addEventListener('click', function(e){getRadioListCategories();});
	document.querySelector('#player_genre').addEventListener('click', function(e){getRadioListGenres();});
	document.querySelector('#player_favorites').addEventListener('click', function(e){getFavoriteList();});
	
	// update radiolist every hour
	if(localStorage.getItem('online_lastupdate') <= (Math.round(new Date().getTime() / 1000) - 3600))
	{
		chrome.runtime.sendMessage({action: 'updateOnlineRadioList'});
	}
	
	// add eventlistener for link to homepage
	document.querySelector('#player_homepage').addEventListener('click', function(e)
	{
		var radioItem = JSON.parse(localStorage.getItem('data_radio'));
		chrome.tabs.create({ url: radioItem.homepage });;
	});
	// add eventlistener for stop button
	document.querySelector('#player_stop').addEventListener('click', function(e){
		chrome.runtime.sendMessage({action: 'stop'});
		DisplayCurrentRadio(null);
	});

	getFavoriteList();
	
});
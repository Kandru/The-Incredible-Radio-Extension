class tire {
	constructor() {
		this.api_version = '1';
		this.api_url = 'https://api.kandru.de/tire/radios_v' + this.api_version + '.js';
		this.player = null;
		this.is_playing = false;
		// initialize player variables
		localStorage.setItem('data_radio', null);
		// set default volume if none (otherwise radio would be muted for new users)
		localStorage.setItem('player_volume', this.getVolume());
		this.updateOnlineRadioList();
	}

	getFavoriteList() {
		var list = JSON.parse(localStorage.getItem('data_favorites'));
		return list;
	}

	addFavoriteToList(radioItem) {
		var list = JSON.parse(localStorage.getItem('data_favorites'));
		if (!list) {
			list = [];
		}
		var result = alasql('SELECT * FROM ? WHERE slug = ?',[list, radioItem.slug]);
		if(result.length == 0) {
			list.push(radioItem);
		}else{
			for(var i = 0; i < list.length; i++) {
				if(list[i].slug == result[0].slug) {
					list.splice(i, 1);
					break;
				}
			}
		}
		localStorage.setItem('data_favorites', JSON.stringify(list));
	}

	updateOnlineRadioList() {
		if(this.api_url != undefined) {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange=function()
			{
				if (xmlhttp.readyState==4 && xmlhttp.status==200)
				{
					var streamlist = xmlhttp.responseText;
					if(streamlist !== null)
					{
						localStorage.setItem('data_radios', streamlist);
						localStorage.setItem('data_radios_lastupdate',Math.round(new Date().getTime() / 1000));
					}
				}
			}
			xmlhttp.open('GET', this.api_url + '?timestamp='+Date.now(),true);
			xmlhttp.send();
		}
	}
	
	getRadioList() {
		var data = JSON.parse(localStorage.getItem('data_radios'));
		return alasql('SELECT * FROM ?',[data]);
	}
	
	getRadioListByCategory(cat) {
		var data = JSON.parse(localStorage.getItem('data_radios'));
		return alasql('SELECT * FROM ? WHERE category = ?',[data, cat]);
	}
	
	getRadioListByGenre(genre) {
		var data = JSON.parse(localStorage.getItem('data_radios'));
		return alasql('SELECT * FROM ? WHERE genre LIKE ?',[data, '%' + genre + '%']);
	}
	
	getRadioListByName(name) {
		var data = JSON.parse(localStorage.getItem('data_radios'));
		return alasql('SELECT * FROM ? WHERE name LIKE ?',[data, '%'+ name + '%']);
	}

	getRadioListCategories(cat) {
		var data = JSON.parse(localStorage.getItem('data_radios'));
		return alasql('SELECT DISTINCT category FROM ? ORDER BY category ASC',[data]);
	}

	getRadioListGenres(cat) {
		var data = JSON.parse(localStorage.getItem('data_radios'));
		var res = alasql('SELECT DISTINCT genre FROM ? ORDER BY genre ASC',[data]);
		var genres = [];
		for (var value in res) {
			var split = res[value].genre.split(',');
			for (var value2 in split) {
				if (genres.indexOf(split[value2]) == -1) {
					genres.push(split[value2])
				}
			}
		}
		return genres;
	}

	resetStream() {
		if (this.player != null){
			this.player.unload();
			this.player = null;
			this.is_playing = false;
		}
	}
	
	playStream(radioItem) {
		radioItem.state = 1;
		localStorage.setItem('data_radio', JSON.stringify(radioItem));
		this.resetStream()
		this.player = new Howl({
			src: radioItem.streamurl,
			volume: (this.getVolume()),
			html5: true,
			format: ['mp3', 'aac', 'ogg']
		});
		this.is_playing = true;
		this.player.play();
	}
	
	stopStream() {
		var radioItem = JSON.parse(localStorage.getItem('data_radio'));
		this.player.stop();
		this.is_playing = false;
		radioItem.state = 0;
		localStorage.setItem('data_radio', JSON.stringify(radioItem));
	}
	
	pauseStream() {
		if(this.is_playing == true) {
			this.is_playing = false;
			this.player.pause();
		}else{
			this.is_playing = true;
			this.player.play();
		}
	}
	getVolume() {
		var vol = localStorage.getItem('player_volume');
		if (vol == null) {
			return 1;
		}else{
			return vol;
		}
	}
	
	streamVolume(value) {
		if(value > 1) {
			value = 1;
		}else if(value < 0) {
			value = 0;
		}
		if(this.player != null) {
			this.player.volume(value);
		}
		localStorage.setItem('player_volume', value);
	}
}
declare var SC:any;
declare var google: any;
declare var $: any;

var cWeather;
var pageheader = $("#page-header")[0];
var pagecontainer = $("#page-container")[0]; 

//var imgSelector : HTMLInputElement = <HTMLInputElement> $("#my-file-selector")[0];
var refreshbtn = $("#refreshbtn")[0];

var ac = new google.maps.places.Autocomplete(document.getElementById('location-autocomplete'));
google.maps.event.addListener(ac, 'place_changed', function () {
    var place = ac.getPlace();
    if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
    }
    console.log("Place Selected");
    getData(place);
});


class Weather {
    name: string;
    icon: string;
    constructor(public weathername, public iconurl) {
        this.name = weathername;
        this.icon = iconurl;
    }
}


function getData(place) {
    console.log("Getting Place Data");
    var cityName = place.address_components[3].long_name;
    var units = 'metric';
    var appId = '6c69b96b52f88bd394675c9785644a3e';
    var url = 'http://api.openweathermap.org/data/2.5/forecast'
    var request = $.ajax({
        url: url,
        dataType: "jsonp",
        data: { q: cityName, appid: appId, units: units },
        jsonpCallback: "fetchData",
        type: "GET"
    }).fail(function (error) {
        console.error(error)
        alert('Error sending request')
    })
}

function fetchData(forecast) {

    var sun: Weather = new Weather("Sunny", "http://megaicons.net/static/img/icons_sizes/8/178/512/weather-sun-icon.png");
    var rain: Weather = new Weather("Rainy", "https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/512/rain.png");
    var cloud: Weather = new Weather("Cloudy", "https://pixabay.com/static/uploads/photo/2013/04/01/09/22/clouds-98536_960_720.png");
    var snow: Weather = new Weather("Snowy", "http://downloadicons.net/sites/default/files/heavy-snow-icon-23780.png");
    var wind: Weather = new Weather("Windy", "https://cdn3.iconfinder.com/data/icons/weather-icons-8/512/weather-windy-512.png");

    var weatherdata, currentWeather;
    console.log("Place data collected (shown below)");
    console.log(forecast)
    forecast.list.forEach(function (forecastEntry, index, list) {
        weatherdata = forecastEntry.weather[0];
    })

    if (weatherdata.id > 956 || weatherdata.id == 900 || weatherdata.id == 905 || weatherdata.id == 781) {
        currentWeather = wind;
    } else if ((weatherdata.id > 600 && weatherdata.id < 623) || weatherdata.id == 906) {
        currentWeather = snow;
    } else if (weatherdata.id == 800 || weatherdata.id == 801 || weatherdata.id == 904 || (weatherdata.id > 950 && weatherdata.id < 957)) {
        currentWeather = sun;
    } else if (weatherdata.id < 600 || weatherdata.id == 901 || weatherdata.id == 902) {
        currentWeather = rain;
    } else {
        currentWeather = cloud;
    }
    
    cWeather = currentWeather;
    console.log("Selected currentWeather (shown below)");
    console.log(currentWeather);

    pageheader.innerHTML = "The weather is: " + currentWeather.weathername;

    var img: HTMLImageElement = <HTMLImageElement>$("#selected-img")[0];
    img.src = currentWeather.icon;
    img.style.display = "block";

    refreshbtn.style.display = "inline";

    pagecontainer.style.marginTop = "20px";

    loadSong(currentWeather);

}


class Song {
    title: string;
    url: string;
    constructor(songtitle: string, songurl: string) {
        this.title = songtitle;
        this.url = songurl;
    }
}


refreshbtn.addEventListener("click", function () {
    loadSong(cWeather);
});

class Playlist {
    sun: Song[];
    cloud: Song[];
    rain: Song[];
    wind: Song[];
    snow: Song[];

    constructor() {
        this.sun = [];
        this.cloud = [];
        this.rain = [];
        this.wind = [];
        this.snow = [];
    }

    addSong(weather: string, song: Song): void {
        if (weather === "sun") {
            this.sun.push(song);
        } else if (weather === "cloud") {
            this.cloud.push(song);
        } else if (weather === "rain") {
            this.rain.push(song);
        } else if (weather === "wind") {
            this.wind.push(song);
        } else if (weather === "snow") {
            this.snow.push(song);
        } 
    }

    getRandSong(weather: Weather): Song {
        var returnSong;
        var randNum = Math.floor(Math.random() * 3);
        console.log("getRandSong executed on playlist...");
        console.log(this);
        console.log(weather.name);
        if (weather.name == "Sunny") { 
            returnSong = this.sun[randNum];
        } else if (weather.name == "Cloudy") {
            returnSong = this.cloud[randNum];
        } else if (weather.name == "Rainy") {
            returnSong = this.rain[randNum];
        } else if (weather.name == "Windy") {
            returnSong = this.wind[randNum];
        } else /*if (weather.name == "Snowy") */{
            returnSong = this.snow[randNum];
        }
        console.log("song to be returned");
        console.log(returnSong);
        return returnSong;
    }
}

var myPlaylist : Playlist;

function init() : void {
    // init playlist
    myPlaylist = new Playlist();

    myPlaylist.addSong("sun", new Song("California Gurls", "https://soundcloud.com/katyperry/california-gurls-feat-snoop"));
    myPlaylist.addSong("sun", new Song("Walking on Sunshine", "https://soundcloud.com/katrina-and-the-waves/walking-on-sunshine-25th-anniversary-edition"));
    myPlaylist.addSong("sun", new Song("You are my Sunshine", "https://soundcloud.com/capj1970-2/bob-dylan-and-johnny-cash-you"));
    myPlaylist.addSong("rain", new Song("She will be loved", "https://soundcloud.com/maroon-5/she-will-be-loved-radio-mix"));
    myPlaylist.addSong("rain", new Song("Singing in the Rain", "https://soundcloud.com/luan-jobs/singing-in-the-rain-frank"));
    myPlaylist.addSong("rain", new Song("A Hard Rain's A-Gonna Fall", "https://soundcloud.com/bobdylan/a-hard-rains-a-gonna-fall"));
    myPlaylist.addSong("wind", new Song("Blowing in the Wind", "https://soundcloud.com/tummeng_090/peter-paul-and-mary-blowing-in"));
    myPlaylist.addSong("wind", new Song("Wind Beneath My Wings", "https://soundcloud.com/bettemidler/wind-beneath-my-wings-1"));
    myPlaylist.addSong("wind", new Song("Bohemian Rhapsody", "https://soundcloud.com/queen-69312/bohemian-rhapsody-remastered-1"));
    myPlaylist.addSong("snow", new Song("Snow (Hey Oh)", "https://soundcloud.com/red-hot-chili-peppers-official/snow-hey-oh"));
    myPlaylist.addSong("snow", new Song("Let It Snow", "https://soundcloud.com/ladyantebellum/let-it-snow-let-it-snow-let-it"));
    myPlaylist.addSong("snow", new Song("Winter Wonderland", "https://soundcloud.com/michaelbuble/winter-wonderland-bonus-track"));
    myPlaylist.addSong("cloud", new Song("California Gurls", "https://soundcloud.com/katyperry/california-gurls-feat-snoop"));
    myPlaylist.addSong("cloud", new Song("She will be loved", "https://soundcloud.com/maroon-5/she-will-be-loved-radio-mix"));
    myPlaylist.addSong("cloud", new Song("Bohemian Rhapsody", "https://soundcloud.com/queen-69312/bohemian-rhapsody-remastered-1"));

    // init soundcloud
    initSC();
}

function loadSong(currentWeather: Weather): void {
    console.log("loadSong method executed with currentWeather as");
    console.log(currentWeather)
    var songSelected: Song = myPlaylist.getRandSong(currentWeather);
    console.log("Song selected");
    console.log(songSelected);
    var track_url : string = songSelected.url; 

    $("#track-name")[0].innerHTML = "This seems like an appropriate track: " + songSelected.title;
    $("#track-name")[0].style.display = "block";
    $("#musicplayer")[0].style.display = "block";

    loadPlayer(track_url);
}

var myClientId = "8f2bba4a309b295e1f74ee38b8a5017b";

function initSC() : void {
    SC.initialize({
        client_id: myClientId
    });
}

function loadPlayer(trackurl : string) : void {
    SC.oEmbed(trackurl, { auto_play: true }).then(function (oEmbed) {
        var div = $("#musicplayer")[0]; 
        div.innerHTML = oEmbed.html;
    });
}

init();

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.7";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
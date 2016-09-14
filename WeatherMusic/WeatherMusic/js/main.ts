declare var SC:any;

var currentWeather: Weather;
declare var $: any;


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
    updateWeather(place);
    changeUI();
    loadSong(currentWeather);
});


class Weather {
    name: string;
    icon: string;
    constructor(public mood, public iconurl) {
        this.name = mood;
        this.icon = iconurl;
    }
}


var sun: Weather = new Weather("Sunny", "http://megaicons.net/static/img/icons_sizes/8/178/512/weather-sun-icon.png");
var rain: Weather = new Weather("Rainy", "https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/512/rain.png");
var cloud: Weather = new Weather("Cloudy", "https://pixabay.com/static/uploads/photo/2013/04/01/09/22/clouds-98536_960_720.png");
var snow: Weather = new Weather("Snowy", "http://downloadicons.net/sites/default/files/heavy-snow-icon-23780.png");
var wind: Weather = new Weather("Windy", "https://cdn3.iconfinder.com/data/icons/weather-icons-8/512/weather-windy-512.png");


function updateWeather(place: any) {

    var weatherdata;

    var lat = place.geometry.location.lat;
    var lon = place.geometry.location.lon;
    var htmlString = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&APPID=6c69b96b52f88bd394675c9785644a3e";

    loadJSON(htmlString, function (data) {
        weatherdata = data;
    });

    getWeather(weatherdata);

}

function getWeather(weatherdata) {

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

}


function changeUI(): void {

    pageheader.innerHTML = "The weather is: " + currentWeather.name;

    var img: HTMLImageElement = <HTMLImageElement>$("#selected-img")[0];
    img.src = currentWeather.icon;
    img.style.display = "block";

    refreshbtn.style.display = "inline";

    pagecontainer.style.marginTop = "20px";
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
    loadSong(currentWeather);
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

    getRandSong(weather: string): Song {
        if (weather === "sun") { 
            return this.sun[Math.floor(Math.random() * this.sun.length)];
        } else if (weather === "cloud") {
            return this.cloud[Math.floor(Math.random() * this.cloud.length)];
        } else if (weather === "rain") {
            return this.rain[Math.floor(Math.random() * this.rain.length)];
        } else if (weather === "wind") {
            return this.wind[Math.floor(Math.random() * this.wind.length)];
        } else if (weather === "snow") {
            return this.snow[Math.floor(Math.random() * this.snow.length)];
        }
    }
}


/*
imgSelector.addEventListener("change", function () {
    pageheader.innerHTML = "Please wait while I determine the current weather";
    processImage(function (file) {

        sendEmotionRequest(file, function (emotionScores) {
            
            currentWeather = getCurrMood(emotionScores); 
            changeUI();

            loadSong(currentWeather);
            
        });
    });
});*/


/*
function processImage(callback) : void {
    var file = imgSelector.files[0];
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
    } else {
        console.log("Invalid file");
    }
    reader.onloadend = function () { 
        
        if (!file.name.match(/\.(jpg|jpeg|png)$/)){
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        } else {
            callback(file);
        }
    }
}
*/


function sendEmotionRequest(file, callback): void {
    
    $.ajax({
        url: htmlString,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "d342c8d19d4e4aafbf64ed9f025aecc8");
        },
        type: "json",
        data: file,
        processData: false
    })
        .done(function (data) {
            if (data.length != 0) { 
                var scores = data[0].scores;
                callback(scores);
            } else {
                pageheader.innerHTML = "Hmm, we can't detect that location. Try another?";
            }
        })
        .fail(function (error) {
            pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
            console.log(error.getAllResponseHeaders());
        });
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

function loadSong(currentWeather : Weather) : void {
    var songSelected : Song = myPlaylist.getRandSong(currentWeather.name);
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
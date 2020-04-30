<template>
 <!--jos lämpö on määritelty ja se on yli 16 astetta käytä lämmintä taustakuvaa (oletus kylmä) -->
    <div id="app" :class="typeof weather.main != 'undefined' && weather.main.temp > 16 ? 'warm' :'' ">     
        <main>
            <div class="search-box">
                <input type="text" class="search-bar" placeholder="Search..." v-model="query" @keypress="fetchWeather" />
                <!-- Enterin painallus -> fetchWeather (hae säätiedot) -->
            </div>
            <div class="weather-wrap" v-if="typeof weather.main != 'undefined'">
                <!-- näytä jos tiedot on saatu haettua -->
                <div class="location-box">
                    <div class="location">{{ weather.name }}, {{ weather.sys.country }}</div>
                    <!-- haetaan paikan nimi ja maatunnus -->
                    <div class="date">{{ dateBuilder(0) }}</div>
                    <!-- haetaan nykyinen päivä dateBuilder( {+nykyinen päivä} ) -->
                </div>
                <div class="weather-box">
                    <div class="temp-container">
                        <div class="temp">{{Math.round(weather.main.temp)}} °C </div>
                        <!--haetaan lämpötila ja pyöristetään se-->
                    </div>
                    <div class="weather-icon-wrapper">
                        <div><img :src="'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'" class="weather-icon" /></div>
                        <div class="weather">{{weather.weather[0].description}}</div>
                    </div>
                    <div class="weather-small-icons-container">
                        <div><img src="./assets/wind.svg" class="weather-small-icons">
                            <span>{{weather.wind.speed}} ms/s</span>
                            <!--haetaan tuulen nopeus-->
                        </div>
                        <div><img src="./assets/windDir.svg" class="weather-small-icons">
                            <span>{{weather.wind.deg}} °</span>
                        </div>
                        <div><img src="./assets/humidity.svg" class="weather-small-icons">
                            <span>{{weather.main.humidity}} %</span>
                        </div>
                    </div>
                    
                </div>
                <!--haetaan tulevien päivien ennusteet-->
                <div class="forecast-container">
                    <div class="forecast">
                        <div class="weekday">{{ getWeekday(1) }}</div> <!--haetaan viikonpäivä getWeekday funkiosta parametrina + x päivää -->
                        <div><img :src="'http://openweathermap.org/img/wn/' + fcDay1Icon + '@2x.png'" class="forecast-icon" /></div>
                        <div>{{Math.round(fcDay1Temp)}} °C</div>
                    </div>
                    <div class="forecast">
                        <div class="weekday">{{ getWeekday(2) }}</div>
                        <div><img :src="'http://openweathermap.org/img/wn/' + fcDay2Icon + '@2x.png'" class="forecast-icon" /></div>
                        <div>{{Math.round(fcDay2Temp)}} °C</div>
                    </div>
                    <div class="forecast">
                        <div class="weekday">{{ getWeekday(3) }}</div>
                        <div><img :src="'http://openweathermap.org/img/wn/' + fcDay3Icon + '@2x.png'" class="forecast-icon" /></div>
                        <div>{{Math.round(fcDay3Temp)}} °C</div>
                    </div>
                    <div class="forecast">
                        <div class="weekday">{{ getWeekday(4) }}</div>
                        <div><img :src="'http://openweathermap.org/img/wn/' + fcDay4Icon + '@2x.png'" class="forecast-icon" /></div>
                        <div>{{Math.round(fcDay4Temp)}} °C</div>
                    </div>
                    <div class="forecast">
                        <div class="weekday">{{ getWeekday(5) }}</div>
                        <div><img :src="'http://openweathermap.org/img/wn/' + fcDay5Icon + '@2x.png'" class="forecast-icon" /></div>
                        <div>{{Math.round(fcDay5Temp)}} °C</div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    export default {
        name: "App",
        data() {
            return {
                api_key: '4c7f4df00e9c24b4af86437c3b71e09b', //apiKey
                url_base: 'https://api.openweathermap.org/data/2.5/', //osoitteen alku
                query: '', //paikkakunta
                weather: {},
                forecast: {},
                // lon: '',
                // lat: '',
                fcDay1Temp: '', //forecast day+1temp
                fcDay1Icon: '', //forecast day+1icon
                fcDay2Temp: '',
                fcDay2Icon: '',
                fcDay3Temp: '',
                fcDay3Icon: '',
                fcDay4Temp: '',
                fcDay4Icon: '',
                fcDay5Temp: '',
                fcDay5Icon: '',
                windDeg: ''
            }
        },
        methods: {
            fetchWeather(e) {
                if (e.key == "Enter") { // kun on painettu Enteriä
                    //noudetaan syöte
                    fetch(`${this.url_base}weather?q=${this.query}&units=metric&lang=fi&APPID=${this.api_key}`) //https://developers.google.com/web/updates/2015/03/introduction-to-fetch   --  https://blog.logrocket.com/axios-or-fetch-api/
                        .then(res => {
                            return res.json();
                        }).then(this.setResults);
                }
            },
            setResults(results) {
                this.weather = results;
                this.forecast = this.getForecast(); //"laukaistaan" getForecast funktio.
                this.windDeg = this.weather.wind.deg; //haetaan tuulensuunta muuttujaan
            },
            //haetaan ennuste
            getForecast() {
                fetch(`${this.url_base}forecast?q=${this.query}&units=metric&lang=fi&APPID=${this.api_key}`)
                    .then(res => {
                        return res.json();
                    }).then(this.setForecastResults);
            },
            //asetetaan tulokset muuttujiin.
            setForecastResults(forecastResult) {
                this.forecast = forecastResult;
                console.log('this.forecast' + this.forecast);
                this.fcDay1Temp = ''; //forecast day+1 (12:00) temp
                this.fcDay1Icon = this.forecast.list[0].weather[0].icon; //päivän tarkastus//  + ' ' + this.forecast.list[0].dt_txt;
                this.fcDay1Temp = this.forecast.list[0].main.temp;
                this.fcDay2Icon = this.forecast.list[8].weather[0].icon; //päivän tarkastus// + ' ' + this.forecast.list[8].dt_txt;
                this.fcDay2Temp = this.forecast.list[8].main.temp;
                this.fcDay3Icon = this.forecast.list[16].weather[0].icon; //päivän tarkastus// + ' ' + this.forecast.list[16].dt_txt;
                this.fcDay3Temp = this.forecast.list[16].main.temp;
                this.fcDay4Icon = this.forecast.list[24].weather[0].icon; //päivän tarkastus// + ' ' + this.forecast.list[24].dt_txt;
                this.fcDay4Temp = this.forecast.list[24].main.temp;
                this.fcDay5Icon = this.forecast.list[32].weather[0].icon; //päivän tarkastus// + ' ' + this.forecast.list[32].dt_txt;
                this.fcDay5Temp = this.forecast.list[32].main.temp;
            },
            //
            dateBuilder(plusXDays) {
                let d = new Date();
                let months = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];
                let days = ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"];
                let day = days[d.getDay() + plusXDays];
                let date = d.getDate() + plusXDays;
                let month = months[d.getMonth() + plusXDays];
                let year = ""; //d.getFullYear();
                return `${day}  ${date} ${month} ${year}`;
            },
            //Muodostetaan viikonpäivien lyhenteet ennusteita varten
            getWeekday(plusXDays) {
                let d = new Date();
                let weekdays = ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"];
                let weekday = weekdays[(d.getDay() + plusXDays) % weekdays.length]; //rullataan listaa läpi kun se loppuu.
                return `${weekday}`;
            }
        }
    }
</script>





<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font-family: "montserrat", "sans-serif";
        max-width: 600px;
        min-width: 350px;
        /* ruudun maksimileveys, huomio openweathermapista saatavan iconin koko rajoittaa tätä(menee mössöksi)*/
    }
    #app {
        background-image: url("./assets/cold.png");
        /* kuva kun lämpötila alle 16 astetta tai undefined*/
        background-size: cover;
        background-position: bottom;
        transition: 0.4s;
    }
    #app.warm {
        background-image: url("./assets/aurinko.png")/* kuva kun lämpötila yli 16 astetta*/
    }
    main {
        min-height: 100%;
        padding: 25px;
        background-image: linear-gradient( to bottom, rbga(0, 0, 0, 0.25) rgpa(0, 0, 0, 0.75));
    }
    .search-box {
        width: 100%;
        margin-bottom: 5px;
    }
    .search-box .search-bar {
        display: block;
        width: 100%;
        padding: 15px;
        color: #313131;
        font-size: 20px;
        appearance: none;
        border: none;
        outline: none;
        background: none;
        box-shadow: 0px, 0px, 8px rgba(0, 0, 0, 0, 25);
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 0px 16px 0px 16px;
        transition: 0.4s;
    }
    .search-box .search-bar:focus {
        box-shadow: 0px, 0px, 16px rgba(0, 0, 0, 0, 25);
        background-color: rgba(255, 255, 255, 0.75);
        border-radius: 16px 0px 16px 0px;
    }
    .location-box .location {
        color: #fff;
        font-size: 32px;
        font-weight: 500;
        text-align: center;
        text-shadow: 1px, 3px rgba(0, 0, 0, 0.25);
    }
    .location-box .date {
        color: #fff;
        font-size: 20px;
        font-weight: 300;
        font-style: italic;
        text-align: center;
    }
    .weather-box {
        text-align: center;
    }
    .weather-wrap {
        background-color: rgba(255, 255, 255, 0.25);
        border-radius: 16px;
    }
    .weather-box .temp-container {
        display: inline-block;
    }
    .weather-box .temp {
        display: inline-block;
        padding: 10px 25px;
        color: #fff;
        font-size: 800%;
        font-weight: 900;
        text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
        background-color: rgba(255, 255, 255, 0.25);
        border-radius: 16px;
        margin: 30px 0px;
        box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
    }
    .weather-box .weather {
        color: #fff;
        font-size: 250%;
        font-weight: 700;
        font-style: italic;
        text-shadow: rgba(0, 0, 0, 0.25);
        padding-bottom: 5%;
    }
    .weather-icon-wrapper {}
    .weather-icon {
        width: 50%;
        margin-top: -15%;
        margin-bottom: -15%;
    }
    .weather-small-icons-container {
        display: flex;
        justify-content: space-between;
        color: #fff;
        font-size: 150%;
        font-weight: 700;
        font-style: italic;
        text-shadow: 2px 3px rgba(0, 0, 0, 0.25);
        margin-top: 0%;
    }
    .weather-small-icons {
        margin-top: 0%;
        margin-left: 15%;
        display: flex;
        /*  justify-content: space-between;*/
        height: 60%;
        width: 60%;
    }
    .forecast-container {
        /*visibility:hidden;*/
        display: flex;
        justify-content: space-between;
        /* margin-bottom: 2vw;
        margin-left: 0.5vw;
        margin-right: 0.5vw;
        padding-top: 1vw;
        padding-bottom: 1vw;*/
        /*  height:50px;*/
    }
    .forecast {
        display: inline-block;
        text-align: center;
        background-color: rgba(255, 255, 255, 0.25);
        border-radius: 16px;
        box-shadow: 1px 2px rgba(0, 0, 0, 0.25);
        color: #fff;
        font-size: 120%;
        font-weight: 700;
        text-shadow: 1.5px 1.5px rgba(0, 0, 0, 0.25);
        max-width: 100%;
    }
    .forecast-icon {
        max-width: 100%;
        /*height:100%;*/
    }
</style>

<template>
    <div class="forecast">
        <div class="weekday"> viikonpäivä</div>
        <div><img :src="'http://openweathermap.org/img/wn/' + fcDay5Icon + '@2x.png'" class="forecast-icon" /></div>
        <div>{{Math.round(fcDay5Temp)}} °C</div>
    </div>
</template>

<script>
export default {
  name: 'forecastTemplate',
  props: {
    getWeekday: String,
    fcDay5Temp: String,
    fcDay5Icon: String

  }
}
</script>


<style>



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
    border: 1px solid black;
}
</style>

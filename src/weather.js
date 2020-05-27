const request = require('request');
const chalk = require('chalk');

const getGeoCode = (location,callback) => {
    let url = (`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=pk.eyJ1IjoibWhkc2FmIiwiYSI6ImNrYWkyY2JrZTA2Yzgyc3MwZzh2cnRveG4ifQ.j1jbkXv8N_mdabWb_ZjYVA&limit=1`)
    request({url: url, json:true},(error,response) => {
        if(error){
            console.log(chalk.bold.red("Unable to fetch weather. Check your internet connection"));
        }else{
            const {features} = response.body;
            if(features==null || features.length==0){
                console.log(chalk.red("Unable to find location. Try another search"));     
            }else{
                callback(features[0].center[1], features[0].center[0], features[0].place_name);
            }
        }
    });
}

const getWeather = (latitude,longitude,loc) => {
    let url = (`http://api.weatherstack.com/current?access_key=cd3a15ad1eee388b410fe778dab262ed&query=${latitude},${longitude}`);
    request({url:url, json:true},(error, response) => {
        if(error){
            console.log(chalk.red("Unable to fetch weather. Check your internet connection"));
        }else if(response.body.success==false){
            console.log(chalk.red("Unable to find location. Try another search"));
        }
        else{
            const {weather_descriptions, temperature, feelslike} = response.body.current;
            console.log(chalk.blue(`Weather forecast in ${loc} is ${weather_descriptions[0]}. Currently ${temperature} degrees celcius, feels like ${feelslike} degrees celcius.`));
        }
    
    });    
}
let userLocation = process.argv[2];
if (typeof process.argv[2] == 'undefined') {
    console.log(chalk.red("Please insert a City name"));
} else {
    getGeoCode(userLocation,getWeather);   
}
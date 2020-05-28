const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('request')
var obj;

const app = express()
const port = process.env.PORT || 3000
//define paths for Express Configuration (static, views, partials)
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname,'../templates/views');
const partialsDirectoryPath = path.join(__dirname, '../templates/partials');
//Setup handlebars engine, cutomizing the views path, and configuring partials directory
app.set('view engine','hbs');
app.set('views',viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);
// Setup static directory
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        name: "Mohamed Safieddine",
        age: 20,
        status: "Student",
        title: "Welcome to the home page"
    });
});

app.get('/help',(req,res)=>{
    res.render('help',{
        title: "Welcome to the help page",
        name: "Wehbe"
    });
});

app.get('/about',(req,res)=>{
    res.render('about',{
        title: "Welcome to the about page",
        name: "Malka"
    });
});
app.get('/weather', (req, res) => {
    if (req.query.address) {
        getGeoCode(req.query.address,getWeather,res);
    } else {
        res.send({
            error: "You must provide an address"
        })
    }
})

app.get('/help/*',(req,res)=>{
    res.render('errorPage',{
        errorMessage: "Help document not found"
    });
});

app.get('*',(req,res)=>{
    res.render('errorPage',{
        errorMessage: "404, page not found"
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

const getGeoCode = (location,callback,res) => {
    let url = (`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=pk.eyJ1IjoibWhkc2FmIiwiYSI6ImNrYWkyY2JrZTA2Yzgyc3MwZzh2cnRveG4ifQ.j1jbkXv8N_mdabWb_ZjYVA&limit=1`)
    request({url: url, json:true},(error,response) => {
        if(error){
            obj = {
                status: false,
                msg: "Unable to fetch weather. Check your internet connection"
            }
            res.send(obj);
        }else{
            const {features} = response.body;
            if(features==null || features.length==0){
                obj = {
                    status: false,
                    msg: "Unable to find location. Try another search"
                }
                res.send(obj);     
            }else{
                callback(features[0].center[1], features[0].center[0], features[0].place_name,res);
            }
        }
    });
}

const getWeather = (latitude,longitude,loc,res) => {
    let url = (`http://api.weatherstack.com/current?access_key=cd3a15ad1eee388b410fe778dab262ed&query=${latitude},${longitude}`);
    request({url:url, json:true},(error, response) => {
        if(error){
            console.log("er");
            //console.log(chalk.red("Unable to fetch weather. Check your internet connection"));
            obj = {
                status: false,
                msg: "Unable to fetch weather. Check your internet connection"
            }
        }else if(response.body.success==false){
            
            obj = {
                status: false,
                msg: "Unable to find location. Try another search"
            }
        }
        else{
            const {weather_descriptions, temperature, feelslike, weather_icons, pressure, precip, wind_speed, wind_degree,observation_time, humidity, uv_index, visibility} = response.body.current;
            const {localtime} = response.body.location;
            console.log(localtime);
            //console.log(response.body);
            //console.log(chalk.blue(`Weather forecast in ${loc} is ${weather_descriptions[0]}. Currently ${temperature} degrees celcius, feels like ${feelslike} degrees celcius.`));
            obj = {
                status: true,
                location: loc,
                description: weather_descriptions[0],
                temperature: temperature,
                feelslike: feelslike,
                icon: weather_icons[0],
                pressure: pressure,
                country: response.body.location.country,
                region: response.body.location.region,
                degree: wind_degree,
                speed: wind_speed,
                humidity: humidity,
                index: uv_index,
                visibility: visibility,
                precip: precip,
                time: observation_time,
                localtime: localtime
            }
        }
        res.send(obj);
    });
}
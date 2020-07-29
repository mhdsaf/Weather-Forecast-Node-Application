$(document).ready(function(){
    const getData = (userInput) => {
        let obj;
        fetch(`/weather?address=${userInput}`).then((response)=>{
            console.log("fetching " + userInput);
        response.json().then((data)=>{
            if(data.status==false){
            }else{
                obj = {...data};
                printToScreen(obj);
            }});
        });
    }
    const printToScreen = (obj) => {
        //console.log("printing..");
        console.log("printing");
        $("#wicon").html(`<img src=${obj.icon}>`);
        $("#one").html(`Country: ${obj.country}, Region: ${obj.region}, Status: ${obj.description}, Observation Time: ${obj.time}`);
        $("#two").html(`Temperature: ${obj.temperature} &#x2103;, Feels Like: ${obj.feelslike} &#x2103;, Pressure: ${obj.pressure} MB`);
        $("#three").html(`Wind Speed: ${obj.speed} km/h, Wind Degree: ${obj.degree}&#176;`);
        $("#four").html(`Precipitation: ${obj.precip} MM, Humidity: ${obj.humidity}, Visibility: ${obj.visibility} km/h`);
        $(".myfc").show();
        $('html, body').animate({
            scrollTop: $("#explore").offset().top
        }, 1000);
    };
    $("#submit").click(function (e) { 
        e.preventDefault();
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position)=>{
                let obj = {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                }
                console.log(obj);
                fetch('/weather1',{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(obj)
                }).then((response)=>{
                    response.json().then((data)=>{
                        console.log(data);
                        printToScreen(data);
                    })
                });
            })
        }else{
            alert("Browser doesn't support geolocation");
        }
    });
    $("#submit1").click((e)=>{
        
        //alert('click');
        let userIN = "";
        e.preventDefault();
        let city = $("#cityName").val();
        let country = $("#countryName").val();
        if(!city && !country){
            alert("Input fields are empty. Make sure to fill them up then click Forecast");
            console.log("undef");
        }else{
            console.log("ok");
            console.log(city);
            if(city){
                userIN = city;
                sessionStorage.setItem('region',city);
            }
            if(country){
                sessionStorage.setItem('country', country);
                userIN = userIN + " " + country;
            }
            getData(userIN);
        }
    })
        let userIN1 = "";
        if(sessionStorage.getItem('country')){
            $("#countryName").val(sessionStorage.getItem('country'));
            userIN1 = sessionStorage.getItem('country');
        }
        if(sessionStorage.getItem('region')){
            $("#cityName").val(sessionStorage.getItem('region'));
            userIN1 = userIN1 + " " + sessionStorage.getItem('region');
        }
        if(userIN1!=""){
            getData(userIN1);
            console.log("hereeeee");
        }
        else{
            $(".myfc").hide();
        }
    
});
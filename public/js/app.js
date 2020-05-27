$(document).ready(function(){
    console.log('Client side javascript file is loaded!');
    $(".myfc").hide();
    $("#submit1").click((e)=>{
        let city = $("#cityName").val();
        let country = $("#countryName").val();
        if(!city && !country){
            alert("Input fields are empty. Make sure to fill them up then click Forecast");
        }else{
        $(".myfc").show();
        let obj;
        e.preventDefault();
        
        let userIn = (`${country} ${city}`);
        fetch(`http://localhost:3000/weather?address=${userIn}`).then((response)=>{
        response.json().then((data)=>{
            if(data.status==false){
                console.log(data.msg);
                obj = data.msg
            }else{
                //console.log(data);
                obj = {...data};
                console.log(obj);
            }      
                $("#wicon").html(`<img src=${obj.icon}>`);
                $("#one").html(`Country: ${obj.country}, Region: ${obj.region}, Status: ${obj.description}`);
                $("#two").html(`Temperature: ${obj.temperature} &#x2103;, Feels Like: ${obj.feelslike} &#x2103;, Pressure: ${obj.pressure} MB`);
                $("#three").html(`Wind Speed: ${obj.speed} km/h, Wind Degree: ${obj.degree}&#176;`);
                $("#four").html(`Precipitation: ${obj.precip} MM, Humidity: ${obj.humidity}, Visibility: ${obj.visibility} km/h`);
            });
        });}
    })
    
});
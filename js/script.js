$(document).ready(function(){
    var lat = 0, lon = 0;

    $(".search-box input").on("keyup", function(){
        $(".search-sugg").css('display', 'flex');
        $(".search-sugg").empty();
        var city = $(this).val();

        if (city. length === 0){
            $(".search-sugg").css('display', 'none');
            $(".search-sugg").empty();
        } 
        else
            $.getJSON("node_modules\\cities.json\\cities.json", 
                function (data) {  
                    var format = '';
                    // ITERATING THROUGH OBJECTS
                    $.each(data, function (key, value) {
                        if(value.name.toLowerCase().startsWith(city.toLowerCase())){
                            format += `<div class="sugg"> <span> ${value.name} </span>, ${value.country} </div>`;
                        }
                    });

                    $(".search-sugg").append(format);

                    //INSERTING ROWS INTO TABLE 
                    // $('#table').append(student);


                    $(".sugg").click(function(){
                        $(".search-box input").val($(this).children('span').text());
                        $(".search-sugg").empty();
                    })
                }
            );
    })

    $(".search-box button").click(function(){
        $(".search-sugg").css('display', 'none');
        const apikey = '9e60f87fc2d4aa6854b3796287d81647';
        const city = $(".search-box input").val();

        if(city === '')
            return;
        
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apikey}`).then(res => res.json()).then(json => {       
            lat = json[0].lat;
            lon = json[0].lon;
        });

        setTimeout(function(){
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`).then(res => res.json()).then(json => {

                if(json.cod == '404'){
                    $('.container').css('height', "400px");
    
                    $(".weather-box").css('display', 'none');
                    $(".weather-details").css('display', 'none');
    
                    $(".not-found").css('display', 'block');
                    $(".not-found").addClass('fadeIn');
                    return;
                }
            
                console.log(json)
    
                $(".not-found").css('display', 'none');
                $(".not-found").removeClass('fadeIn');
            
                const image = document.querySelector('.weather-box img');
                const temperature = document.querySelector('.weather-box .temperature');
                const description = document.querySelector('.weather-box .description');
                const humidity = document.querySelector('.weather-details .humidity .text span');
                const wind = document.querySelector('.weather-details .wind .text span');
    
                switch (json.weather[0].main) {
                    case 'Clear':
                        image.src = 'images/clear.png';
                        break;
    
                    case 'Rain':
                        image.src = 'images/rain.png';
                        break;
    
                    case 'Snow':
                        image.src = 'images/snow.png';
                        break;
    
                    case 'Clouds':
                        image.src = 'images/cloud.png';
                        break;
    
                    case 'Haze':
                        image.src = 'images/mist.png';
                        break;
    
                    default:
                        image.src = '';
                }
    
                temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
    
                $('.weather-box').css('display', 'block');
                $('.weather-details').css('display', 'flex');
                $('.weather-box').addClass('fadeIn');
                $('.weather-details').addClass('fadeIn');
    
                $('.container').css('height', "592px");
            })
        }, 1000)
            
        

    })

    setInterval(function(){
        if($(".search-box input").val().lenght === 0){
            $('.container').css('height', "400px");
    
            $(".weather-box").css('display', 'none');
            $(".weather-details").css('display', 'none');
            
            $(".not-found").css('display', 'block');
            $(".not-found").addClass('fadeIn');
        }
    }, 250)
})

const apiKey = '4631e1ba118978790699c0b85f4d3bcb';

// search data by city

function getWeather(city){
 
  const weatherApiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
 Promise.all([fetch(weatherApiUrl),fetch(forecastApiUrl)])
 
 
  .then(async([weatherResponse,forecastResponse])=>{
    const weatherData=await weatherResponse.json();
    const forecastData=await forecastResponse.json();
    if(weatherData.cod===200&& forecastData.cod==='200'){
      displayWeather(weatherData);
      displayForecast(forecastData);
      
    }else{
      document.getElementById("weather").innerHTML=`<p>${weatherData.message}</p>`;

    }
  })
  .catch(error=>{
    console.error( error);
    document.getElementById('weather').innerHTML = '<p>Error occurs while fetching weather data</p>';
  });
  
}

function displayWeather(weatherData){
  const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  const weatherElement=document.getElementById("weather");
  const{main,name,weather,wind}=weatherData;
  weatherElement.innerHTML=`
  <h2 class="text-2xl underline font-bold">${name}</h2>
  <div>
   <img src="${weatherIconUrl}" class="items-right">
  <p class="text-lg ">${weather[0].description}</p>
  </div>
  
   <p class="text-lg">Temperature:${main.temp}°C</p>
    <p class="text-lg">Humidity:${main.humidity}%</p>
     <p class="text-lg">Wind:${wind.speed} m/s</p>
  `;

}

// forecast data
function displayForecast(forecastData){
  
  const forecastElement=document.getElementById("forecast");
  forecastElement.innerHTML = '';
 
  let forecastHTML='<h3 class="text=xl font-semibold">5-Day Forecast:</h3>  <div class="flex flex-wrap justify-center">';
 
  forecastData.list.forEach((entry,index)=>{
  if(index%8===0){
    forecastHTML+=`
    <div class="m-2 p-4 bg-blue-400 rounded-lg">
     <p>${new Date(entry.dt_txt).toLocaleDateString()}</p>
      <p>${entry.weather[0].description}</p>
       <p>Temp:${entry.main.temp}°C</p>
        
       </div>
    `;
  }
 });
forecastHTML+='</div>';
forecastElement.innerHTML=forecastHTML;


}

//curent location search
function getWeatherLocation (lat,lon){
  const apiUrl= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
  .then(response=>response.json())
  .then(data=>{
    if(data.cod===200){
      displayWeather(data);

    }else{
      document.getElementById("weather").innerHTML=`<p>${data.message}</p>`;

    }
  }).catch(error=>{
    console.error(error);
    document.getElementById("weather").innerHTML='<p>Error occurs while fetching weather data</p>';

  });
}

//current location
document.getElementById("currLocation").addEventListener("click",()=>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>{
      const{latitude,longitude}=position.coords;
      getWeatherLocation(latitude,longitude);
    },(error)=>{
     if(error.code===error.PERMISSION_DENIED){
      handleError('Location access denied.');
     }
    });
    }else{
handleError('unable to retrive the location');
    }
  
});

//recent city to save in dropdown
function addToRecentCities(city){
  let recentCities=JSON.parse(localStorage.getItem('recentCities'))|| [];
  if(!recentCities.includes(city)){
    recentCities.unshift(city);
    if(recentCities.length>5){
      recentCities.pop();
    }
    localStorage.setItem("recentCities",JSON.stringify(recentCities));
    updateRecentCitiesDropdown();
  }

};
function updateRecentCitiesDropdown(){
  const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  const recentCitiesList=document.getElementById("recentCitiesList");
  recentCitiesList.innerHTML='';
  if(recentCities.length>0){
    recentCitiesList.classList.remove('hidden');
    recentCities.forEach(city=>{
      const cityItem=document.createElement('li');
      cityItem.classList.add('p-2','hover:bg-gray-200', 'cursor-pointer');
      cityItem.addEventListener("click",()=>getWeather(city));
      recentCitiesList.appendChild(cityItem);
    });
  }else{
    recentCitiesList.classList.add('hidden');
  }
}

document.getElementById('recentCitiesDropdown').addEventListener('click',()=>{
  const recentCitiesList=document.getElementById('recentCitiesList');
  recentCitiesList.classList.toggle('hidden');
});

window.onload = () => {
  updateRecentCitiesDropdown();
};
//adding event listner to search button
document.addEventListener('DOMContentLoaded',()=>{
  const weatherForm=document.getElementById("weatherForm");
weatherForm.addEventListener('submit',(event)=>{
  event.preventDefault();
  const cityInput=document.getElementById('cityInput').value.trim();
  if (validateCityInput(cityInput)) {
    getWeather(cityInput);
  }
});
const currentLocationBtn= document.getElementById("currLocation");
currentLocationBtn.addEventListener("click",()=>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>{
      const{latitude,longitude}=position.coords;
      getWeatherLocation(latitude,longitude);
    },()=>{
      alert('cant access your location');
    });
    }else{
alert('Allow location to access current location to your system.');
    }
  
});

const recentCitiesBtn=document.getElementById('recentCitiesDropdown');
recentCitiesBtn.addEventListener('click',()=>{
  document.getElementById('recentCitiesList')
  .classList.toggle('hidden');
});

});


//validation of city input
function validateCityInput(city){
  const cityPattern=/^[a-zA-Z\s]+$/;
  if(!city){
    alert('enter city ');
    return false;
  }
  if(!cityPattern.test(city)){
    alert('Invalid city ')
    return false
  }
  return true;
}







// // by default showing data of London
getWeather("London");
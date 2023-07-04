const apiKey = "1a86915a1d81ccb0d99ef96710aaa45f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector(".search input");
const weatherIcon = document.querySelector(".weather-icon");
const weather = document.querySelector(".weather");
const errorText = document.querySelector(".error");

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    // 13 is the key code for Enter
    event.preventDefault();
    submitCityInput();
  }
}

async function submitCityInput() {
  weather.style.display = "none";
  errorText.style.display = "none";
  let city = searchBox.value;
  await getWeather(city);
  searchBox.value = "";
}

async function getWeather(city) {
  const locUrl =
    "https://foreca-weather.p.rapidapi.com/location/search/" + city;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "4915662b35msh1656c40df44209dp138ef9jsn12685ffb4994",
      "X-RapidAPI-Host": "foreca-weather.p.rapidapi.com",
    },
  };

  let locResponse;
  let locData;
  let location;
  try {
    locResponse = await fetch(locUrl, options);
    locData = await locResponse.json();
    console.log(locData);
    if (locData.locations.length == 0) {
      displayErrorMessage("Invalid City Name");
      return;
    }
    location = locData.locations[0];
    city = location.name;
  } catch (error) {
    displayErrorMessage("Some error occurred while fetching");
    return;
  }

  const weatherUrl =
    "https://foreca-weather.p.rapidapi.com/current/" +
    location.id +
    "?alt=0&tempunit=C&windunit=KMH";

  let weatherResponse;
  let weatherData;
  try {
    weatherResponse = await fetch(weatherUrl, options);
    weatherData = await weatherResponse.json();
    weatherData = weatherData.current;
  } catch (error) {
    displayErrorMessage("Some error occurred while fetching");
    return;
  }

  weatherIcon.src =
    "https://developer.foreca.com/static/images/symbols/" +
    weatherData.symbol +
    ".png";

  document.querySelector(".weather-description").innerHTML =
    capitalizeFirstLetter(weatherData.symbolPhrase);
  document.querySelector(".city").innerHTML = city;
  document.querySelector(".temp").innerHTML =
    Math.round(weatherData.temperature) + "°c";
  document.querySelector(".humidity").innerHTML =
    weatherData.relHumidity + " %";
  document.querySelector(".wind").innerHTML = weatherData.windSpeed + " km/h";

  weather.style.display = "block";
  errorText.style.display = "none";
}

function displayErrorMessage(message) {
  errorText.innerHTML = message;
  errorText.style.display = "block";
  weather.style.display = "none";
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

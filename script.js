function createElements(tag, attributes = {}, content = "") {
  const tagElement = document.createElement(tag);
  tagElement.innerHTML = content;
  // console.log(tag,attributes,content)
  Object.entries(attributes).forEach((entry) => {
    const [attributesKey, attributesValues] = entry;
    tagElement.setAttribute(attributesKey, attributesValues);
  });

  return tagElement;
}

const bodyContainer = createElements("div", { id: "main-container" });
document.body.append(bodyContainer);
const contentContainer = createElements("div", { class: "container" });
bodyContainer.append(contentContainer);
const countryCardContainer = createElements("div", {
  class: "row",
  id: "country-container",
});
contentContainer.append(countryCardContainer);
const title = createElements(
  "h1",
  { id: "title", class: "text-center" },
  "weather website"
);
contentContainer.append(title);

const countryJsonData = fetch("https://restcountries.com/v3.1/all");
countryJsonData.then((res) => res.json()).then((data) => displayContries(data));

function displayContries(data) {
  data.forEach((country) => {
    const countryCard = createElements(
      "div",
      { class: "col-sm-6 col-md-4 col-lg-4 col-xl-4  ", id: "col-container" },
      countryDetails(country)
    );
    countryCardContainer.append(countryCard);
  });
}

function countryDetails(country) {
  return `
    <div class="card h-100">
        <div class="card-header">
            <h4 class="card-title p-2">${country.name.common}<h4>
        </div>
        <div class="card-body">
          <div class="img-con mb-4 h-20">
            <img src="${country.flags.png}" class="card-img-top" atl="country-flag">
          </div>
          <div class="card-text text-center">
            <span class="card-text">Capital:${country.capital}</span><br>
            <span class="card-text">Region:${country.region}</span><br>
            <span class="card-text">Country Code:${country.flag}</span><br>
          </div>
          <div class="d-flex justify-content-center">
            <div class="m-4" id="button">
              <button type="submit" class="btn btn-primary fetch-weather mb-3" data-country="${country.name.common}">Click for Weather</button> <hr>
              <div class="span-3 text-center" py-2"  id="${country.name.common}-weather"> </div>
            </div>
            </div>
        </div>
    </div>
  `;
}

const weather_api_key = "0faa48242c4123135fbafee5e0f226a7";
const weather_api_url = "https://api.openweathermap.org/data/2.5/weather";

// Add an event listener for the "Fetch Weather" buttons
document.addEventListener("click", (name) => {
  if (name.target && name.target.classList.contains("fetch-weather")) {
    const countryName = name.target.getAttribute("data-country");
    fetchWeatherData(countryName);
  }
});

function fetchWeatherData(countryName) {
  const weatherApiUrl = `${weather_api_url}?q=${countryName}&appid=${weather_api_key}&units=metric`;

  fetch(weatherApiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Process and display weather data
      weather_content(countryName, data);
    })
    .catch((error) => {
      weather_content(countryName, { error: "Temperature not updated" });
    });
}
function weather_content(countryName, weatherData) {
  const weatherDiv = document.getElementById(`${countryName}-weather`);

  if (weatherDiv) {
    if (weatherData && weatherData.main) {
      weatherDiv.innerHTML = `
          <p>Temperature: ${Math.round(weatherData.main.temp)}°C</p>
          <p> wind: ${weatherData.wind.speed}km/h</p>
          <p> humidity: ${weatherData.main.humidity}%</p>
          <p>Description: ${weatherData.weather[0].description}</p>
          `;
    } else if (weatherData.error) {
      weatherDiv.textContent = weatherData.error;
    } else {
      weatherDiv.textContent = "An error occurred while fetching weather data.";
    }
  }
}

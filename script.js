const input = document.getElementById("cityInput");
const submit = document.getElementById("searchBtn");
const infoDiv = document.querySelector(".info");

infoDiv.style.display = "none";

function fetchWeather(city) {
  const url = `https://weather-zzrf.onrender.com/weather?city=${city}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(data => {
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      const name = data.name;
      const icon = data.weather[0].icon;

      infoDiv.innerHTML = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <p>Temperature: ${temp}°C</p>
        <p>Weather: ${desc}</p>
      `;
      infoDiv.style.display = "block";
    })
    .catch(err => {
      infoDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
      infoDiv.style.display = "block";
    });
}

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchWeather(input.value.trim());
  }
});

submit.addEventListener("click", () => {
  fetchWeather(input.value.trim());
});

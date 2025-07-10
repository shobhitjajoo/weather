
const input = document.getElementById("cityInput");
const submit = document.getElementById("searchBtn");
const infoDiv = document.querySelector(".info");
const suggestions = document.getElementById("suggestions");


infoDiv.style.display = "none";

function fetchWeather(city) {
  const apiKey = 'af58ec79b78424a8159f6b5ecfde51bd'; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

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
    suggestions.innerHTML = "";
  }
});

submit.addEventListener("click", () => {
  fetchWeather(input.value.trim());
  suggestions.innerHTML = "";
});

input.addEventListener("input", () => {
  const query = input.value.trim();
  if (query.length < 2) {
    suggestions.innerHTML = "";
    return;
  }

  fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&namePrefix=${query}`, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": '5f1ad2dc95msh7f107f1e7547b0bp1a3ae2jsn8ca69e4ea4a5', // Replace this
      "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
    }
  })
    .then(res => res.json())
    .then(data => {
      suggestions.innerHTML = "";
      data.data.forEach(city => {
        const li = document.createElement("li");
        li.textContent = `${city.city}, ${city.country}`;
        li.addEventListener("click", () => {
          input.value = city.city;
          suggestions.innerHTML = "";
          fetchWeather(city.city);
        });
        suggestions.appendChild(li);
      });
    })
    .catch(err => console.error("City suggestions error:", err));
});

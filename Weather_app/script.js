const apiKey = "c9dd4032b69f6f331e811d42f6bddcde";

const body = document.body;
const themeBtn = document.getElementById("themeBtn");

// Theme toggle
themeBtn.onclick = () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.className);
};

body.className = localStorage.getItem("theme") || "";

// City weather
async function getWeather() {
  const city = cityInput.value.trim();
  error.innerText = "";

  if (!city) {
    error.innerText = "Please enter city name";
    return;
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=c9dd4032b69f6f331e811d42f6bddcde`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (data.cod !== 200) {
      error.innerText = data.message;
      return;
    }

    showWeather(data);
    getHourly(data.coord.lat, data.coord.lon);

  } catch (e) {
    error.innerText = "Network error";
  }
}

// Location weather
function getLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    getByCoords(pos.coords.latitude, pos.coords.longitude);
  });
}

async function getByCoords(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  const data = await res.json();
  showWeather(data);
  getHourly(lat, lon);
}

// Display main weather
function showWeather(data) {
  temp.innerText = Math.round(data.main.temp) + "°C";
  city.innerText = data.name;
  desc.innerText = data.weather[0].description;
  humidity.innerText = data.main.humidity;
  wind.innerText = data.wind.speed;

  icon.src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Hourly forecast
async function getHourly(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  const data = await res.json();

  hourly.innerHTML = "";
  data.list.slice(0, 8).forEach(h => {
    hourly.innerHTML += `
      <div class="hour">
        <p>${h.dt_txt.slice(11,16)}</p>
        <img src="https://openweathermap.org/img/wn/${h.weather[0].icon}.png">
        <p>${Math.round(h.main.temp)}°</p>
      </div>`;
  });
}

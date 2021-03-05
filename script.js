const input = document.getElementById("input__ip");
const btnSubmit = document.getElementById("btn__submit");
const infoIp = document.querySelector(".info__ip");
const infoLocation = document.querySelector(".info__location");
const infoTimeZone = document.querySelector(".info__timezone");
const infoIsp = document.querySelector(".info__isp");

// Check if input is valid url
const isValidURL = (string) => {
  const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return res !== null;
};

// Leaflet Map
const map = L.map("mapid", {
    zoomControl: false,
});

const showMap = (lat, lng) => {
  const icon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [40, 50],
    iconAnchor: [20, 25],
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.setView([lat, lng], 16);
  L.marker([lat, lng], { icon: icon }).addTo(map);
};

async function getDataFromApi(e) {
  e.preventDefault();
  const dataUserInput = input.value || data;

  // Check if input is valid ip or valid domain (with function above)
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(dataUserInput) ||
    isValidURL(dataUserInput)) {
    try {
      const apiKey = "at_e8YFs79ARdh1PfVH4s5rf6bJf99VW";
      const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${dataUserInput}&domain=${dataUserInput}`);
      const data = await response.json();

      const ipAddress = data.ip;
      const region = data.location.region;
      const city = data.location.city;
      const country = data.location.country;
      const timezone = data.location.timezone;
      const isp = data.isp;
      const lat = data.location.lat;
      const lng = data.location.lng;

      infoIp.textContent = ipAddress;
      infoLocation.innerHTML = `${city} ${region} <br> ${country}`;
      infoTimeZone.textContent = "UTC " + timezone;
      infoIsp.textContent = isp;

      showMap(lat, lng);
      input.value = "";
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Please enter a valid ip or domain !");
  }
}

input.addEventListener("paste", (e) => {
  data = e.clipboardData.getData("text");
});
btnSubmit.addEventListener("click", getDataFromApi);

// On load
showMap(34.08057, -118.07285);
/* Declare Variables */
const input = document.querySelector(".form input");
const btn = document.querySelector(".form button");
const viewers = document.querySelectorAll(".view div");
var marker;

fmd();

btn.addEventListener("click", async () => {
  let value = input.value;
  if (value === "") return;

  let endpoint;

  const regax = /\d+.\d+/i;
  if (value.match(regax))
    endpoint = `https://geo.ipify.org/api/v2/country,city?apiKey=at_oTXWpnrpfwq0HuMU7ptKCsyaLsfg7&ipAddress=${value}`;
  else
    endpoint = `https://geo.ipify.org/api/v2/country,city?apiKey=at_oTXWpnrpfwq0HuMU7ptKCsyaLsfg7&domain=${value}`;

  let res = await fetchData(endpoint);

  if (res.status !== 200) return;

  let data = res.data;
  loadingViewers();

  // make a mark on the map
  if (marker !== undefined) map.removeLayer(marker);
  marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
  marker
    .bindPopup(
      `<div style="text-align: center;">
    <b>${data.location.country}</b><br />
    <span><b>region:</b> ${data.location.region}</span><br />
    <span><b>asn:</b> ${data.as.asn || "null"}</span></div>`
    )
    .openPopup();

  fillViewData(data);
});

/* 
    Fetch IP Data
    @params (_endpoint: "spesific endpoint to fetched")    
*/
async function fetchData(_endpoint) {
  const res = await axios.get(_endpoint);
  return res;
}

function fillViewData(_data) {
  viewers[0].children[1].textContent = _data.ip || _data.as.domain || "None";
  viewers[1].children[1].textContent = `${_data.location.country || "-"}, ${
    _data.location.region || "-"
  } ${_data.as.asn || "-"}`;
  viewers[2].children[1].textContent = `UTC ${
    _data.location.timezone || "None"
  }`;
  viewers[3].children[1].textContent = _data.isp || "None";
}

function loadingViewers() {
  viewers[0].children[1].textContent = "Loading...";
  viewers[1].children[1].textContent = "Loading...";
  viewers[2].children[1].textContent = "Loading...";
  viewers[3].children[1].textContent = "Loading...";
}

// fetch my data and show them \\
async function fmd() {
  loadingViewers();
  let endpoint =
    "https://geo.ipify.org/api/v2/country,city?apiKey=at_oTXWpnrpfwq0HuMU7ptKCsyaLsfg7";

  const res = await fetchData(endpoint);

  if (res === undefined || res.status !== 200) return;

  let data = res.data;

  // make a mark on the map
  if (marker !== undefined) map.removeLayer(marker);
  marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
  marker
    .bindPopup(
      `<div style="text-align: center;">
    <b>${data.location.country}</b><br />
    <span><b>region:</b> ${data.location.region}</span><br />
    <span><b>asn:</b> ${data.as.asn || "null"}</span></div>`
    )
    .openPopup();

  fillViewData(data);
}

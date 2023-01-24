/* Declare Variables */
const input = document.querySelector('.form input');
const btn = document.querySelector('.form button');
const viewers = document.querySelectorAll('.view div');
var marker;


fmd();

btn.addEventListener('click', async () => {
    let ip_address = input.value;
    if ( ip_address === '' ) return;

    let endpoint = `http://ip-api.com/json/${ip_address}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,query`;
    
    let data = await fetchData(endpoint);

    if ( data.status === 'fail' ) return;
    
    loadingViewers();
    
    // make a mark on the map
    if ( marker !== undefined ) map.removeLayer(marker);
    marker = L.marker([data.lat, data.lon]).addTo(map);
    marker.bindPopup(`<div style="text-align: center;">
    <b>${data.country}</b><br />
    <span><b>city:</b> ${data.city}</span><br />
    <span><b>region:</b> ${data.regionName}</span><br />
    <span><b>district:</b> ${data.district || 'null'}</span></div>`)
    .openPopup();

    fillViewData(data);
})

/* 
    Fetch IP Data
    @params (_endpoint: "spesific endpoint to fetched")    
*/
async function fetchData(_endpoint) {
    const res = await fetch(_endpoint, {
        referrerPolicy: 'unsafe-url'
    })
    .then(response => response.json())

    return res;
}

function fillViewData(_data) {
    viewers[0].children[1].textContent = _data.query;
    viewers[1].children[1].textContent = `${_data.city}, ${_data.region} ${_data.zip}`;
    viewers[2].children[1].textContent = `UTC ${_data.offset}`;
    viewers[3].children[1].textContent = _data.isp;
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
    let endpoint = `http://ip-api.com/json/?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,query`;

    const data = await fetchData(endpoint);
    
    if ( data === undefined || Object.keys(data).length === 0 ) return;

    // make a mark on the map
    if ( marker !== undefined ) map.removeLayer(marker);
    marker = L.marker([data.lat, data.lon]).addTo(map);
    marker.bindPopup(`<div style="text-align: center;">
    <b>${data.country}</b><br />
    <span><b>city:</b> ${data.city}</span><br />
    <span><b>region:</b> ${data.regionName}</span><br />
    <span><b>district:</b> ${data.district || 'null'}</span></div>`)
    .openPopup();

    fillViewData(data);
}
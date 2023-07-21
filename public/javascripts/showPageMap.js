// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1Ijoia25pZ2h0YzBkZXIwMDEiLCJhIjoiY2xrOXl5MzczMDJjODNrcWQxZXNteGhvbiJ9.ArZj2XloX_7m4NTtK0y4jQ';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', //  style URL
    center: [74.19552, 30.144533],//spot.geometry.coorinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(spot.geometry.coorinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${spot.title}</h3><p>${spot.location}</p>`
        )
    )
    .addTo(map)
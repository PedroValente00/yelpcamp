mapboxgl.accessToken = frontEndAccessToken;
const place = geoLocation.length ? geoLocation : [-50, 50];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v12',
  center: place,
  zoom: 10
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
}));

const marker = new mapboxgl.Marker()
  // .setLngLat(geoLocation.geometry.coordinates || [-50,50])
  .setLngLat(place)
  .setPopup(new mapboxgl.Popup({offset:50})
  .setHTML(`
    <p class="pinTitle">${campName}</p>
    <span>${campLocation}</span>
    `)
    .setMaxWidth("300px")
  )
  .addTo(map);


  // const popup = new mapboxgl.Popup({offset: 50, className: 'my-class'})
  // .setLngLat(place)
  // .setHTML("<h1>Hello World!</h1>")
  // .setMaxWidth("300px")
  // .addTo(map);
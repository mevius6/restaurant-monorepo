// import '../scss/map.scss';
import L from '../vendor/leaflet';
import { selectAll } from '../utils';

// TODO: Использовать Mapbox Directions API и Geolocation API,
// для построения маршрута (альтернатива Google Maps).
// https://leafletjs.com/examples/mobile/
// https://leafletjs.com/reference-1.7.1.html#map-locate
// https://docs.mapbox.com/help/tutorials/getting-started-directions-api/

const root = document.documentElement;

const ICON_GRADIENT = '<linearGradient id="Grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(45)"><stop offset="0%" stop-color="#b6ada5" /><stop offset="100%" stop-color="#8c8279" /></linearGradient>';

const ICON_CAKE = `<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline"><defs>${ICON_GRADIENT}</defs><path fill="url(#Grad)" d="M192 64c0-31 32-23 32-64 12 0 32 29.5 32 56s-14.25 40-32 40-32-14.25-32-32zm160 32c17.75 0 32-13.5 32-40S364 0 352 0c0 41-32 33-32 64 0 17.75 14.25 32 32 32zm96 176v240H0V272c0-26.5 21.5-48 48-48h24V112h48v112h80V112h48v112h80V112h48v112h24c26.5 0 48 21.5 48 48zm-400 6v56.831c8.352 7 15.27 13.169 26.75 13.169 25.378 0 30.13-32 74.75-32 43.974 0 49.754 32 74.5 32 25.588 0 30.061-32 74.75-32 44.473 0 49.329 32 74.75 32 11.258 0 18.135-6.18 26.5-13.187v-56.805a6 6 0 0 0-6-6L54 272a6 6 0 0 0-6 6zm352 186v-80.87c-7.001 2.914-15.54 4.87-26.5 4.87-44.544 0-49.389-32-74.75-32-25.144 0-30.329 32-74.75 32-43.974 0-49.755-32-74.5-32-25.587 0-30.062 32-74.75 32-11.084 0-19.698-1.974-26.75-4.911V464h352zM96 96c17.75 0 32-13.5 32-40S108 0 96 0c0 41-32 33-32 64 0 17.75 14.25 32 32 32z"></path></svg>`;

const ICON_ZOOM_IN = `<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline"><defs>${ICON_GRADIENT}</defs><path fill="url(#Grad)" d="M319.8 204v8c0 6.6-5.4 12-12 12h-84v84c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12v-84h-84c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h84v-84c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12zm188.5 293L497 508.3c-4.7 4.7-12.3 4.7-17 0l-129-129c-2.3-2.3-3.5-5.3-3.5-8.5v-8.5C310.6 395.7 261.7 416 208 416 93.8 416 1.5 324.9 0 210.7-1.5 93.7 93.7-1.5 210.7 0 324.9 1.5 416 93.8 416 208c0 53.7-20.3 102.6-53.7 139.5h8.5c3.2 0 6.2 1.3 8.5 3.5l129 129c4.7 4.7 4.7 12.3 0 17zM384 208c0-97.3-78.7-176-176-176S32 110.7 32 208s78.7 176 176 176 176-78.7 176-176z"></path></svg>`;

const ICON_ZOOM_OUT = `<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline"><defs>${ICON_GRADIENT}</defs><path fill="url(#Grad)" d="M307.8 223.8h-200c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v8c0 6.6-5.4 12-12 12zM508.3 497L497 508.3c-4.7 4.7-12.3 4.7-17 0l-129-129c-2.3-2.3-3.5-5.3-3.5-8.5v-8.5C310.6 395.7 261.7 416 208 416 93.8 416 1.5 324.9 0 210.7-1.5 93.7 93.7-1.5 210.7 0 324.9 1.5 416 93.8 416 208c0 53.7-20.3 102.6-53.7 139.5h8.5c3.2 0 6.2 1.3 8.5 3.5l129 129c4.7 4.7 4.7 12.3 0 17zM384 208c0-97.3-78.7-176-176-176S32 110.7 32 208s78.7 176 176 176 176-78.7 176-176z"></path></svg>`;

const ATTR = 'Данные карты &copy; <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">Участники OpenStreetMap</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener noreferrer">CC-BY-SA</a>, Векторные данные &copy; <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer">Mapbox</a>';

const NAMES = [
  'Кафе-кондитерская «ХочуТорт»',
  'Кондитерская-мастерская «ХочуТорт»',
  'Островок «ХочуТорт» в ТЦ «Мармелад»',
  'Кулинарная студия «Хочу Готовить»',
];

const addData = (name, desc, adds, time, telephone, direction) => `
<article>
  <h4 class="headline">
    <span itemprop="name">${name}</span>
  </h4>
  <!--span itemprop="description">${desc}</span-->
  <span>
    <span>${adds}</span>
    <span>Великий Новгород</span>
  </span>
  <span>
    <b>Открыто:</b>
    <time datetime="Mo-Su ${time}">
      ${time}
    </time>
  </span>
  <span>
    <b>Телефон:</b>
    <span>
      <a href="tel:+78162${telephone.replace(/[^\d+]/g, '')}">${telephone}</a>
    </span>
  </span>
  <a class="gm-direction" href="${direction}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
</article>
`;

const cafe = {
  data: () => addData(
    NAMES[0],
    '',
    'ул. Чудинцева, 1',
    '10&colon;00–22&colon;00',
    '555—880',
    'https://goo.gl/maps/7qhefPCzbmmKGEaF9'
  ),
  lat: 58.52222,
  lng: 31.26805,
};

const pastryshop = {
  data: () => addData(
    NAMES[1],
    '',
    'пр. Александра Корсунова, 28',
    '10&colon;00–19&colon;00',
    '998—811',
    'https://goo.gl/maps/GwzJG1X2ngqkq3Ey8'
  ),
  lat: 58.54585,
  lng: 31.24086,
};

const outlet = {
  data: () => addData(
    NAMES[2],
    '',
    'ул. Ломоносова, 27',
    '10&colon;00–21&colon;00',
    '555—770',
    'https://goo.gl/maps/bxzjZsjAdZXnfd1P6'
  ),
  lat: 58.5314,
  lng: 31.2421,
};

const studio = {
  data: () => addData(
    NAMES[3],
    '',
    'пр. Александра Корсунова, 28',
    '10&colon;00–19&colon;00',
    '998—811',
    'https://goo.gl/maps/GwzJG1X2ngqkq3Ey8'
  ),
  lat: 58.54586,
  lng: 31.24034,
};

const locations = [
  [cafe.data, cafe.lat, cafe.lng],
  [pastryshop.data, pastryshop.lat, pastryshop.lng],
  [outlet.data, outlet.lat, outlet.lng],
  [studio.data, studio.lat, studio.lng],
];

// https://docs.mapbox.com/api/maps/#static-tiles
// const mapboxUrl = 'https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}@2x?access_token={accessToken}';
let mapboxUrl;
if (root.dataset.device === 'mobile') {
  mapboxUrl = 'https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
} else {
  mapboxUrl = 'https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}@2x?access_token={accessToken}';
}

// https://docs.mapbox.com/help/glossary/zoom-level/#tile-size
const vectorLayerOptions = {
  minZoom: 12,
  maxZoom: 18,
  username: 'mevius6',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: process.env.MAPBOX_ACCESS_TOKEN,
}

const night = L.tileLayer(mapboxUrl, {
  ...vectorLayerOptions,
  style_id: 'ckmpdauv5011l17s243anv3x0'
});

const light = L.tileLayer(mapboxUrl, {
  ...vectorLayerOptions,
  style_id: 'ckhkpl4e15kgq19qcmgwhkfgr'
});

const style = root.dataset.themeStyle;
const toggle = document.querySelector('theme-switch');

toggle.addEventListener('colorschemechange', () => {
  if (toggle.mode === 'dark') {
    light.removeFrom(map) && night.addTo(map);
  } else {
    night.removeFrom(map) && light.addTo(map);
  }
});

const coords1 = L.latLng(pastryshop.lat, pastryshop.lng),
      coords2 = L.latLng(cafe.lat, cafe.lng),
      bounds = L.latLngBounds(coords1, coords2);

const mapOptions = {
  attributionControl: false,
  zoomControl: false,
  zoomSnap: 0.5,
  // layers: [night, light],
  layers: [],
  scrollWheelZoom: false,
}

const map = L.map('map', mapOptions).fitBounds(bounds, {padding: [100, 100]});

(async () => {
  if (style === 'dark') {
    night.addTo(map);
  } else if (style === 'light') {
    light.addTo(map);
  } else {
    // w/o any style
    light.addTo(map);
  }
})();

// https://leafletjs.com/reference-1.7.1.html#icon
const markerIcon = L.divIcon({
  html: ICON_CAKE,
  iconSize: [40, 45],
  popupAnchor: [0, -22.5],
  className: 'marker-icon',
});

const popupOptions = {
  maxWidth: 300,
  keepInView: true,
  closeButton: true,
  className: 'microdata-popup',
};

const markers = [];
locations.map((location, i) => {
  let coords = [location[1], location[2]];
  let marker = L.marker(coords, {icon: markerIcon, title: NAMES[i]});

  marker
    .bindPopup(location[0], popupOptions)
    .on('click', () => map.setView(coords));

  markers.push(marker);
});

// https://leafletjs.com/reference-1.7.1.html#layergroup-togeojson
L.layerGroup(markers).addTo(map);

markers[0].openPopup();

L.control.zoom({
  position: 'topright',
  zoomInText: ICON_ZOOM_IN,
  zoomInTitle: 'Приблизить',
  zoomOutText: ICON_ZOOM_OUT,
  zoomOutTitle: 'Отдалить',
}).addTo(map);

L.control
  .attribution({position: 'bottomright'})
  .addAttribution(ATTR)
  .addTo(map);

selectAll('.extra-controls__item').forEach((control, i) => {
  let coords = [locations[i][1], locations[i][2]];

  control.addEventListener('change', () => {
    markers[i].openPopup();
    map.setView(coords);
  }, false);
});

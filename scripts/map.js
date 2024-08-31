import {
  saveMarkersToLocalStorage,
  loadMarkersFromLocalStorage,
} from "./maphelpers.js";

// Initialize the map with a view centered on a default location
export const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(), // Using OpenStreetMap as the base layer
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([17.412582, 48.165127]), // Centered on Senec
    zoom: 18.3,
  }),
});

// Create a vector source to store markers
export const vectorSource = new ol.source.Vector();

// Create a vector layer to display the markers
export const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
});

map.addLayer(vectorLayer);

// Function to add a marker at the clicked location
export function addMarker(coordinate) {
  const lonLat = ol.proj.toLonLat(coordinate);
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(coordinate),
    name: "Fishing Spot",
  });

  marker.setId(generateUUID());

  vectorSource.addFeature(marker);

  // Create a popup element
  const popup = document.createElement("div");
  popup.className = "ol-popup";
  popup.innerHTML = `Fish caught here!<br>Lat: ${lonLat[1].toFixed(
    5
  )}, Lng: ${lonLat[0].toFixed(5)}`;

  const overlay = new ol.Overlay({
    element: popup,
    positioning: "bottom-center",
    stopEvent: false,
    offset: [0, -15],
    position: coordinate,
  });

  map.addOverlay(overlay);

  saveMarkersToLocalStorage(map, vectorSource);
}

loadMarkersFromLocalStorage(map, vectorSource);

export function addPopupOnClick(feature, popup, popupContent) {
  const coordinates = feature.getGeometry().getCoordinates();
  const name = feature.get("name");
  popupContent.innerHTML = `<strong>${name}</strong>`;
  popup.setPosition(coordinates);
  popup.getElement().style.display = "block";
}

function generateUUID() {
  return crypto.randomUUID();
}

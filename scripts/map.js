import {
  saveMarkersToLocalStorage,
  loadMarkersFromLocalStorage,
} from "./maphelpers.js";
import { supabase } from "./supa.js";

let default_coordinates = [17.421, 48.1711];

let user;

async function checkSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
  } else if (session) {
    console.log("Logged-in user:", session.user.id);
    user = session.user;
  }
}

// Call the function to check session status
await checkSession();

// TODO: Rework this to select only the row which matches the userid, but first get the userid
try {
  const { data, error } = await supabase
    .from("map")
    .select()
    .filter("userid", "eq", user.id);

  if (error) {
    console.error(`Error returning data from db:`, error);
  }

  console.log(data);

  if (data[0]) {
    default_coordinates = data[0].start_coordinates;
  }
} catch (error) {
  console.error(error);
}

// Initialize the map with a view centered on a default location
export const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(), // Using OpenStreetMap as the base layer
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat(default_coordinates), // Centered on Senec
    zoom: 17.5,
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
export function addMarker(coordinates, formdata) {
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(coordinates),
    type: "Fishing Spot",
    name: formdata.get("name"),
    bottom: formdata.get("bottom") || "...",
    depth: formdata.get("depth") || "...",
    structure: formdata.get("structure") || "...",
  });

  marker.setId(generateUUID());

  vectorSource.addFeature(marker);

  saveMarkersToLocalStorage(map, vectorSource);
}

loadMarkersFromLocalStorage(map, vectorSource);

export function addPopupOnClick(feature, popup, popupContent) {
  const coordinates = feature.getGeometry().getCoordinates();
  const name = feature.get("name");
  const bottom = feature.get("bottom");
  popupContent.innerHTML = `<div>
                              <h2>${name}</h2>
                              <p>Other info... Maybe button and functions and shit. IDK.</p>
                              <p>Depth: ... m</p>
                              <p>Structure: ... m</p>
                              <p>Bottom: ${bottom}.</p>
                            </div>`;
  popup.setPosition(coordinates);
  popup.getElement().style.display = "block";
}

function generateUUID() {
  return crypto.randomUUID();
}

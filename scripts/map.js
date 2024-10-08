import {
  saveMarkersToLocalStorage,
  loadMarkersFromLocalStorage,
  checkSession,
} from "./maphelpers.js";
import { supabase } from "./supa.js";

let default_coordinates = [17.421, 48.1711];

// Call the function to check session status
let user = await checkSession();

try {
  const { data, error } = await supabase
    .from("map")
    .select()
    .filter("userid", "eq", user.id);

  if (error) {
    console.error(`Error returning data from db:`, error);
  }

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

function makeTypedMarker(coordinates, formdata, spotType) {
  if (spotType === "Fishing Spot") {
    const marker = new ol.Feature({
      geometry: new ol.geom.Point(coordinates),
      type: spotType,
      name: formdata.get("name"),
      bottom: formdata.get("bottom") || "???",
      depth: formdata.get("depth") || "???",
      structure: formdata.get("structure") || "???",
    });
    return marker;
  } else if (spotType === "Bank Spot") {
    const marker = new ol.Feature({
      geometry: new ol.geom.Point(coordinates),
      type: spotType,
      name: formdata.get("name"),
      fishingspots: formdata.get("fishing-spots") || "???",
      bugs: formdata.get("bugs") || "???",
      soil: formdata.get("soil") || "???",
    });
    return marker;
  }
}

// Function to add a marker at the clicked location
export function addMarker(coordinates, formdata, spotType) {
  let marker = makeTypedMarker(coordinates, formdata, spotType);

  marker.setId(generateUUID());

  vectorSource.addFeature(marker);

  saveMarkersToLocalStorage(map, vectorSource);
}

loadMarkersFromLocalStorage(map, vectorSource);

export function addPopupOnClick(feature, popup, popupContent, editBtn) {
  const coordinates = feature.getGeometry().getCoordinates();
  const name = feature.get("name");
  if (feature.get("type") === "Fishing Spot") {
    popupContent.innerHTML = `<div>
                              <h2>${name}</h2>
                              <p>Depth: ${feature.get("depth")}m</p>
                              <p>Structure: ${feature.get("structure")}</p>
                              <p>Bottom: ${feature.get("bottom")}.</p>
                            </div>`;
  } else if (feature.get("type") === "Bank Spot") {
    popupContent.innerHTML = `<div>
                              <h2>${name}</h2>
                              <p>Reachable Fishing Spots: ${feature.get("fishingspots")}</p>
                              <p>Bugs: ${feature.get("bugs")}</p>
                              <p>Soil: ${feature.get("soil")}.</p>
                            </div>`;
  }
  editBtn.dataset.featureid = feature.getId("id");
  popup.setPosition(coordinates);
  popup.getElement().style.display = "block";
}

function generateUUID() {
  return crypto.randomUUID();
}

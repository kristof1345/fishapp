import { map, addMarker, vectorSource } from "./scripts/map.js";
import { saveMarkersToLocalStorage } from "./scripts/maphelpers.js";

let addFishMode = false;
let deleteMode = false;

document.getElementById("add-fish-btn").addEventListener("click", function () {
  addFishMode = !addFishMode;
  this.textContent = addFishMode ? "Exit Mode" : "Add Marker";
});

document.getElementById("delete-btn").addEventListener("click", function () {
  deleteMode = !deleteMode;
  this.textContent = deleteMode ? "Exit Mode" : "Delete Mode";
});

// Add a click event listener on the map to place markers
map.on("click", function (event) {
  if (addFishMode) {
    const coordinate = ol.proj.toLonLat(event.coordinate);
    addMarker(event.coordinate);
  }

  if (deleteMode) {
    let feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
      return feature;
    });
    if (feature && feature.get("name") === "Fishing Spot") {
      // sketch lol
      vectorSource.removeFeature(feature);
      alert("you deleted your marker");
      saveMarkersToLocalStorage(map, vectorSource);
    }
  }
});

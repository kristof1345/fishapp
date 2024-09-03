import { map, addMarker, vectorSource, addPopupOnClick } from "./map.js";
import { saveMarkersToLocalStorage } from "./maphelpers.js";
import { supabase } from "./supa.js";

const setDefLocationBtn = document.getElementById("set-def-location");
const popupContent = document.getElementById("popup-content");
const usernameDOM = document.getElementById("username");

let addFishMode = false;
let deleteMode = false;

let addDepthMode = false;
let deleteDepthMode = false;

let usrname;

async function checkSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
  } else if (session) {
    console.log("Logged-in user:", session.user.id);
    usrname = session.user.user_metadata.username;
    usernameDOM.innerHTML = usrname;
  } else {
    window.location.pathname = "/redirect";
  }
}

// Call the function to check session status
checkSession();

// if (user == null) {
//   window.location.pathname = "/redirect";
// }

document.getElementById("add-fish-btn").addEventListener("click", function () {
  addFishMode = !addFishMode;
  this.textContent = addFishMode ? "Exit Mode" : "Add Marker";
});

document.getElementById("delete-btn").addEventListener("click", function () {
  deleteMode = !deleteMode;
  this.textContent = deleteMode ? "Exit Mode" : "Delete Mode";
});

document.getElementById("add-depth-btn").addEventListener("click", function () {
  addDepthMode = !addDepthMode;
  this.textContent = addDepthMode ? "Exit Mode" : "Add Depth Marker";
});

document
  .getElementById("delete-depth-btn")
  .addEventListener("click", function () {
    deleteDepthMode = !deleteDepthMode;
    this.textContent = deleteDepthMode ? "Exit Mode" : "Delete Mode";
  });

const popup = new ol.Overlay({
  element: document.getElementById("popup"),
  autoPan: true,
  positioning: "bottom-center",
});

map.addOverlay(popup);

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
      saveMarkersToLocalStorage(map, vectorSource);
    }
    return;
  }

  map.forEachFeatureAtPixel(event.pixel, function (feature) {
    if (feature && feature.get("name") === "Fishing Spot") {
      addPopupOnClick(feature, popup, popupContent);
    }
  });
});

setDefLocationBtn.addEventListener("click", async () => {
  if (confirm("Do you want to set this as the default start-up location?")) {
    let coordinates = ol.proj.toLonLat(map.getView().getCenter());

    console.log(coordinates);

    const { data, error } = await supabase
      .from("map")
      .update({ start_coordinates: coordinates })
      .eq("id", 2);

    if (error) {
      console.error(error);
    }
  }
});

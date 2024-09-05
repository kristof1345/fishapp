import { map, addMarker, vectorSource, addPopupOnClick } from "./map.js";
import { saveMarkersToLocalStorage } from "./maphelpers.js";
import { supabase } from "./supa.js";

const setDefLocationBtn = document.getElementById("set-def-location");
const logoutBtn = document.getElementById("logout");
const popupContent = document.getElementById("popup-content");
const usernameDOM = document.getElementById("username");

const addFishPopup = document.getElementById("add-spot-popup");
const popupForm = document.getElementById("popup-form");

const addFishBtn = document.getElementById("add-fish-btn");
const deleteFishBtn = document.getElementById("delete-btn");

let addFishMode = false;
let deleteMode = false;

let addDepthMode = false;
let deleteDepthMode = false;

let usrname;
let userID;

async function checkSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
  } else if (session) {
    console.log("Logged-in user:", session.user.id);
    userID = session.user.id;
    usrname = session.user.user_metadata.username;
    usernameDOM.innerHTML = usrname;
  } else {
    window.location.pathname = "/redirect";
  }
}

// Call the function to check session status
checkSession();

document.getElementById("searchbar").addEventListener("submit", function (e) {
  e.preventDefault();

  const query = document.getElementById("search-input").value;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&addressdetails=1`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        const firstResult = data[0];
        const lon = firstResult.lon;
        const lat = firstResult.lat;
        const coord = ol.proj.fromLonLat([lon, lat]);

        // Center the map on the search result
        map.getView().setCenter(coord);
        map.getView().setZoom(14);
      } else {
        alert("No results found");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

addFishBtn.addEventListener("click", function () {
  addFishMode = !addFishMode;
  addFishBtn.textContent = addFishMode ? "Exit Mode" : "Add Marker";

  if (deleteMode) {
    deleteMode = !deleteMode;
    deleteFishBtn.textContent = deleteMode ? "Exit Mode" : "Delete Mode";
  }
});

deleteFishBtn.addEventListener("click", function () {
  deleteMode = !deleteMode;
  deleteFishBtn.textContent = deleteMode ? "Exit Mode" : "Delete Mode";

  if (addFishMode) {
    addFishMode = !addFishMode;
    addFishBtn.textContent = addFishMode ? "Exit Mode" : "Add Marker";
  }
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

// const addFishPopup = new ol.Overlay({
//   element: document.getElementById("add-spot-popup"),
//   autoPan: true,
//   positioning: "bottom-center",
// });

map.addOverlay(popup);
// map.addOverlay(addFishPopup);

// Add a click event listener on the map to place markers
map.on("click", function (event) {
  if (addFishMode) {
    addFishPopup.style.display = "flex";

    addFishMode = !addFishMode;
    addFishBtn.textContent = addFishMode ? "Exit Mode" : "Add Marker";

    popupForm.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();

        const formdata = new FormData(e.target);

        console.log(formdata.get("name"));

        addMarker(event.coordinate, formdata);

        addFishPopup.style.display = "none";
        popupForm.reset();
      },
      { once: true }
    );
  }

  if (deleteMode) {
    let feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
      return feature;
    });
    if (feature && feature.get("type") === "Fishing Spot") {
      // sketch lol
      vectorSource.removeFeature(feature);
      saveMarkersToLocalStorage(map, vectorSource);
    }
    return;
  }

  if (!addFishMode) {
    map.forEachFeatureAtPixel(event.pixel, function (feature) {
      if (feature && feature.get("type") === "Fishing Spot") {
        addPopupOnClick(feature, popup, popupContent);
      }
    });
  }
});

logoutBtn.addEventListener("click", async () => {
  const { data, error } = supabase.auth.signOut();

  if (error) {
    console.error(error);
  } else {
    window.location.pathname = "/";
  }
});

setDefLocationBtn.addEventListener("click", async () => {
  if (confirm("Do you want to set this as the default start-up location?")) {
    let coordinates = ol.proj.toLonLat(map.getView().getCenter());

    console.log(coordinates);

    const { data, error } = await supabase
      .from("map")
      .select()
      .filter("userid", "eq", userID);

    // const { data, error } = await supabase
    //   .from("map")
    //   .update({ start_coordinates: coordinates })
    //   .eq("id", 2);

    if (!data.length) {
      const { data, error } = await supabase
        .from("map")
        .insert([{ start_coordinates: coordinates, userid: userID }]);
      if (error) {
        console.error(`Error inserting record:`, error);
      }
    } else {
      const { data, error } = await supabase
        .from("map")
        .update({ start_coordinates: coordinates })
        .eq("userid", userID);
      if (error) {
        console.error(`Error updating record:`, error);
      }
    }

    if (error) {
      console.error(error);
    }
  }
});

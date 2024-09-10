import { supabase } from "./supa.js";

export async function checkSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
  } else if (session) {
    return session.user;
  } else {
    window.location.pathname = "/redirect";
  }
}

let user = await checkSession();

export async function saveMarkersToLocalStorage(map, vectorSource) {
  const features = vectorSource.getFeatures();
  const geojsonFormat = new ol.format.GeoJSON();
  const geojson = geojsonFormat.writeFeatures(features, {
    dataProjection: "EPSG:4326",
    featureProjection: map.getView().getProjection(),
  });

  const { data, error } = await supabase
    .from("map")
    .select()
    .filter("userid", "eq", user.id);

  if (!data.length) {
    const { data, error } = await supabase
      .from("map")
      .insert([{ geom: geojson, userid: user.id }]);
    if (error) {
      console.error(`Error inserting record:`, error);
    }
  } else {
    const { data, error } = await supabase
      .from("map")
      .update({ geom: geojson })
      .eq("userid", user.id);
    if (error) {
      console.error(`Error updating record:`, error);
    }
  }
}

export async function loadMarkersFromLocalStorage(map, vectorSource) {
  const { data, error } = await supabase
    .from("map")
    .select()
    .filter("userid", "eq", user.id);

  if (error) {
    console.error(`Error returning data from db:`, error);
  }

  const geojson = data[0]?.geom;

  if (geojson) {
    const geojsonFormat = new ol.format.GeoJSON();
    const features = geojsonFormat.readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: map.getView().getProjection(),
    });
    vectorSource.addFeatures(features);
    console.log(features);
  }
}

export function searchMap(map, query) {
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
}

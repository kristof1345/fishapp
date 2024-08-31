import { supabase } from "./supa.js";

export async function saveMarkersToLocalStorage(map, vectorSource) {
  const features = vectorSource.getFeatures();
  const geojsonFormat = new ol.format.GeoJSON();
  const geojson = geojsonFormat.writeFeatures(features, {
    dataProjection: "EPSG:4326",
    featureProjection: map.getView().getProjection(),
  });

  const { data, error } = await supabase.from("map").select();

  if (!data.length) {
    const { data, error } = await supabase
      .from("map")
      .insert([{ geom: geojson }]);
    if (error) {
      console.error(`Error updating record:`, error);
    }
  } else {
    const { data, error } = await supabase
      .from("map")
      .update({ geom: geojson })
      .eq("id", 2);
    if (error) {
      console.error(`Error updating record:`, error);
    }
  }

  // localStorage.setItem("map", geojson);
}

export async function loadMarkersFromLocalStorage(map, vectorSource) {
  const { data, error } = await supabase.from("map").select();

  if (error) {
    console.error(`Error updating record:`, error);
  }

  const geojson = data[0].geom;

  if (geojson) {
    const geojsonFormat = new ol.format.GeoJSON();
    const features = geojsonFormat.readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: map.getView().getProjection(),
    });
    vectorSource.addFeatures(features);
  }
}

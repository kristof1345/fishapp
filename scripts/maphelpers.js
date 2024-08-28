export function saveMarkersToLocalStorage(map, vectorSource) {
  const features = vectorSource.getFeatures();
  const geojsonFormat = new ol.format.GeoJSON();
  const geojson = geojsonFormat.writeFeatures(features, {
    dataProjection: "EPSG:4326",
    featureProjection: map.getView().getProjection(),
  });
  localStorage.setItem("map", geojson);
}

export function loadMarkersFromLocalStorage(map, vectorSource) {
  const geojson = localStorage.getItem("map");
  if (geojson) {
    const geojsonFormat = new ol.format.GeoJSON();
    const features = geojsonFormat.readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: map.getView().getProjection(),
    });
    vectorSource.addFeatures(features);
  }
}

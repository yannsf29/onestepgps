<template>
  <div class="map-container">
    <GMapMap
    :center="center"
      :zoom="10"
      map-type-id="terrain"
      :options="mapOptions"
      ref="mapRef"
      class="gmap-canvas"
    >
    <GMapMarker
    v-for="device in devices"
    :key="device.device_id"
    :position="{
        lat: device.latest_device_point.lat,
        lng: device.latest_device_point.lng,
    }"
    :clickable="true"
    :draggable="true"
    @click="updateCenter({ lat: device.latest_device_point.lat, lng: device.latest_device_point.lng })"

/>

    </GMapMap>
  </div>
</template>

<script>
export default {
  props: {
    devices: Array,
  },
  data() {
    return {
      center: { lat: 51.5072, lng: 0.1276 },
      mapOptions: {
        styles: [
          /* You can add your own map styles here, or leave it blank for default styling */
        ],
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
      },
    };
  },
  methods: {
    updateCenter(newCenter) {
    this.center = newCenter;
  },
},
watch: {
  devices(newDevices) {
    if (newDevices && newDevices.length) {  // Added check for newDevices
      let avgLat = 0;
      let avgLng = 0;
      newDevices.forEach(device => {
        avgLat += device.latest_device_point.lat;
        avgLng += device.latest_device_point.lng;
      });
      avgLat /= newDevices.length;
      avgLng /= newDevices.length;
      this.updateCenter({ lat: avgLat, lng: avgLng });
    }
  },
},

};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.gmap-canvas {
  height: 100%;
}

.gmap-marker {
  transition: transform 0.3s;
}

.gmap-marker:hover {
  transform: scale(1.2);
}
</style>

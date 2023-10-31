<template>
  <div class="preference-card">
    <h2>Hide Devices</h2>
    <div class="device-row" v-for="device in devices" :key="device.device_id">
      <input
        type="checkbox"
        :id="'device-' + device.device_id"
        :value="device.device_id"
        v-model="hiddenDeviceIds"
      />
      <label :for="'device-' + device.device_id" class="device-label">
        {{ device.display_name }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    devices: Array,
  },
  data() {
    return {
      hiddenDeviceIds: this.getStoredHiddenDevices(),
      storedDevices: this.getStoredDevices(),
    };
  },
  watch: {
    hiddenDeviceIds: {
      deep: true,
      handler(newVal) {
        this.$emit("hidden-changed", newVal);
        this.storeHiddenDevices(newVal);
      },
    },
    devices: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length) {
          this.storeDevices(newVal);
        }
      },
    },
  },
  methods: {
    getStoredHiddenDevices() {
      const storedDevices = localStorage.getItem("hiddenDevices");
      return storedDevices ? JSON.parse(storedDevices) : [];
    },
    storeHiddenDevices(deviceIds) {
      localStorage.setItem("hiddenDevices", JSON.stringify(deviceIds));
    },
    getStoredDevices() {
      const storedDevices = localStorage.getItem("devices");
      if (storedDevices) {
        return JSON.parse(storedDevices);
      }
      return this.devices || [];
    },
    storeDevices(devices) {
      localStorage.setItem("devices", JSON.stringify(devices));
    },
  },
  computed: {
    displayDevices() {
      return this.devices.length ? this.devices : this.storedDevices;
    },
  },
};
</script>

<style scoped>
.preference-card {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: linear-gradient(145deg, #f5f5f5, #ffffff);
}

h2 {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.device-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

input[type="checkbox"] {
  margin-right: 20px;
  cursor: pointer;
}

.device-label {
  font-weight: bold;
  cursor: pointer;
}
</style>

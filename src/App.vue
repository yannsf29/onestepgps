<template>
  <div class="parent-container">
    <DeviceList
      :devices="devices"
      @toggle-preferences="showModal = !showModal"
      :hiddenDevices="hiddenDeviceIds"
    />
    <PreferencesModal
      :showModal="showModal"
      @closeModal="showModal = false"
      @save-preferences="handleSavePreferences"
      @refresh-data="refreshDataAndUnselectNames"
      @hidden-changed="handleHiddenChanged"
      :hiddenDevices="hiddenDeviceIds"
    >
      <SortPreference @sort-changed="handleSortChanged" />
      <HideDevicesPreference
        :devices="devices"
        @hidden-changed="handleHiddenChanged"
      />
      <DeviceIconsPreference
        :devices="devices"
        @clear-local-storage="clearLocalStorageIfNeeded"
      />
    </PreferencesModal>
    <MapComponent :devices="devices" ref="mapComponentRef" />
  </div>
</template>

<script>
import DeviceList from "./components/DeviceList.vue";
import PreferencesModal from "./components/PreferencesModal.vue";
import MapComponent from "./components/MapComponent.vue";
import HideDevicesPreference from "./components/HideDevicesPreference.vue";
import DeviceIconsPreference from "./components/DeviceIconsPreference.vue";

export default {
  components: {
    DeviceList,
    PreferencesModal,
    MapComponent,
    HideDevicesPreference,
    DeviceIconsPreference,
  },
  data() {
    return {
      devices: [],
      hiddenDeviceIds: [],
      preferences: {},
      showModal: false,
    };
  },
  methods: {
    clearLocalStorageIfNeeded() {
      localStorage.clear();
     
      try {
        const shouldClearStorage = true;

        if (shouldClearStorage) {
          localStorage.removeItem("someKey");

          localStorage.clear();
        }
      } catch (error) {
        console.error("Error clearing local storage:", error);
      }
    },
    async refreshDataAndUnselectNames() {
      await this.fetchDevices();
      this.hiddenDeviceIds = [];
    },
    async handleSavePreferences(dataToSave) {
      this.clearLocalStorageIfNeeded();
      try {
        const rawDataToSave = {
          ...dataToSave,
          HiddenDevices: Array.from(dataToSave.HiddenDevices),
        };
        rawDataToSave.ID = 1;
        rawDataToSave.Icons = this.devices.map((device) => ({
          device_id: device.device_id,
          icon: device.base64Image || null,
        }));

        const response = await fetch(
          "http://localhost:8081/preferences/update",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(rawDataToSave),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to save preferences");
        }

        await this.fetchUserPreferences();

        await this.fetchDevices();

        this.showModal = false;
      } catch (error) {
        console.error("Failed to save preferences:", error);
      }
    },
    handleHiddenChanged(newHiddenDeviceIds) {
      this.hiddenDeviceIds = newHiddenDeviceIds;
      this.devices.forEach((device) => {
        device.hidden = this.hiddenDeviceIds.includes(device.device_id);
      });
      localStorage.setItem(
        "hiddenDevices",
        JSON.stringify(this.hiddenDeviceIds)
      );
    },

    async fetchUserPreferences() {
      try {
        const response = await fetch("http://localhost:8081/preferences/1");
        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }
        this.preferences = await response.json();
        this.hiddenDeviceIds =
          this.preferences && this.preferences.HiddenDevices
            ? this.preferences.HiddenDevices
            : [];
        this.devices.forEach((device) => {
          device.hidden = this.hiddenDeviceIds.includes(device.device_id);
        });
      } catch (error) {
        console.error("Failed to fetch user preferences:", error);
      }
    },

    async fetchDevices() {
      try {
        const response = await fetch("http://localhost:8081");
        const data = await response.json();

        if (
          data &&
          Array.isArray(data.result_list) &&
          data.result_list.length > 0
        ) {
          this.devices = data.result_list;

          let avgLat = 0;
          let avgLng = 0;

          this.devices.forEach((device) => {
            avgLat += device.latest_device_point.lat;
            avgLng += device.latest_device_point.lng;
          });

          avgLat /= this.devices.length;
          avgLng /= this.devices.length;

          this.$refs.mapComponentRef.center = { lat: avgLat, lng: avgLng };
        } else {
          console.error(
            "Unexpected data structure or empty result_list:",
            data
          );
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    },
  },

  async mounted() {
    await this.fetchDevices();
    await this.fetchUserPreferences();
  },
};
</script>

<style scoped>
.parent-container {
  height: 100vh;
}

.toggle-preferences {
  padding: 15px 30px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-preferences:hover {
  background-color: #0056b3;
}
</style>

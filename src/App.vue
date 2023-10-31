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
      <DeviceIconsPreference :devices="devices"  @clear-local-storage="clearLocalStorageIfNeeded" />
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
      console.log('Local storage has been cleared');
    try {
      // Perform a check to see if clearing is necessary.
      // This is a placeholder, you'd implement your own logic to decide when to clear storage.
      const shouldClearStorage = true; // Replace with actual condition

      if (shouldClearStorage) {
        // Clear specific items if necessary
        localStorage.removeItem('someKey');

        // Or clear all local storage (use with caution)
        localStorage.clear();

        console.log('Local storage cleared to free up space');
      }
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }
  },
    async refreshDataAndUnselectNames() {
      await this.fetchDevices();
      this.hiddenDeviceIds = [];
    },
    async handleSavePreferences(dataToSave) {
      this.clearLocalStorageIfNeeded();
      try {
        // First, create a copy of the dataToSave object with the hidden devices array
        const rawDataToSave = {
          ...dataToSave,
          HiddenDevices: Array.from(dataToSave.HiddenDevices),
        };
        rawDataToSave.ID = 1; // Assuming the user ID is 1

        // Next, add the icon images to the rawDataToSave object
        // It assumes that there is a 'base64Image' property on each device
        // that was filled by the uploadIcon method when an image was uploaded
        rawDataToSave.Icons = this.devices.map((device) => ({
          device_id: device.device_id,
          icon: device.base64Image || null,
        }));

        // Log the data being sent to the backend
        console.log("Sending preferences to backend:", rawDataToSave);

        // Make the POST request to the backend to save the preferences
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

        // Parse the JSON response from the backend
        const responseData = await response.json();
        console.log("Response from backend:", responseData);

        // Check if the response was not ok, and if so, throw an error
        if (!response.ok) {
          throw new Error("Failed to save preferences");
        }

        // Fetch the updated user preferences
        await this.fetchUserPreferences();

        // Fetch the updated devices list if necessary
        // If the preferences update does not affect devices data, you can remove this line
        await this.fetchDevices();

        // Close the preferences modal
        this.showModal = false;
      } catch (error) {
        // Log an error if the fetch operation fails
        console.error("Failed to save preferences:", error);
      }
      
    },
    handleHiddenChanged(newHiddenDeviceIds) {
      this.hiddenDeviceIds = newHiddenDeviceIds;
      this.devices.forEach((device) => {
        device.hidden = this.hiddenDeviceIds.includes(device.device_id); // Use this.hiddenDeviceIds
      });
      localStorage.setItem(
        "hiddenDevices",
        JSON.stringify(this.hiddenDeviceIds)
      ); // Use this.hiddenDeviceIds
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

        console.log(data);

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

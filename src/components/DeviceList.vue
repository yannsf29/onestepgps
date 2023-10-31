<template>
  <div class="device-container">
    <div class="toolbar">
      <input
        v-model="searchTerm"
        placeholder="Search devices..."
        class="search-input"
      />
      <div class="sort-buttons">
        <button
          @click="
            sortKey = 'display_name';
            toggleSortOrder();
          "
          :class="{ active: sortKey === 'display_name' }"
        >
          Sort by Name
        </button>
        <button
          @click="
            sortKey = 'active_state';
            toggleSortOrder();
          "
          :class="{ active: sortKey === 'active_state' }"
        >
          Sort by Active State
        </button>
        <button @click="$emit('toggle-preferences')">Toggle Preferences</button>
      </div>
    </div>

    <div class="scrollable-list">
      <div
        v-for="device in filteredDevices"
        :key="device.device_id"
        class="device-card"
        :class="{
          active: device.active_state === 'active',
          inactive: device.active_state !== 'active',
        }"
      >
        <h4>{{ device.display_name }}</h4>
        <p>
          Status:
          <span :class="device.active_state">{{ device.active_state }}</span>
        </p>
        <p>
          Location: Lat: {{ device.latest_device_point.lat }}, Lng:
          {{ device.latest_device_point.lng }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 20px 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
}

.search-input {
  padding: 8px 12px;
  width: 60%;
  border-radius: 16px;
  border: 2px solid #007bff;
  font-size: 16px;
}

.sort-buttons {
  display: flex;
  gap: 8px;
}

button {
  background-color: #e6e6e6;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.active {
  background-color: #007bff;
  color: white;
}

button:hover {
  background-color: #d4d4d4;
}

.scrollable-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.device-card {
  padding: 12px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;
}

.device-card:last-child {
  border-bottom: none;
}

.device-card:hover {
  background-color: #e6e6e6;
}

.active {
  background-color: #dff2e1;
  color: #2d704d;
}

.inactive {
  background-color: #ffe8e8;
  color: #942b2b;
}

h4 {
  margin-top: 0;
  font-weight: 500;
  font-size: 18px;
}

p {
  margin: 8px 0;
  font-size: 16px;
}

p span {
  font-weight: 600;
  border-radius: 8px;
  padding: 2px 6px;
}

.active_state {
  background-color: #dff2e1;
  color: #2d704d;
}

.inactive_state {
  background-color: #ffe8e8;
  color: #942b2b;
}
</style>

<script>
export default {
  props: {
    devices: {
      type: Array,
      default: () => []
    },
    hiddenDevices: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchTerm: "",
      sortKey: "display_name",
      sortOrder: "asc",
    };
  },
  computed: {
    filteredDevices() {
      // First, filter out hidden devices
      let processedDevices = this.devices.filter(
        device => !this.hiddenDevices.includes(device.device_id)
      );

      // Then, sort the devices
      processedDevices.sort((a, b) => {
        let modifier = this.sortOrder === "asc" ? 1 : -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
        return 0;
      });

      // Finally, filter based on the search term
      if (this.searchTerm) {
        processedDevices = processedDevices.filter(device =>
          device.display_name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      return processedDevices;
    }
  },
  methods: {
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    }
  }
};
</script>

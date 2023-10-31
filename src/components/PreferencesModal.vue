<template>
  <transition name="modal">
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close">&times;</span>
        <slot></slot>
        <div class="button-container">
          <button @click="savePreferences" class="save-button">Save</button>
          <button @click="refreshData" class="refresh-button">
            Unhide Devices
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showModal: Boolean,
    hiddenDevices: Array,
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    savePreferences() {
      let dataToSave = {
        SortOrder: this.selectedSort,
        HiddenDevices: this.hiddenDevices,
      };
      this.$emit("save-preferences", dataToSave);
      this.closeModal();
    },
    refreshData() {
      let dataToSave = {
        SortOrder: this.selectedSort,
        HiddenDevices: this.hiddenDevices,
      };
      this.$emit("save-preferences", dataToSave);
      this.$emit("hidden-changed", []);
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.3s;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  width: 60%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  transform: scale(0.95);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-enter,
.modal-leave-active {
  opacity: 0;
}

.modal-content-enter,
.modal-content-leave-active {
  transform: scale(0.9);
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #eee;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close:hover {
  background-color: #ddd;
}

.save-button {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #0056b3;
}

.refresh-button {
  margin-top: 20px;
  margin-left: 20px;
  background-color: rgb(21, 190, 49);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}
</style>

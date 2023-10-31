<template>
  <div class="preference-card">
    <h2>Upload Device Icons</h2>
    <div class="device-row" v-for="device in devices" :key="device.device_id">
      <div
        v-if="!device.tempImageUrl && !device.iconPath"
        :style="getDefaultAvatarStyle(device)"
        class="avatar-icon"
      ></div>
      <img
        v-else
        :src="device.tempImageUrl || device.iconPath"
        class="avatar-icon"
        alt="Uploaded Icon"
      />
      <label class="device-label">{{ device.display_name }}</label>

      <label class="custom-file-upload">
        <input
          type="file"
          class="file-input"
          @change="uploadIcon(device, $event)"
        />
        Choose File
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    devices: Array,
  },
  methods: {
    uploadIcon(device, event) {
      this.$emit("clear-local-storage");
      const reader = new FileReader();
      device.selectedFile = event.target.files[0];

      reader.onload = (e) => {
        device.base64Image = e.target.result;
        device.tempImageUrl = URL.createObjectURL(device.selectedFile);
      };

      reader.readAsDataURL(device.selectedFile);
    },
    getDefaultAvatarStyle(device) {
      const colors = ["#FFD700", "#FF4500", "#8A2BE2", "#7FFF00", "#20B2AA"];
      const index = device.device_id % colors.length;
      const defaultColor = colors[index];

      if (!device.tempImageUrl && !device.iconPath) {
        return {
          backgroundColor: defaultColor,
        };
      } else {
        return {};
      }
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

.device-label {
  flex: 1;
  font-weight: bold;
  margin-right: 20px;
}

.file-input {
  display: none;
}

.custom-file-upload {
  display: inline-block;
  padding: 8px 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  border: none;
  transition: background-color 0.2s;
}

.custom-file-upload:hover {
  background-color: #0056b3;
}

.file-name {
  margin-left: 10px;
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}

.preview-icon {
  height: 40px;
  width: 40px;
  margin-left: 20px;
  border-radius: 5px;
  object-fit: cover;
}
.avatar-icon {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>

<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="input-wrapper">
        <input type="text" v-model="userId" placeholder="User ID" required />
        <i class="user-icon"></i>
      </div>
      <div class="input-wrapper">
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
        />
        <i class="password-icon"></i>
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      this.$emit("login-success", this.userId);
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-wrapper {
  position: relative;
  margin-bottom: 15px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.user-icon,
.password-icon {
  position: absolute;
  left: 10px;
  top: 35px;
}

.login-button {
  padding: 10px 20px;
  border: none;
  background-color: #0084ff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>

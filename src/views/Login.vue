<template>
  <div class="login">
    <button @click="googleLogin">Googleアカウントでログイン</button>
  </div>
</template>

<script>
import auth from "../utils/auth";
export default {
  methods: {
    googleLogin() {
      auth.googleLogin();
    }
  }
};
</script>

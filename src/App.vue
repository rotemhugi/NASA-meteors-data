<template>
  <v-app>
    <v-app-bar
      app
      color="#eee9e1"
    >
      <div class="d-flex align-center">
        <v-img
          :src="require('./assets/nasaLogo.png')"
          width="100"
        />
        <h1>Placer Assingment</h1>
      </div>
    </v-app-bar>

    <v-main class='nasa'>
      <Home/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Home from './views/Home.vue'

export default Vue.extend({
  name: 'App',

  components: {
    Home,
  }
  
});
</script>

<style>

.nasa{
  background-image: url('./assets/nasaBackground.jpg');
  color: white;
  background-size: 100%;
}

</style>

<template>
  <div id="app">
    <div class="router-list">
      <router-link v-for="route in $router.options.routes" :key="route.path" :to="route.path">
        {{ route.path }}
      </router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},
  data() {
    return {}
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

<template>
  <div class="auto-size">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'AutoSize'
}
</script>

<style scoped>
  .auto-size {
    width: 200px;
    background-color: lightblue;
  }
</style>

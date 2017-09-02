<template>
  <div class="container">
    <div v-if="dashboardType === 'washer'">
    <!-- washer -->
      
    </div>
    <div v-else>
    <!-- client -->
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      dashboardType: this.$route.params.type
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

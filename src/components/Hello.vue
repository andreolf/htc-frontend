<template>
  <div class="container">
  <h1>Il bucato non è più un problema</h1>
  <p>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum</p>
  <div>
    <button class="btn btn-default" @click="toDashboard('/signup/washer')">VOLGIO LAVARE I PANNI</button>
    <button class="btn btn-default" @click="toDashboard('/signup/client')">HO DEI PANNI SPORCHI</button>
  </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  methods: {
    toDashboard: function (name) {
      if (this.$cookie.get('auth')) return this.$router.push('/dashboard/' + this.$cookie.get('account_type'))
      return this.$router.push(name)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

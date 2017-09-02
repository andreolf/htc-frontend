<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#" @click.prevent="$router.push('/')">Wash My Pants</a>
        </div>
        <ul class="nav navbar-nav pull-right">
          <li><a href="#" @click.prevent="$modal.show('dialog', dialogContent)"><button class="btn btn-default">LOGIN</button></a></li>
        </ul>
      </div>
    </nav>
    <v-dialog/>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      dialogContent: {
        title: 'login',
        text: '<b>inputs</b>',
        buttons: [
          { title: 'CHIUDI' },
          { title: 'LOGIN', handler: () => { this.login } }
        ]
      }
    }
  },
  methods: {
    login: function () {
      return ''
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

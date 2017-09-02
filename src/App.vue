<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#" @click.prevent="$router.push('/')">Wash My Pants</a>
        </div>
        <ul class="nav navbar-nav pull-right">
          <li v-if="!this.$cookie.get('auth')"><a href="#" @click.prevent="$modal.show('dialog', dialogContent)"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
          <li class="dropdown" v-else>
            <a class="dropdown-toggle" data-toggle="dropdown" href="#">{{this.$cookie('full_name')}}
            <span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><a href="#">Modifica profilo</a></li>
              <li><a href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
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
      login: {
        password: '',
        email: ''
      },
      dialogContent: {
        title: 'Accedi al tuo account',
        text: '<div class="form-group"> <label>Email</label> <input type="email" name="" class="form-control" required="" id="login-email"> </div> <div class="form-group"> <label>Password</label> <input type="password" name="" class="form-control" required="" id="login-password"> </div>',
        buttons: [
          { title: 'CHIUDI' },
          { title: 'LOGIN', handler: () => { this.loginAction(document.getElementById('login-email').value, document.getElementById('login-password').value) } }
        ]
      }
    }
  },
  created () {
    this.Bus.$on('loginFromSignup', (email) => {
      console.log(email)
      this.loginAction(email, 'hack-the-city-2017')
    })
  },
  methods: {
    loginAction: function (email, password) {
      var obj = {
        'email': email,
        'password': password
      }
      this.$axios.post(`${this.$config.BASE_API}/login`, obj).then((response) => {
        console.log(response)
        if (response.data.success === true) {
          var userType = response.data.type
          var auth = 'Basic ' + window.btoa('user:hack-the-city-2017')
          this.$cookie.set('auth', true)
          this.$cookie.set('email', obj.email)
          this.$cookie.set('full_name', response.data.full_name)
          this.$cookie.set('authorization', auth)
          window.location.href = '/dashboard/' + userType
        }
      }).catch((e) => {
        console.log(e)
        this.$toasted.error('Errore, login fallito, riprova')
      })
    },
    logout: function () {
      this.$cookie.remove('auth')
      this.$cookie.remove('email')
      this.$cookie.remove('authorization')
      window.location.href = '/'
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

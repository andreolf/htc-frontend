<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="#" @click.prevent="$router.push('/')">WASH MY PANTS</a>
        </div>
        <ul class="nav navbar-nav pull-right">
          <li v-if="!this.$cookie.get('auth')"><a href="#" @click.prevent="$modal.show('dialog', dialogContent)"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
          <li class="dropdown" v-else>
            <a class="dropdown-toggle" data-toggle="dropdown" href="#"><avatar :size="30" :username="fullName" class="center-loader"></avatar> <span>{{fullName}}</span>
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
    <footer class="footer" style="background-color:rgb(240, 240, 240);margin-top:250px;">
      <div class="container text-center">
        <p class="text-muted" style="padding: 2% 0;">WASH MY PANTS - <b>HACK THE CITY 2017</b></p>
      </div>
    </footer>
  </div>
</template>

<script>
import Avatar from 'vue-avatar/dist/Avatar'

export default {
  name: 'app',
  components: {
    Avatar
  },
  data () {
    return {
      login: {
        password: '',
        email: ''
      },
      fullName: this.$cookie.get('full_name'),
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
          this.$cookie.set('account_type', userType)
          window.location.href = '/dashboard/' + userType
        } else throw new Error('login fallito')
      }).catch((e) => {
        console.log(e)
        this.$toasted.error('Errore, login fallito, riprova')
      })
    },
    logout: function () {
      this.$cookie.remove('auth')
      this.$cookie.remove('email')
      this.$cookie.remove('authorization')
      this.$cookie.remove('hasSub')
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
.center-loader {
  display: inline-block;
}
.navbar {
  background-color: #7760e8 !important;
}
.btn-info {
  background-color: #7760e8 !important;
}
.navbar-brand {
  font-size: 1.3em;
}
li > a {
      font-size: 1.2em;
}
label {
  font-size: 15px !important;
}
</style>

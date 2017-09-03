<template>
  <div class="container">
  <div class="row">
  <div class="col-md-6 col-sm-offset-3">
    <h2>Registrazione</h2>
    <p>Ti stai registrando come {{getType}}</p>
    <div class="form-group">
      <label>Nome completo</label>
      <input type="text" name="" class="form-control" placeholder="Mario Rossi" required="" v-model="form.full_name">
    </div>
    <div class="form-group">
      <label>Indirizzo email</label>
      <input type="email" name="" class="form-control" placeholder="email@email.com" required="" v-model="form.email">
    </div>
    <div class="form-group">
      <label>Numero di telefono</label>
      <input type="text" name="" class="form-control" placeholder="990 777 8782" required="">
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" name="" class="form-control" placeholder="Minimo 6 caratteri" required="" v-model="form.password">
    </div>
    <div class="form-group">
      <label>Indirizzo</label>
      <gmap-map
        :center="center"
        :zoom="17"
        map-type-id="terrain"
        style="width: 100%; height: 140px"
      >
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="false"
        ></gmap-marker>
      </gmap-map>
      <vue-google-autocomplete
          id="map-input"
          classname="form-control"
          placeholder="Spazio Officina, Via D. Alighieri 4, 6830 Chiasso, Switzerland"
          v-on:placechanged="mapLocation" :enable-geolocation="true" required=""
      ></vue-google-autocomplete>
      <small class="form-text text-muted" v-if="signUpType === 'client'">Dove ritireremo e consegnermo i panni</small>
      <small class="form-text text-muted" v-else>Dove laverai i panni</small>
      <br><br>
      <div class="text-center">
      <button class="btn btn-info text-center btn-lg" @click.prevent="signUp">REGISTRATI</button>
      </div>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  name: 'signup',
  components: {
    VueGoogleAutocomplete
  },
  data () {
    return {
      msg: '',
      center: {lat: 45.837117, lng: 9.026937},
      defaultLocation: 'Spazio Officina, Via D. Alighieri 4, 6830 Chiasso, Switzerland',
      markers: [{position: {lat: 45.837117, lng: 9.026937}}],
      signUpType: this.$route.params.type,
      form: {
        password: '',
        email: '',
        full_name: '',
        address: ''
      }
    }
  },
  computed: {
    getType: function () {
      if (this.signUpType === 'washer') return 'Washer'
      else return 'Cliente'
    }
  },
  methods: {
    mapLocation: function (val) {
      console.log(val)
      var position = {lat: val.latitude, lng: val.longitude}
      this.form.address = document.getElementById('map-input').value
      this.markers = [{position: position}]
      this.center = position
    },
    signUp: function () {
      this.$axios.post(`${this.$config.BASE_API}/${this.signUpType}`, this.form).then((response) => {
        console.log(response)
        if (response.status !== 201) throw new Error('account non creato')
        this.Bus.$emit('loginFromSignup', this.form.email)
      }).catch((e) => {
        console.log(e)
        this.$toasted.error('Si è verification un\'errore, riprova, causa: ' + e.message)
      })
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

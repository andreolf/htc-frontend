<template>
  <div class="container">
    <div class="row" v-if="paymentRunning === false">
      <div class="col-md-6 col-sm-offset-3">
        <h2>Crea un nuovo abbonamento</h2>
        <p>Ogni venerdì ritireremo i tuo panni</p>
        <div class="form-group form-inline">
          <label>Durata totale</label>
          <div class="input-group">
            <span class="input-group-btn">
                <button type="button" class="quantity-left-minus btn btn-number" @click.prevent="addCounter('months', -1)">
                  <span class="glyphicon glyphicon-minus"></span>
                </button>
            </span>
            <input :value="months + ' ' + monthText" class="input-add" readonly=""></input>
            <span class="input-group-btn">
                <button type="button" class="quantity-left-minus btn btn-number" @click.prevent="addCounter('months', 1)">
                    <span class="glyphicon glyphicon-plus"></span>
                </button>
            </span>
          </div>
        </div>
        <div class="form-group form-inline">
          <label>Numero di bucati settimanali</label>
          <div class="input-group">
            <span class="input-group-btn">
                <button type="button" class="quantity-left-minus btn btn-number" @click.prevent="addCounter('weeklyWash', -1)">
                  <span class="glyphicon glyphicon-minus"></span>
                </button>
            </span>
            <input :value="weeklyWash" class="input-add" readonly=""></input>
            <span class="input-group-btn">
                <button type="button" class="quantity-left-minus btn btn-number" @click.prevent="addCounter('weeklyWash', 1)">
                    <span class="glyphicon glyphicon-plus"></span>
                </button>
            </span>
          </div>
        </div>
        <div class="form-group form-inline">
          <label>Data di inizio</label>
          <datepicker :value="startDate" :monday-first="true" :calendar-button="true" required language="it"calendar-button-icon="glyphicon glyphicon-calendar" input-class="form-control" :disabled="{to: new Date()}"></datepicker>
        </div>
        <div class="text-center">
          <p>Totale lavaggi: {{totalWash}}</p>
        </div>
          <br>
          <div class="text-center">
          <h4>COSTO: {{getTotalPrice}} CHF</h4>
          <a href="#" @click.prevent="paySub"><img src="http://i.imgur.com/z5PrhDK.png" width="40%"></a>
          </div>
        </div>
      </div>
      <div class="row text-center">
        <div class="col-md-2 col-md-offset-5">
          <bounce-loader :loading="paymentRunning === true" style="padding: 50% 0;" class="center-loader"></bounce-loader>
        </div>
      </div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
const moment = require('moment')

export default {
  name: 'subscribe',
  components: {
    Datepicker,
    BounceLoader
  },
  data () {
    return {
      startDate: this.startDateDef || moment().day(1).toDate(),
      months: this.monthsDef || 1,
      weeklyWash: this.weeklyWashDef || 1,
      washPrice: 25,
      paymentRunning: false
    }
  },
  props: ['startDateDef', 'monthsDef', 'weeklyWashDef'],
  methods: {
    addCounter: function (varName, int) {
      var counter = this[varName] + int
      if (counter < 0) {
        this[varName] = 0
      } else this[varName] = counter
    },
    getNumWeeksForMonth: function () {
      var year = moment(this.startDate).year()
      var month = moment(this.startDate).month()
      var date = new Date(year, month - 1, 1)
      var day = date.getDay()
      var numDaysInMonth = new Date(year, month, 0).getDate()
      return Math.ceil((numDaysInMonth + day) / 7)
    },
    paySub: function () {
      if (this.getTotalPrice > 0) {
        this.paymentRunning = true
        setTimeout(() => {
          this.$toasted.success('Pagamento effettuato con successo')
        }, 600)
        setTimeout(() => {
          this.newSub()
        }, 1400)
      } else this.$toasted.error('Errore, costo uguale a 0')
    },
    newSub: function () {
      var subDetails = {
        startDate: this.startDate,
        months: this.months,
        weeklyWash: this.weeklyWash,
        email: this.$cookie.get('email'),
        totalWash: this.totalWash
      }
      this.$axios.post(this.$config.BASE_API + '/new_sub', subDetails).then((response) => {
        console.log(response)
        window.location.href = '/dashboard/client'
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  computed: {
    totalWash: function () {
      return this.months * 4 * this.weeklyWash
    },
    getTotalPrice: function () {
      return this.washPrice * this.totalWash
    },
    monthText: function () {
      if (this.months === 1) return 'mese'
      return 'mesi'
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
.middle-text {
  padding: 0 15px;
    vertical-align: middle;
}
.input-add {
      height: 39px;
    width: 64px;
    text-align: center;
}
</style>

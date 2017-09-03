<template>
  <div class="container">
    <div v-if="dashboardType === 'washer'">
    <!-- washer -->
      <div class="row">
        <div class="col-md-6">
          <div class="panel panel-default">
            <div class="panel-body text-center">
              <bounce-loader :loading="balance === null" class="center-loader"></bounce-loader>
              <h3 v-if="balance !== null">CHF <b>{{balance}}</b></h3>
              <p class="text-muted text-center">SALDO ATTUALE</p>
              <!--<small class="text-muted">I soldi ti verranno consegnati alla fine del mese</small>-->
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <button class="btn btn-lg btn-info" style="margin-top:20px;">MODIFICA MODALITA' DI PAGAMENTO</button>
          <p class="text-muted" style="margin-left: 35px;">I soldi ti verranno consegnati alla fine del mese</p>
        </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <h3>PROSSIMI BUCATI</h3>
            <p class="text-muted">Prossimi bucati da ritirare</p>

            <skew-loader :loading="nextWashList === null" style="padding: 10% 0;"></skew-loader>
            <span v-if="washerSubIdList !== null && washerSubIdList.length > 0">
              <div class="panel panel-default" v-for="obj in nextWashList">
                <div class="panel-body">
                  <p>Indirizzo: {{obj.address}}</p>
                  <p>{{getStringDate(moment().day(5).toDate())}} ({{getTimeDiffDay(moment().day(5).toDate())}})</p>
                </div>
              </div>
            </span>
            <p v-else class="text-muted text-center" style="padding: 10% 0;">Accetta almeno un ordine</p>
          </div>
          <div class="col-md-6">
            <h3>RICHIESTE ATTIVE</h3>
            <p class="text-muted">Richieste attive nella tua zona</p>
            <skew-loader :loading="activeWashList === null" style="padding: 10% 0;"></skew-loader>
            <div class="panel panel-default" v-for="obj in activeWashList">
              <div class="panel-body">
                <p>Abbonamento {{totSub(obj)}} {{subMonthsName(obj)}}</p>
                <p>Indirizzo: {{obj.address}}</p>
                <p>Inizio: {{getStringDate(obj.plan_start)}} ({{getTimeDiffDay(obj.plan_start)}})</p>
                <p class="text-center"><button class="btn btn-success" @click="acceptOrder(i, obj)">ACCETTA</button></p>
              </div>
            </div>
            <p class="text-center text-muted" v-if="activeWashList !== null && activeWashList.length === 0" style="padding: 10% 0;">Nessuna richiesta attiva al momento</p>
          </div>
        </div>
    </div>
    <div v-else>
    <!-- client -->
      <div class="row">
        <div v-if="hasSub === null">
          <div class="col-md-12 text-center">
            <bounce-loader :loading="true" class="center-loader" style="padding: 20% 0;"></bounce-loader>
          </div>
        </div>
        <div v-else>
          <div v-if="hasSub">
            <div class="col-md-5">
              <h4>PROMEMORIA</h4>
              <div class="panel panel-default">
                <div class="panel-body">
                  <p>I tuoi vestiti arriveranno {{getTimeDiffDay(moment().day(5).toDate(), new Date())}}!
                  ricordati di rimanere a casa {{getStringDate(moment().day(5).toDate())}} tra le 19:00 e le 21:00</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <h4>LAVAGGI RIMASTI</h4>
              <div class="panel panel-default">
                <div class="panel-body text-center">
                  <bounce-loader :loading="remWash === null" class="center-loader"></bounce-loader>
                  <h1 style="padding:0px;margin:0px;">{{remWash}}</h1>
                  <button class="btn btn-default btn-small" style="margin-top: 18px;">AGGIUNGI</button>
                </div>
              </div>
            </div>
              <div class="col-md-4">
                <h4>INFO WASHER</h4>
                <div class="panel panel-default">
                  <div class="panel-body">
                    <div v-if="washerAssigned !== null">
                    <p>{{washerAssigned.full_name.split(' ')[0] + ', ' + washerAssigned.address}}</p>
                      <p class="text-center">
                      <button class="btn btn-success text-center" style="width: 100%;"><i class="glyphicon glyphicon-earphone"></i> CONTATTA</button>
                      </p>
                    </div>
                    <p v-else class="text-muted text-center">In attesa...</p>
                  </div>
                </div>
              </div>
          </div>
          <subscribe v-else/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
import SkewLoader from 'vue-spinner/src/SkewLoader.vue'
import Subscribe from '@/components/Subscribe.vue'
const moment = require('moment')
moment.locale('it')

export default {
  name: 'dashboard',
  components: {
    BounceLoader,
    SkewLoader,
    Subscribe
  },
  data () {
    return {
      dashboardType: this.$route.params.type,
      balance: null,
      nextWashList: null,
      activeWashList: null,
      washerSubIdList: [],
      email: this.$cookie.get('email'),
      paymentAdded: null,
      remWash: null,
      hasSub: this.$cookie.get('hasSub') || null,
      washerAssigned: null,
      subDetails: null,
      interval: null
    }
  },
  created () {
    this.getAccountInfo()
    if (this.interval !== null) return
    this.interval = setInterval(() => {
      this.getDynamicInfo()
    }, 5000)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    moment: moment,
    getDynamicInfo: function () {
      if (this.dashboardType === 'client') {

      } else {
        this.getAllSubs()
      }
    },
    getTimeDiffDay: function (fromA, toDate) {
      toDate = typeof toDate === 'undefined' ? new Date() : toDate
      var a = moment(fromA)
      var b = moment(toDate)
      return a.from(b)
    },
    getStringDate: function (date) {
      return moment(date).format('dddd DD MMMM')
    },
    acceptOrder: function (index, sub) {
      var obj = {
        'sub_id': sub._id,
        'email': this.$cookie.get('email')
      }
      this.$axios.post(this.$config.BASE_API + '/accept_order', obj).then((response) => {
        console.log(response)
        this.$toasted.success('Ordine accettato con successo')
        if (index !== null) this.activeWashList.splice(index, 1)
        this.nextWashList.push(sub)
      }).catch((e) => {
        console.log(e)
      })
    },
    totSub: function (obj) {
      var tot = (obj.wash_total / obj.wash_weekly) / 4
      return tot
    },
    subMonthsName: function (obj) {
      var tot = this.totSub(obj)
      if (tot > 1) return 'mesi'
      else return 'mese'
    },
    getMySubs: function (subId) {
      var url = this.$config.BASE_API + '/subs/'
      if (typeof subId === 'undefined') {
        console.log(this.washerSubIdList)
        var queryString = `?where={"$or":`
        var subArr = this.washerSubIdList.map((val) => {
          return {'_id': val}
        })
        console.log(subArr)
        queryString += JSON.stringify(subArr) + '}'
        url += queryString
      } else url += subId
      this.$axios.get(url).then((response) => {
        console.log(response)
        var data = response.data._items || response.data
        if (subId) {
          this.getWasherBySub(subId)
          this.subDetails = data
          this.remWash = data.wash_total - data.wash_done
        } else {
          this.nextWashList = data
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    getWasherBySub: function (subId) {
      var data = {
        'sub_id': subId
      }
      this.$axios.post(this.$config.BASE_API + '/get_matching_subs', data).then((response) => {
        console.log(response)
        if (typeof response.data.washer !== 'undefined') this.washerAssigned = response.data.washer
      }).catch((e) => {
        console.log(e)
      })
    },
    getAllSubs: function () {
      this.$axios.get(this.$config.BASE_API + '/all_available_subs').then((response) => {
        console.log(response)
        if (this.activeWashList !== null && response.data.active_subs && response.data.active_subs.length > 0 && response.data.active_subs.length !== this.activeWashList.length) {
          const self = this
          this.$toasted(`Nuova richiesta disponibile, ${response.data.active_subs[0].address}`, {'fullWidth': true, action: {text: 'ACCETTA', onClick: function (e, t) { self.acceptOrder(null, response.data.active_subs[0]) }}, duration: 8000})
        }
        this.activeWashList = response.data.active_subs
      }).catch((e) => {
        console.log(e)
      })
    },
    getAccountInfo: function () {
      var queryString = `?where={"email":"${this.email}"}`
      this.$axios.get(this.$config.BASE_API + '/' + this.dashboardType + '/' + queryString).then((response) => {
        console.log(response)
        var data = response.data._items[0]
        console.log(data)
        if (typeof data['balance'] !== 'undefined') this.balance = data.balance
        if (data.payment_added) this.paymentAdded = data.payment_added
        if (this.dashboardType === 'client') {
          this.hasSub = data.sub_id
          this.$cookie.set('hasSub', data.sub_id)
        } else {
          try {
            if (data.running_sub_id.length > 0) this.washerSubIdList = data.running_sub_id
            this.nextWashList = []
          } catch (e) {
            this.washerSubIdList = []
            this.nextWashList = []
          }
          this.getAllSubs()
        }
        if (this.hasSub) this.getMySubs(this.hasSub)
        else if (this.washerSubIdList.length > 0) {
          this.getMySubs()
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

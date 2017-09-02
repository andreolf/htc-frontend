<template>
  <div class="container">
    <div v-if="dashboardType === 'washer'">
    <!-- washer -->
      <div class="row">
        <div class="col-md-4 col-md-offset-2">
          <div class="panel panel-default">
            <div class="panel-body text-center">
              <bounce-loader :loading="balance === null" class="center-loader"></bounce-loader>
              <h3 v-if="balance !== null">CHF <b>{{balance}}</b></h3>
              <p class="text-muted text-center">SALDO ATTUALE</p>
              <!--<small class="text-muted">I soldi ti verranno consegnati alla fine del mese</small>-->
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <button class="btn btn-lg btn-info">MODIFICA MODALITA' DI PAGAMENTO</button>
        </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <h3>PROSSIMI BUCATI</h3>
            <p class="text-muted">xxxxxx</p>

            <skew-loader :loading="nextWashList === null" style="padding: 10% 0;"></skew-loader>
            <div class="panel panel-default" v-for="obj in nextWashList">
              <div class="panel-body">
                
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <h3>RICHIESTE ATTIVE</h3>
            <p class="text-muted">xxxxxx</p>

            <skew-loader :loading="activeWashList === null" style="padding: 10% 0;"></skew-loader>
            <div class="panel panel-default" v-for="obj in activeWashList">
              <div class="panel-body">
                obj
              </div>
            </div>
          </div>
        </div>
    </div>
    <div v-else>
    <!-- client -->
      <div class="row">
        <div v-if="hasSub === null">
          <bounce-loader :loading="true" class="center-loader"></bounce-loader>
        </div>
        <div v-else>
          <div v-if="hasSub == true">
            
          </div>
          <subscribe v-else="hasSub == false"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
import SkewLoader from 'vue-spinner/src/SkewLoader.vue'
import Subscribe from '@/components/Subscribe.vue'

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
      hasSub: this.$cookie.get('hasSub') || null
    }
  },
  methods: {
    getMySubs: function (subId) {
      var url = this.$config.BASE_API + '/subs/'
      if (typeof subId === 'undefined') {
        var queryString = `?where={"$or":[`
        this.washerSubIdList.map((val) => {
          this.queryString += `{"sub_id":${val}}`
        })
        queryString += ']}'
        url += queryString
      } else url += subId
      this.$axios.get(url).then((response) => {
        console.log(response)
      }).catch((e) => {
        console.log(e)
      })
    },
    getWasherBySub: function (subId) {
      var queryString = `?where={"running_sub_id":{"$in": [${subId}]}}`
      this.$axios.get(this.$config.BASE_API + '/washer/' + queryString).then((response) => {
        console.log(response)
      }).catch((e) => {
        console.log(e)
      })
    },
    getAllSubs: function () {
      this.$axios.get(this.$config.BASE_API + '/all_available_subs').then((response) => {
        console.log(response)
        this.activeWashList = response.data.active_subs
      }).catch((e) => {
        console.log(e)
      })
    },
    getAccountInfo: function () {
      this.$axios.get(this.$config.BASE_API + '/' + this.dashboardType + '/' + this.email).then((response) => {
        console.log(response)
        var data = response.data
        if (data.balance) this.balance = data.balance
        if (data.payment_added) this.paymentAdded = data.payment_added
        if (this.dashboardType === 'client') {
          this.hasSub = data.sub_id
          this.$cookie.set('hasSub', data.sub_id)
        } else {
          this.washerSubIdList = data.running_sub_id
          this.getAllSubs()
        }
        this.getMySubs()
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

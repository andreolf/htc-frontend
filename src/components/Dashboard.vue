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

            <skew-loader :loading="nextWashList === null"></skew-loader>
            <div class="panel panel-default" v-for="obj in nextWashList">
              <div class="panel-body">
                
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <h3>RICHIESTE ATTIVE</h3>
            <p class="text-muted">xxxxxx</p>

            <skew-loader :loading="activeWashList === null"></skew-loader>
            <div class="panel panel-default" v-for="obj in activeWashList">
              <div class="panel-body">
                
              </div>
            </div>
          </div>
        </div>
    </div>
    <div v-else>
    <!-- client -->
      <div class="row">
        <subscribe/>
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
      email: {'email': this.$cookie.get('email')},
      paymentAdded: null
    }
  },
  methods: {
    getMySubs: function () {
      this.$axios.post(this.$config.BASE_API + '/get_my_subs', this.email).then((response) => {
        console.log(response)
      }).catch((e) => {
        console.log(e)
      })
    },
    getAccountInfo: function () {
      this.$axios.post(this.$config.BASE_API + '/account_info', this.email).then((response) => {
        console.log(response)
        var data = response.data
        this.balance = data.balance
        this.paymentAdded = data.payment_added
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

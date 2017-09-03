<template>
  <div>
  <div class="container text-center">
  <h1>Il bucato non è più un problema</h1>
  <p>Wash My Pants é una startup ticinese che si propone di risolvere una volta per tutte il problema del bucato nella vita delle persone</p>
  <br>
  <div>
    <button class="btn btn-default btn-info" @click="toDashboard('/signup/washer')">VOGLIO LAVARE I PANNI</button>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <button class="btn btn-default btn-info" @click="toDashboard('/signup/client')">HO DEI PANNI SPORCHI</button>
  </div>
  </div>
  <br><br>
  <div class="container">
    <h3 class="text-center">COME FUNZIONA</h3>
    
    <div class="row">
      <div class="col-md-6">
        <h4 class="text-center">PER I WASHER</h4>
        <p>
        Desideri un lavoro flessibile, che ti permetta di arrotondare lo stipendio?<br>

        Sei un/una drago/a a stirare lenzuola, magliette e camicie?<br>

        Iscrivendoti come washer, ogni settimana potrai accettare gli incarichi proposti dal nostro sistema.<br>

        Quello che dovrai fare è andare a raccogliere i vestiti sporchi a casa del cliente: esattamente una settimana dopo dovrai riportarli lavati e stirati.
        </p>
      </div>
      <div class="col-md-6">
        <h4 class="text-center">PER I WASHEE</h4>
        <p>
        Grazie a Wash My Pants, potrai finalmente smettere di fare il bucato.<br>

        Noi selezioneremo il/la washer piu' vicina a casa tua, che verra' a prendere i tuoi vestiti sporchi direttamente sulla soglia di casa e te li riportera' lavati e stirati la settimana seguente, nel giorno da te prescelto.<br>

        Tutto quello che dovrai fare è prepare i tuoi vestiti sporchi in una cesta e aspettare a casa: al resto pensiamo noi!
        </p>
      </div>
    </div>
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

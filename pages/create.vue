<template>
  <div>
    <v-alert
      v-model="alert"
      dismissible
      v-bind:type="messageType"
    >{{ message }}</v-alert>
    <v-form>
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            <v-text-field
              label="Name*"
              placeholder="名称"
              id="name"
              v-model="name"
              required
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
          >
            <v-text-field
              label="Description"
              placeholder="内容の説明"
              id="description"
              v-model="description"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-btn
            elevation="2"
            v-on:click="postRecord($event)"
          >Save</v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      description: '',
      alert: false,
      successlog: '',
      message: '',
      messageType: 'success',
    }
  },
  computed: {
    loginUser () {
      return this.$store.state.loginUser;
    }
  },
  created () {
    if (!this.$store.state.loginUser) {
      this.$router.push('/');
    }
  },
  methods: {
    async postRecord () {
      // console.log(this.name);
      // console.log(this.description);
      const APIKEY = process.env.apikey // set API-KEY
      const header = { // set Custom Header
        headers: {
          'Content-Type': 'Content-Type:application/graphql',
          'x-api-key': APIKEY,
        }
      }
      // console.log(header);
      const query = { // set Query
        query: `mutation {addNote(record: {name: {value: "${this.name}"}, owner: {value: "${this.loginUser}"}, description: {value: "${this.description}"}}){id, revision}}`
      }
      // console.log(query);
      const url = process.env.graphqlendpoint;
      const response = await this.$axios.post(url, query, header);
      // console.log(response);
      if (response.data.data.addNote && response.status === 200) {
        this.message = `success: ${JSON.stringify(response.data)}`;
        this.alert = true;
        this.name = ''
        this.description = ''
      } else {
        this.messageType = 'error';
        this.message = `error: ${JSON.stringify(response.data)}`;
        this.alert = true;
      }
    }
  }
}
</script>
<template>
  <div>
    <v-alert
      v-model="alert"
      dismissible
      v-bind:type="messageType"
      v-on:input="onClose"
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
              v-model="description"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-btn
            elevation="2"
            v-on:click="putRecord()"
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
      id: this.$store.state.note.id,
      name: this.$store.state.note.name,
      description: this.$store.state.note.description,
      loginUserName: this.$store.state.loginUser,
      alert: false,
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
    onClose () {
      console.log('alert=>', this.alert);
      if (!this.alert) {
        this.$router.push('/');
      }
    },
    async putRecord () {
      console.log(this.name);
      console.log(this.description);
      const APIKEY = process.env.apikey // set API-KEY
      const header = { // set Custom Header
        headers: {
          'Content-Type': 'Content-Type:application/graphql',
          'x-api-key': APIKEY,
        }
      }
      console.log(header);
      const query = { // set Query
        query: `mutation {updateNote(id: "${this.id}", record: {name: {value: "${this.name}"}, owner: {value: "${this.loginUser}"}, description: {value: "${this.description}"}}){revision}}`
      }
      console.log(query);
      const url = 'https://qb2txkpibjagrojauacuiradwe.appsync-api.ap-northeast-1.amazonaws.com/graphql';
      const response = await this.$axios.post(url, query, header);
      console.log(response);
      if (response.data.data.updateNote && response.status === 200) {
        this.message = `succsess: ${JSON.stringify(response.data)}`;
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
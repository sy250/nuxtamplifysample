<template>
  <amplify-authenticator>
    <v-app>
      <Header />
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
      <v-card>
        <v-footer app>
          <v-row
            justyfy="center"
          >
            <v-col
              align-self="center"
            >loginUser: {{ loginUser }}</v-col>
            <v-col>
              <amplify-sign-out></amplify-sign-out>
            </v-col>
          </v-row>
        </v-footer>
      </v-card>
    </v-app>
  </amplify-authenticator>
</template>
<script>
export default {
  computed: {
    loginUser () {
      return this.$store.state.loginUser;
    }
  },
}
</script>

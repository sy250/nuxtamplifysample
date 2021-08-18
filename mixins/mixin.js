export default {
  data () {
    return {
      headers: [
        { text: 'id', value: 'id' },
        { text: 'name', value: 'name' },
        { text: 'description', value: 'description' },
        { text: 'owner', value: 'owner' },
      ],
      elevation: '',
      user: '',
      signedIn: '',
      posts: [],
      unsubscribeAuth: '',
      authState: '',
    }
  },
  computed: {
    loginUser () {
      return this.$store.state.loginUser;
    }
  },
  methods: {
    async getRecords (loginUser) {
      const APIKEY = process.env.apikey // set API-KEY
      const header = { // set Header
        headers: {
          'Content-Type': 'Content-Type:application/graphql',
          'x-api-key': APIKEY,
        }
      }
      console.log(header);
      const query = { // set Query
        query: `query {listNotesForUser(owner:"${loginUser}"){records {id{value},name{value},description{value},owner{value}}}}`
      }
      console.log(query);
      const url = 'https://qb2txkpibjagrojauacuiradwe.appsync-api.ap-northeast-1.amazonaws.com/graphql';
      const response = await this.$axios.post(url, query, header);
      console.log(response);
      if (response.data.data.listNotesForUser) {
        const arrayPosts = response.data.data.listNotesForUser.records.map((k, i) => {
          return {
                  index: i,
                  id: k.id.value,
                  name: k.name.value,
                  description: k.description.value,
                  owner: k.owner.value,
          }
        });
        console.log(arrayPosts);
        this.posts = arrayPosts;
        this.$store.dispatch('setPosts', arrayPosts);
      } else {
        console.log('Not posts data');
        this.posts = [];
        this.$store.dispatch('setPosts', []);
      }
    },
    async deleteRecord(id) {
      const APIKEY = process.env.apikey // set API-KEY
      const header = { // set Header
        headers: {
          'Content-Type': 'Content-Type:application/graphql',
          'x-api-key': APIKEY,
        }
      }
      console.log(header);
      const query = { // set Query
        query: `mutation {deleteNote(ids:"${id}")}`
      }
      console.log(query);
      const url = 'https://qb2txkpibjagrojauacuiradwe.appsync-api.ap-northeast-1.amazonaws.com/graphql';
      const response = await this.$axios.post(url, query, header);
      console.log(response);
      if (response.data.data.deleteNote && response.status === 200) {
        console.log(`success: ${JSON.stringify(response.data)}`);
        return response;
      } else {
        console.log(`error: ${JSON.stringify(response)}`);
        return response;
      }
    }
  },
};

<template>
  <v-container>
    <v-container>
      <v-alert
        v-model="alert"
        dismissible
        v-bind:type="messageType"
        v-on:input="onClose"
      >{{ message }}</v-alert>
      <v-alert
        v-model="confirm"
        v-bind:color="confirmMessageColor"
        v-bind:type="confirmMessageType"
      >
        <v-row align="center">
          <v-col class="grow">
            Note. {{ message }}
          </v-col>
          <v-col class="shrink">
            <v-btn
              color="grey darken-1"
              v-on:click="confirm = false"
            >CANCEL</v-btn>
          </v-col>
          <v-col class="shrink">
            <v-btn
              color="blue lighten-1"
              v-on:click="onDeleteRecord"
            >OK</v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-container>
    <v-container>
      <v-btn
        elevation="2"
        nuxt
        to="/create"
      >Create</v-btn>
      <v-btn
        elevation="2"
        v-on:click="getRecords(loginUser)"
      >Read</v-btn>
      <v-btn
        elevation="2"
        v-on:click="linkToUpdate(isItemSelect)"
      >Update</v-btn>
      <v-btn
        elevation="2"
        v-on:click="deleteConfirm(isItemSelect)"
      >Delete</v-btn>
    </v-container>
    <v-container>
      <v-card>
        <v-card-text>
          <v-form>
            <v-data-table
              :headers="headers"
              :items="this.$store.state.posts"
              :items-per-page="5"
              :class="elevation-1"
              show-select
              :single-select="singleSelect"
              v-model="selected"
              v-on:item-selected="onTableChange"
            >
              <template v-slot:[`item.id`]="{ item }">
                {{ item.id }}
              </template>
              <template v-slot:[`item.name`]="{ item }">
                {{ item.name }}
              </template>
              <template v-slot:[`item.description`]="{ item }">
                {{ item.description }}
              </template>
              <template v-slot:[`item.owner`]="{ item }">
                {{ item.owner }}
              </template>
            </v-data-table>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container> 
</template>
<script>
  import mixin from '~/mixins/mixin';
  import { onAuthUIStateChange } from '@aws-amplify/ui-components';
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
        singleSelect: true,
        selected: [],
        dialog: false,
        item: [],
        itemSelect: false,
        note: {
          id: 'id sample',
          name: 'name sample',
          description: 'description sample',
        },
        confirm: false,
        confirmMessageType: 'info',
        confirmMessageColor: 'blue darken-1',
        alert: false,
        message: '',
        messageType: 'success',
      }
    },
    mixins: [mixin],
    created() {
      // console.log('created this =>', this);
      // console.log('created this.data =>', this.data);
      // console.log('created this.$store.loginUser =>', this.$store.state.loginUser);
    },
    computed: {
      loginUser () {
        return this.$store.state.loginUser;
      },
      isItemSelect () {
        return this.itemSelect;
      }
    },
    methods: {
      onClose () {
        // console.log('alert=>', this.alert);
        if (!this.alert) {
          this.$router.push('/');
        }
      },
      onTableChange(item) {
        // console.log(item.value);
        // console.log(item);
        this.itemSelect = item.value;
        if (item.value) {
          this.item = item;
          this.note = {
            id : item.item.id,
            name : item.item.name,
            description : item.item.description,
          };
          this.$store.dispatch('setNote', this.note);
        } else {
          this.item = [];
          this.note = {
            id : '',
            name : '',
            description : '',
          };
          this.$store.dispatch('setNote', this.note);
        }
        // console.log(this.$store.state.note);
      },
      linkToUpdate(itemSelect) {
        if (itemSelect) {
          this.$router.push('/update');
        } else {
          alert('更新対象の行にチェックしてください');
        }
      },
      deleteConfirm(itemSelect) { // 削除確認
        if (itemSelect) {
          this.confirm = true;
          this.message = `ID:${this.$store.state.note.id} 削除してもよろしいですか？`;
        } else {
          alert('削除対象の行にチェックしてください');
        }
      },
      async onDeleteRecord() { // レコード削除
        this.confirm = false;
        const response = await this.deleteRecord(this.$store.state.note.id);
        if (response.data.data.deleteNote && response.status === 200) {
          this.message = `succsess: ${JSON.stringify(response.data)}`;
          this.alert = true;
          await this.getRecords(this.$store.state.loginUser);
        } else {
          this.messageType = 'error';
          this.message = `error: ${JSON.stringify(response.data)}`;
          this.alert = true;
        }
      }
    },
    async fetch () {
      try {
        // console.log('this.$nuxt.context =>', this.$nuxt.context);
        // console.log('fetch this =>', this);
        // console.log('fetch this.user.username =>', this.user.username);
        // console.log('fetch this.$store.loginUser =>', this.$store.state.loginUser);
        if (this.$store.state.loginState === 'signedin') {
          this.posts = this.$store.state.posts;
        }
        if (this.$nuxt.context.from) { // 別画面から遷移した時に再読み込みする
          this.getRecords(this.$store.state.loginUser);
        }
        this.unsubscribeAuth = await onAuthUIStateChange((authState, authData) => {
          // console.log(authState);
          // console.log(authData);
          this.authState = authState;
          this.user = authData;
          if (authState === 'signedin' && authData) {
            // ここで、storeにログイン情報をセットする。
            if (this.authState === 'signedin') {
              this.$store.dispatch('setUser', this.user.username);
              this.$store.dispatch('setState', this.authState);
            } else {
              this.$store.dispatch('setUser', '');
              this.$store.dispatch('setState', '');
            }
            this.getRecords(this.$store.state.loginUser);
          }
        })
        // console.log('fetch 2 this.user.username =>', this.user.username);
        // console.log('fetch this.$store.loginUser =>', this.$store.loginUser);
      } catch (err) {
        console.log('error', this);
        this.signedIn = false;
      }
    },
    beforeDestroy() {
      // console.log('beforeDestroy');
      // console.log('beforDestroy this =>', this);
    },
  };
</script>

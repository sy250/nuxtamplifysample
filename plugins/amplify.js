import Vue from 'vue';
import Amplify from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import '@aws-amplify/ui-vue';
Amplify.configure(awsconfig);
Vue.use(Amplify);

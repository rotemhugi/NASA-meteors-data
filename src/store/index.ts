import Vue from 'vue';
import Vuex from 'vuex';
 import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		nasaData: [],
	},
	getters: {
		nasaData: (state) => state.nasaData,
	},
	mutations: {
		serNasaData(state, nasaData){
			state.nasaData = nasaData;
		},
	},
	actions: {
		getNasaData(context){
			axios.get('https://data.nasa.gov/resource/y77d-th95.json')
			.then(response => {
				const nasaData = response.data;
				context.commit('serNasaData', nasaData);
				return nasaData;
			  })
			  .catch(e => {
				  console.log(e)
			  })
		  },
	},
	modules: {},
});

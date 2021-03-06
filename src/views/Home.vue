<template>

  <v-container>
    <v-row class="text-center">
      <v-col class="mt-10">
        <h1 class="display-2 font-weight-bold mb-3">
          NASA Investigation
        </h1>
      </v-col>
    </v-row>

	<v-row>
		<v-col cols="7">
			<div class="firstText">Start your investigation by choosing a year:</div>
		</v-col>
		<v-col cols="2">
			<v-text-field @input="initCount('year')" v-model="selectedYear" type="number" solo dense/>
		</v-col>
		<v-col cols="2">
			<v-btn color=#e0caa7 medium rounded outlined @click="getMeteorsByYear()">start</v-btn>
		</v-col>
	</v-row>

	<div v-show="messageByYear != ''">

		<v-row class="meteorsText">
			{{ messageByYear }}
		</v-row>

		<v-row v-if="showMassFilter == true" class="secondText"> 
			<v-col cols="7">
				<div class="firstText">Now, find how many meteors had mass size larger than:</div>
			</v-col>
			<v-col cols="2">
				<v-text-field @input="initCount('mass')" v-model="selectedMass" type="number" solo dense/>
			</v-col>
			<v-col cols="2">
				<v-btn color=#e0caa7 medium rounded @click="getMeteorsByMass()">Continue</v-btn>
			</v-col>
		</v-row>
		<v-row v-show="messageByMass != ''" class="meteorsText">
				{{ messageByMass }} 
		</v-row>
	</div>
  </v-container>
</template>

<script lang="ts">

	import {Component, Vue} from 'vue-property-decorator';
	import Nasa from '@/models/Nasa';
	import moment from 'moment'

	@Component({
		name: 'Home',
		components: {},
	})
	export default class Home extends Vue {

		selectedYear = ''
		selectedMass = ''
		nasaDataByYear = []
		nasaDataByMass = [];
		messageByYear = '';
		messageByMass = '';
		showMassFilter = false;

		created() {
			this.$store.dispatch('getNasaData');
		}

		getMeteorsByYear(saveMass: boolean){
			this.selectedMass = '';
			if(saveMass != true){
				this.messageByMass = '';
			}
			this.nasaDataByYear = this.nasaData.filter((currData: Nasa)=> moment(currData.year).format('YYYY') == this.selectedYear);
			const count = this.nasaDataByYear.length;
			
			if(count > 0){
				this.messageByYear = `There were ${count} meteors in ${this.selectedYear}`
				this.showMassFilter = true;

			}
			else{
				this.messageByYear = `There were no meteors on ${this.selectedYear} `
				this.showMassFilter = false;
			}
		}

		getMeteorsByMass(){
			const mass = this.selectedMass;
			this.nasaDataByMass = this.nasaDataByYear.filter((currData: Nasa)=> parseInt(currData.mass) >= parseInt(this.selectedMass))
			const count = this.nasaDataByMass.length;

			if(count > 0){
				this.messageByMass = `There were ${count} meteors that had a mass higher than ${this.selectedMass}`

			}
			else{
				this.messageByMass = `There were no meteors that had higher mass size than ${this.selectedMass} at all years`

				this.nasaDataByMass = this.nasaData.filter((currData: Nasa)=> parseInt(currData.mass) >= parseInt(this.selectedMass));

				if(this.nasaDataByMass.length > 0){

					this.nasaDataByMass.sort((a: Nasa , b: Nasa)=>(parseInt(moment(a.year).format('YYYY')) - parseInt(moment(b.year).format('YYYY'))))
					const firstNasaByMass: Nasa = this.nasaDataByMass[0];
					const originYear = this.selectedYear
					this.selectedYear = moment(firstNasaByMass.year).format('YYYY');
					this.messageByMass = `There were no meteors in ${originYear} that had higher mass size than ${this.selectedMass}, But in ${this.selectedYear} there were!`
					this.getMeteorsByYear(true);
					this.selectedMass = mass;

				}
			}
		}

		initCount(val: string){
			if(val == 'year'){
				this.messageByYear = '';
			}

			this.messageByMass = '';
		}

		get nasaData() {
			return this.$store.getters.nasaData;
		}
	}

</script>

<style lang="scss">

.yearInput{
	width: 10rem !important;
	justify-content: center;
}

.firstText{
	font-size: 20px;
	font-family: 'Courier New', Courier, monospace;
}

.secondText{
	background-color: black;
}

.meteorsText{
	font-size: 24px;
	font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	color: black;
	justify-content: center;
	background-color: blanchedalmond;
}
  
</style>

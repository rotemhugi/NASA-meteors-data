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
				<v-text-field @input="initCount()" v-model="selectedMass" type="number" solo dense/>
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

			// if the method called from the second method, clear the mass message
			if(saveMass != true){
				this.messageByMass = '';
			}

			// Alert user if the year is empty
			if(this.selectedYear == ''){
				alert('Fill the year input field')
			}
			else{

				// Filter the nasa data by selected year from user - convert date format to 'YYYY'
				this.nasaDataByYear = this.nasaData.filter((currData: Nasa)=> moment(currData.year).format('YYYY') == this.selectedYear);

				// Get the count of the nasa data that filtered by selected year
				const count = this.nasaDataByYear.length;
				
				// At case the count isn't zero
				if(count > 0){

					// Display message about count of meteor at selected year
					this.messageByYear = `${this.getOpeningByCount(count)} in ${this.selectedYear}`

					// Display also the mass filter for continue
					this.showMassFilter = true;

				}
				else{

					// Display message that were no meteor at selected year
					this.messageByYear = `There were no meteors on ${this.selectedYear} `

					// Hide the mass filter
					this.showMassFilter = false;
				}
			}
		}

		getMeteorsByMass(){

			// Alert user if the mass size is empty
			if(this.selectedMass == ''){
				alert('Fill the mass size input field')
			}
			else{

				const mass = this.selectedMass;

				// Filter the saved nasa data by year, that higher than selected mass size 
				this.nasaDataByMass = this.nasaDataByYear.filter((currData: Nasa)=> parseInt(currData.mass) >= parseInt(this.selectedMass))

				// Save the count of the nasa data by mass size
				const count = this.nasaDataByMass.length;

				// Display message if the count is higher than zero
				if(count > 0){
					this.messageByMass = `${this.getOpeningByCount(count)} that had a mass higher than ${this.selectedMass}`

				}
				else{

					// Filter from all nasa data where there is higher mass than selected mass size
					this.nasaDataByMass = this.nasaData.filter((currData: Nasa)=> parseInt(currData.mass) >= parseInt(this.selectedMass));

					// At case there are results
					if(this.nasaDataByMass.length > 0){

						// Sort the filtered data by mass ascending by year
						this.nasaDataByMass.sort((a: Nasa , b: Nasa)=>(parseInt(moment(a.year).format('YYYY')) - parseInt(moment(b.year).format('YYYY'))))

						// Save the first record - with the lowest year
						const firstNasaByMass: Nasa = this.nasaDataByMass[0];

						// Save the origin year of user selected
						const originYear = this.selectedYear

						// Update the selected year to be the lower from our filter
						this.selectedYear = moment(firstNasaByMass.year).format('YYYY');

						// Display message that explain user at which year there is higher mass than his selected mass size
						this.messageByMass = `There were no meteors in ${originYear} that had higher mass size than ${this.selectedMass}, But in ${this.selectedYear} there were!`
						
						// Update meteors count by update year
						this.getMeteorsByYear(true);

						// Show the selected mass at case it disappeared
						if(this.selectedMass == ""){
							this.selectedMass = mass;
						}
					}
					else{
						// Display message that were no meteors
						this.messageByMass = `There were no meteors that had higher mass size than ${this.selectedMass} at all years`
					}
				}
			}
		}

		// Make the opening of the messages by count
		getOpeningByCount(count: number){
			let opening;

			// Save the opening of the sentence by the count (single or many)
			if(count == 1){
				opening = `There was ${count} meteor`
			}
			else{
				opening = `There were ${count} meteors`
			}

			return opening;
		}

		// Initial the messages on screen
		initCount(val: string){
			if(val == 'year'){
				this.messageByYear = '';
			}

			this.messageByMass = '';
		}

		// Get nasa data from state
		get nasaData() {
			return this.$store.getters.nasaData;
		}
	}

</script>

<style lang="scss">

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

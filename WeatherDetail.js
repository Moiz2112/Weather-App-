import { LightningElement, track } from 'lwc';
import getWeatherDetails from '@salesforce/apex/WeatherDetail.getWeatherDetails';
import getForecaseWeather from '@salesforce/apex/WeatherDetail.getForecaseWeather';
import getHourlyForecastWeather from '@salesforce/apex/WeatherDetail.getHourlyForecastWeather';
import getCityName from '@salesforce/apex/WeatherDetail.getCityName';

export default class WeatherDetail extends LightningElement {
    @track cityName = '';
    @track currentWeatherData;
    @track forecastWeatherData = [];
    @track hourlyWeatherData = [];
    @track cityOptions = [];
    @track days = 0; 
    @track DaysHour = 1;  
    @track error;       
    @track showDayInput = false;
    @track showFutureWeather = false;
    @track showDropdown = false;
    handleKeyUp(event) {
        const inputValue = event.target.value;
        if (inputValue && inputValue.length > 0) {
            this.fetchCitySuggestions(inputValue);
        } else {
            this.showDropdown = false; 
        }
    }

    handleCityChange(event) {
        this.cityName = event.target.value;
    }

    fetchCitySuggestions(cityInitial) {
        getCityName({ Name: cityInitial })
            .then((result) => {
                console.log('Result',result);
                this.cityOptions = result.map((city) => ({
                    label: city,
                    value: city,
                }));
                this.showDropdown = this.cityOptions.length > 0;  
                // if(this.cityName!= this.cityOptions.label){
                //     this.showDropdown = false;
                // }
            })
            .catch((error) => {
                console.error('Error fetching city names:', error);
                this.showDropdown = false;
            });
    }

    handleCitySelect(event) {
        const selectedCity = event.target.textContent;
        this.cityName = selectedCity;  
        this.showDropdown = false;  
    }

     handleGetCurrentWeather() {
        if (this.cityName) {
            getWeatherDetails({ cityName: this.cityName })
                .then(result => {
                    console.log('Weather Data:', JSON.stringify(result, null, 2))
                    this.currentWeatherData = result;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.currentWeatherData = undefined;
                });               
        }
    }

     toggleDayInput() {
        this.showDayInput = !this.showDayInput;
    }
     toggleButton(){
        this.showFutureWeather = !this.showFutureWeather;
     }
      handleCLick(){
        this.handleGetCurrentWeather();
        this.toggleButton();
      }

     handleDayChange(event) {
        
        this.days = Number(event.target.value);
  
    }

     handleGetForecastWeather() {
 
        if (this.cityName && this.days > 0) {
    //   alert(this.days);
            getForecaseWeather({ cityName: this.cityName, Days: this.days })
              .then(result => {
                    console.log('Weather Data:', JSON.stringify(result, null, 2));  
                    this.forecastWeatherData = result;
                    this.error = undefined;
                })
                .catch(error => {
                    console.error('Error:', error); 
                    this.error = error;
                    this.forecastWeatherData = []; 
                });
        }
    }

     handleGetHourlyWeather(){
        if(this.cityName  && this.DaysHour>0){
            getHourlyForecastWeather({ cityName: this.cityName, Days: this.DaysHour})
            .then(result =>{
                console.log('Weather Data:', JSON.stringify(result, null, 2));
                 this.hourlyWeatherData = result;
                 this.error = undefined;
                  
            })
            .catch(error => {
                this.error = error;
                this.hourlyWeatherData =  [];
                
            });
        }
     }   
}
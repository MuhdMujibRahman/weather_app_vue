<template>

        <div v-for="city in savedCities" :key="city.id">
            <CityCard :city="city" @click="goToCityView(city)"/>

        </div>
        <p v-if="savedCities.length === 0">
                No locations added. To start tracking a location, search in
                the field above.
         </p>

</template>

<script setup>
import { ref } from 'vue';
import axios from "axios";
import CityCard from "@/components/CityCard.vue";
import { routeLocationKey, useRouter } from 'vue-router';
import router from '@/router';

const savedCities = ref([]);
const weatherAppAPIKey = "beff98e1fede7a54bd1f107174d97d07";
const getCities = async () => {
    if(localStorage.getItem("savedCities")){
        savedCities.value = JSON.parse(
            localStorage.getItem("savedCities")
        );

        const requests = [];
        savedCities.value.forEach((city) => {
            requests.push(
                axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${weatherAppAPIKey}&units=metric`)
            );
        });

        const weatherData = await Promise.all(requests);

        await new Promise((res) => setTimeout(res, 400));

        weatherData.forEach((value, index) => {
            savedCities.value[index].weather = value.data ;
        })
    }
};

await getCities();

const rounter = useRouter();
const goToCityView = (city) => {
    router.push({
        name: "cityView",
        params: {state: city.state, city: city.city},
        query: { id: city.id, lat : city.coords.lat, lng: city.coords.lng},
    }

    );
};
</script>


<template>
  <main class="container text-white ">
    <div class="pt-4 mb-8 relative">

    <input type="text" v-model="searcQuery" @input="getSearchResult" placeholder="Search for a city or state"
            class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0#004E71]">
  
    <ul class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]" v-if="mapboxSearchResult">
      <p v-if="searchError">
        Sorry something went wrong
      </p>
      <p v-if="!searchError && mapboxSearchResult.length == 0">
        No result match your query, try a different term.
      </p>
      <template v-else>
        <li v-for="searchResult in mapboxSearchResult" :key="searchResult.id" @click="previewCity(searchResult)">
          {{ searchResult.place_name }}
        </li>
      </template>
    </ul>

    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList/>
        <template #fallback>
         <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import axios from "axios";
import { useRouter } from 'vue-router';
import CityList from '@/components/CityList.vue';
import CityCardSkeleton from '@/components/CityCardSkeleton.vue';

const router = useRouter();
const searcQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResult = ref(null);
const searchError = ref(null)

const previewCity = (searchResult) => {
  console.log(searchResult);
  const [city, state] = searchResult.place_name.split(", ");
  console.log(city)
  console.log(state)
  router.push({
    name: 'cityView',
    params: {state: state, city: city},
    query: {
      lat: searchResult.geometry.coordinates[1],
      lng: searchResult.geometry.coordinates[0],
      preview: true
    }
  })
}

const getSearchResult = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if(searcQuery.value !== '') {
        try {
          const result = await axios.get(`/api/mapbox?places=${searcQuery.value}&access_token=123&tpyes=places`);
          mapboxSearchResult.value = result.data.features;
          console.log(mapboxSearchResult.value)
        } catch {

          searchError.value = true;

        }

        return;
    };
    mapboxSearchResult.value = null;
  }, 300)
  
};


</script>
import express from "express";
import qs from "qs";
import axios from "axios";
import './loadEnv.js';

const app = express();
app.use(express.static('public'));
const port = 3000; 
// `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&appid=${weatherAppAPIKey}&units=metric`
const weatherAppAPIKey = process.env.WEATHER_API_KEY;
const mapboxAPIKey = process.env.MAPBOX_API_KEY;

app.get('/api/weather', async(req, res) => {
    let query = req.query
    query.appid = weatherAppAPIKey
    let queryString = qs.stringify(query)
    const getCities = await axios.get(`https://api.openweathermap.org/data/2.5/weather?${queryString}`);
    res.send(getCities.data)
})

app.get('/api/mapbox', async(req, res) => {
    console.log(req.query)
    let query = req.query
    query.access_token = mapboxAPIKey
    let queryString = qs.stringify(query)
    let places = query.places
    let types = query.types
    const getCities = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${places}.json?access_token=${mapboxAPIKey}&tpyes=${types}`);
    res.send(getCities.data)
})

app.get('/api/weather/onecall', async(req, res) => {

    let query = req.query
    query.appid = weatherAppAPIKey
    let queryString = qs.stringify(query)
    const getCities = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?${queryString}`);
    res.send(getCities.data)
})


app.listen(port, () => {
    console.log(`Test Node js`)
})
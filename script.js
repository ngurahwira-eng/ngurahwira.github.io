// GONG - Bagian utama aplikasi cuaca

// API key untuk mengakses OpenWeather API
// Referensi:
// OpenWeather Current Weather API
// https://openweathermap.org/current

const API_KEY = 'd076f0dcecbd6c4732366f8deede9bd4';



// Mengambil elemen HTML berdasarkan id
// Referensi:
// MDN - Document.getElementById()
// https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById

const $ = id => document.getElementById(id);


// Inisialisasi elemen DOM
const cityInput = $('cityInput');
const searchBtn = $('searchBtn');
const loader = $('loader');
const result = $('result');

const cityEl = $('city');
const tempEl = $('temp');

const humidityEl = $('humidity');
const conditionEl = $('condition');

const errorEl = $('error');



// Menampilkan atau menyembunyikan loader
// Referensi:
// MDN - classList.toggle()
// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

function showLoader(show){

 loader.classList.toggle(
   'hidden',
   !show
 );

}



// Menampilkan atau menyembunyikan hasil
function showResult(show){

 result.classList.toggle(
   'hidden',
   !show
 );

}



// Mengambil data cuaca dari OpenWeather API
// Referensi:
// MDN - Fetch API
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

async function fetchWeather(city){

 if(!API_KEY){

   throw new Error(
     'API key belum tersedia'
   );

 }

 const url =
 `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

 const resp =
 await fetch(url);

 if(!resp.ok){

   const data =
   await resp
   .json()
   .catch(
      ()=>({})
   );

   throw new Error(
     data.message ||
     'Gagal mengambil data'
   );

 }

 return resp.json();

}



// Menampilkan hasil cuaca ke halaman
// Referensi:
// MDN - textContent
// https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent

function render(data){

 const {
   name,
   main,
   weather
 } = data;


 cityEl.textContent =
 name || '—';


 tempEl.textContent =
 `${Math.round(main.temp)}°C`;


 humidityEl.textContent =
 `Humidity: ${main.humidity}%`;


 conditionEl.textContent =
 capitalize(
   weather[0].description
 );

}



// Mengubah huruf awal menjadi kapital
// Referensi:
// MDN - String.replace()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace

function capitalize(s){

 return s.replace(
   /(^|\s)\S/g,

   t => t.toUpperCase()
 );

}



// Fungsi utama ketika tombol Search ditekan
//
// Alur:
// 1. Ambil input
// 2. Tampilkan loader
// 3. Ambil data API
// 4. Tampilkan hasil
//
// Referensi:
// MDN - async function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

async function doSearch(){

 const city =
 cityInput.value.trim();


 errorEl.textContent =
 '';


 if(!city){

   return;

 }


 showResult(false);

 showLoader(true);


 try{

   const data =
   await fetchWeather(city);

   render(data);

   showResult(true);

 }

 catch(err){

   errorEl.textContent =
   err.message;

 }

 finally{

   showLoader(false);

 }

}



// Event tombol Search
// Referensi:
// MDN - addEventListener()

searchBtn.addEventListener(
 'click',
 doSearch
);



// Event Enter pada keyboard
// Referensi:
// MDN - keydown event

cityInput.addEventListener(
 'keydown',

 e=>{

   if(
      e.key==='Enter'
   ){

      doSearch();

   }

 }

);

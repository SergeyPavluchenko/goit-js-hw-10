import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-aio';

const DEBOUNCE_DELAY = 300;
const inputTextRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

inputTextRef.addEventListener('input', debounce(searchCountyData, DEBOUNCE_DELAY));

function searchCountyData(event) {
    countryInfoRef.innerHTML = '';
    countryListRef.innerHTML = '';
    const searchCounty = event.target.value.trim().toLowerCase();
    if (searchCounty === '') {
        return
    }
    const searchCountryNormal = searchCounty.trim();
        fetchCountries(searchCountryNormal)
            .then(countries => createMarkupCountry(countries))
            .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function createMarkupCountry(countries) {
    if (countries.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
    } else if (countries.length > 1) {
        const markup = countries
            .map(({ name, flags }) => {
                return `<li class="country-item"><img class='flags' src="${flags.svg}" alt="${name.official}" width="50" height="40"><p class="country-name">${name.official}</p></li>`;
            })
            .join('');
        countryListRef.innerHTML = markup;
    } else if (countries.length === 1) {
        const markupInfo = countries
            .map(({ name, capital, flags, population, languages }) => {
                return `<div class="box"><img class="country-info-img" src="${flags.svg
                    }" alt="${name.official}" width="50" height="40">
            <h2 class="country-info-title">${name.official}</h2></div>
            <ul class="country-info-list">
                <li class="country-info-item">
                    <p class="country-info-text">Capital: <span class="text-info">${capital[0]}</span></p>
                </li>
                    <li class="country-info-item">
                        <p class="country-info-text">Population: <span class="text-info">${population}</span></p>
                    </li>
                 <li class="country-info-item">
                    <p class="country-info-text">Languages: <span class="text-info">${Object.values(languages)}</span></p>
                </li>
            </ul>`;
            })
            .join('');
        countryInfoRef.innerHTML = markupInfo
    }
}


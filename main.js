


(() => {
    "use strict"

    let arr = []
    webInit()

    // fetch all coins from server
    async function ajaxRequestAllCoins() {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250&page=2")
        // const response = await fetch("https://api.coingecko.com/api/v3/coins/list")
        console.log(response)

        const coins = await response.json() // 

        displayAllCoins(coins)
        return coins
    }

    // adding our data to local storage
    async function addToLocalStorage() {
        const response = await ajaxRequestAllCoins()
        const coins = JSON.stringify(response)
        arr.push(coins)
        console.log(arr);
        localStorage.setItem("coins", arr)
    }

    // webInit function 
    function webInit() {
        const coins = localStorage.getItem('coins')
        if (coins !== null) {
            arr = JSON.parse(coins)
            console.log(arr);
        } else {
            addToLocalStorage()
        }
        displayAllCoins(arr)
    }


    // display all coins on the screen
    function displayAllCoins(coins) {
        const divResponse = document.getElementById("cardsResponse")
        let html = ""
        for (let i = 0; i < 100; i++) {
            html +=
                `
            <div class="coinCard">
             <h2>${coins[i].name}</h2>
             <h3>${coins[i].symbol}</h3>
             <img class="myImgDiv" src="${coins[i].image} ">
            </div>

        `
        }
        divResponse.innerHTML = html

    }

    // darkMode
    function darkMode() {
        const body = document.body
        const darkModeBtn = document.getElementById("darkModeBtn")

        // checking value in local storage' if true - get this value, else - false.
        // the same with toggle func.
        const ifDarkmode = localStorage.getItem('darkMode') === 'true'
        localStorage.setItem('darkMode', !ifDarkmode)
        body.classList.toggle('darkMode', !ifDarkmode)
        darkModeBtn.innerHTML = !ifDarkmode ? 'Light Mode' : 'Dark Mode';
    }
    document.querySelector('.bi').addEventListener("click", darkMode)



    // save dark/light mode if you're refreshing page
    function onload() {
        const ifDarkmode = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('darkMode', localStorage.getItem('darkMode') === 'true')
        document.getElementById("darkModeBtn").innerHTML = !ifDarkmode ? 'Dark Mode' : 'Light Mode';

    }

    document.addEventListener('DOMContentLoaded', onload)



})()
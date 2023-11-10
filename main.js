


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
        for (let i = 1; i <= 100; i++) {
            const index = coins.indexOf(coins[i])
            const divElement = document.createElement('div')
            const coinName = document.createElement('h3')
            const coinSymbol = document.createElement('p')
            const coinImg = document.createElement('img')
            const brakeEl = document.createElement('br')
            const moreInfoBtn = document.createElement('button')

            // css 
            divElement.setAttribute("class", "coinCard")
            coinImg.setAttribute("src", `${coins[i].image}`)
            coinImg.setAttribute("class", "myImgDiv")

            // set data into cells
            coinName.innerHTML = `${coins[i].name}`
            coinSymbol.innerHTML = `${coins[i].symbol}`
            moreInfoBtn.innerHTML = "More info"
            // buttons
            moreInfoBtn.addEventListener("click", function () {
                myFunction(index)
            })


            // dropdown menu
            const divDropdown = document.createElement('div')
            const interiorDiv = document.createElement('div')
            const linkA = document.createElement('a')
            const linkB = document.createElement('a')
            const linkC = document.createElement('a')

            // css 
            divDropdown.setAttribute("class", "dropdown")
            interiorDiv.setAttribute("class", "dropdown-content")
            interiorDiv.setAttribute("id", "myDropdown")

            // Add a unique ID to each dropdown to associate with the button
            interiorDiv.setAttribute("id", `myDropdown${i}`);
            // Add a unique ID to each button to associate with the dropdown
            moreInfoBtn.setAttribute("data-dropdown", `myDropdown${i}`);

            moreInfoBtn.setAttribute("class", "dropbtn")
            linkA.innerHTML = `Price:${(coins[i].current_price).toFixed(2)}$`
            linkB.innerHTML = `Price:${(coins[i].current_price / 1.07).toFixed(2)}€`
            linkC.innerHTML = `Price:${(coins[i].current_price / 0.26).toFixed(2)}₪`



            // append elements to our main divCards
            divElement.appendChild(coinName)
            divElement.appendChild(coinSymbol)
            divElement.appendChild(coinImg)
            divElement.appendChild(brakeEl)

            divDropdown.appendChild(moreInfoBtn)
            interiorDiv.appendChild(linkA)
            interiorDiv.appendChild(linkB)
            interiorDiv.appendChild(linkC)
            divDropdown.appendChild(interiorDiv)
            divElement.appendChild(divDropdown)

            // append to main div
            divResponse.appendChild(divElement)

        }
    }



    // ---------------------------------------------------------
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
    // ---------------------------------------------------------

    // Dropdown menu 
    // When the user clicks on the button,
    // toggle between hiding and showing the dropdown content 
    function myFunction(index) {
        const dropdown = document.getElementById(`myDropdown${index}`);
        dropdown.classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }





})()


(() => {
    "use strict"
    // Global variables
    const ctx = document.getElementById('mainChart');
    const canvasSection = document.getElementById("canvasSection")
    const mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    // global variables for functions
    let arr = []
    let arrayReports = []
    const divResponse = document.getElementById("cardsResponse")
    const homePage = document.getElementById("homePage")

    webInit()

    canvasSection.style.display = 'none';
    divResponse.style.display = 'flex';

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

    // main function 
    function webInit() {
        const coins = localStorage.getItem('coins')
        if (coins !== null) {
            arr = JSON.parse(coins)
            console.log(arr)
        } else {
            addToLocalStorage()
        }
        displayAllCoins(arr, arr.length)
    }
    // -----------------------------REPORTS---------------------------------------------------
    // check if you have any data in local storage
    function ifExistReports(item) {
        const myData = localStorage.getItem("reports")
        if (myData !== null) {
            arrayReports = JSON.parse(myData)
        }
        return item && arrayReports.some((report) => report.id === item.id);
    }
    // Initialize switch state based on local storage
    function InitializeSwitchState(item, switchBtnInput) {
        if (ifExistReports(item)) {
            switchBtnInput.checked = true
            if (switchBtnInput.checked === false) {
                arrayReports.split(item, 1)
            }
        }
    }
    // add new crypto to reports array
    function addToReports(item, switchBtnInput, switchBtnLabel) {
        if (!ifExistReports(item)) {
            // Remove previous attributes
            switchBtnInput.removeAttribute("id")
            switchBtnLabel.removeAttribute("class")
            switchBtnLabel.removeAttribute("for")
            // check if array already has this crypto
            if (!arrayReports.some((report) => report.id === item.id) && arrayReports.length < 5) {
                arrayReports.push(item)
                const json = JSON.stringify(arrayReports)
                localStorage.setItem("reports", json)
                // Set new attributes
                switchBtnInput.setAttribute("id", "flexSwitchCheckChecked")
                switchBtnInput.setAttribute("checked", "checked")
                switchBtnLabel.setAttribute("for", "flexSwitchCheckChecked")
                switchBtnInput.checked = true
            } else {
                alert("Item not added to reports. Either already exists or maximum limit reached.")
                // Set default attributes
                switchBtnInput.checked = false
            }
        } else {
            // Delete from reports
            arrayReports = arrayReports.filter((report) => report.id !== item.id)
            const json = JSON.stringify(arrayReports)
            localStorage.setItem("reports", json)
        }
    }




    // CHANGE FUNCTIONS FOR REPORT ARRAY
    function changeBtnfunc(clickedItemSymbol) {
        // Assuming you have a function to prompt the user to select another item
        const newItemSymbol = prompt("Select another item - symbol:").toLowerCase()
        if (newItemSymbol !== null) {
            const existingItemIndex = arrayReports.findIndex(item => item.symbol === clickedItemSymbol)
            const newItem = arr.find(item => item.symbol === newItemSymbol)
            if (existingItemIndex !== -1 && newItem && !arrayReports.some((report) => report.symbol === newItem.symbol)) {
                arrayReports[existingItemIndex] = newItem
                localStorage.setItem("reports", JSON.stringify(arrayReports))
                console.log(`Changed item with ID ${clickedItemSymbol} to ${newItemSymbol}`)
                printReports(); // Update the display

                let result = confirm("Want to see a chart?");
                if (result) {
                    createMainChart();
                } else {
                    canvasSection.style.display = 'none';
                    divResponse.style.display = 'flex';
                }

                displayAllCoins(arr, arr.length)
            } else {
                console.log("Invalid item selection or already exists or item not found.")
            }

        }
    }

    function change() {
        // Add event listener to the "Change this crypto" buttons
        arrayReports.forEach(item => {
            const changeBtn = document.getElementById(`changeBtn_${item.id}`)
            if (changeBtn) {
                changeBtn.addEventListener("click", () => {
                    changeBtnfunc(item.symbol);


                })

            }
        });
    }

    // show your chosen crypto in pop-up 
    function printReports(item) {
        ifExistReports(item)
        let popupText_id = document.getElementById('popupText_id')
        let html = ''
        if (arrayReports.length === 0) {
            html += `<div><p <h4 class="">You don't have any crypto!Please add them!</h4></p></div>`
            popupText_id.innerHTML = html
        } else {
            for (const item of arrayReports) {
                html += `<div class='coinCardPopUp ' id="${item.id}"> <br> <img class="myImgDiv"  src="${item.image}" ></h2>`
                html += `<p <h4 class="coinCardBoxHeaderReport">${item.name}</h4></p>`;
                html += `<p class='coinCardPriceReport'>USD: $${(item.current_price * 1).toFixed(2)}</p>`
                html += `<p class='coinCardPriceReport'>ILS: ₪${(item.current_price * 3.51).toFixed(2)}</p>`
                html += `<p class='coinCardPriceReport'>Euro: €${(item.current_price * 0.93).toFixed(2)}</p>`
                html += `<button id="changeBtn_${item.id}" type="button" class="btn btn-warning">Change</button></div>`
            }
            popupText_id.innerHTML = html
            change()

        }
    }

    // --------------------- D I S P L A Y   C O I N S------------------------
    // display all coins on the screen
    function displayAllCoins(someArray, count) {
        divResponse.innerHTML = ''
        for (let i = 0; i < count; i++) {
            const item = someArray[i];
            const divElement = document.createElement('div')
            const coinName = document.createElement('h3')
            const coinSymbol = document.createElement('p')
            const coinImg = document.createElement('img')
            const brakeEl = document.createElement('br')
            const switchBtnInput = document.createElement('INPUT')
            const switchBtnDiv = document.createElement('div')
            const switchBtnLabel = document.createElement('LABEL')
            // css 
            divElement.setAttribute("class", "coinCard")
            coinImg.setAttribute("src", `${item.image}`)
            coinImg.setAttribute("class", "myImgDiv")
            // set data into cells
            coinName.innerHTML = `${item.name}`
            coinSymbol.innerHTML = `${item.symbol}`
            // css 
            switchBtnDiv.setAttribute("class", "form-check form-switch")
            switchBtnInput.setAttribute("class", "form-check-input")
            switchBtnInput.setAttribute("type", "checkbox")
            switchBtnInput.setAttribute("role", "switch")
            //-----------------------------------------------

            // reports 
            InitializeSwitchState(item, switchBtnInput)

            // add some function to print your choosen cryptos
            document.getElementById("reports").addEventListener("click", printReports)
            switchBtnInput.addEventListener('change', () => addToReports(item, switchBtnInput, switchBtnLabel));
            // toogle switch append children
            switchBtnDiv.appendChild(switchBtnLabel)
            switchBtnDiv.appendChild(switchBtnInput)
            divElement.appendChild(switchBtnDiv)
            //-----------------------------------------------
            // append elements to our main divCards
            divElement.appendChild(coinImg)
            divElement.appendChild(coinName)
            divElement.appendChild(coinSymbol)
            divElement.appendChild(brakeEl)
            // dropdown menu append children
            const element = dropDownMenu(item)
            divElement.appendChild(element)
            // append to main div
            divResponse.appendChild(divElement)
        }
    }
    //-------------------------D R O P D O W N     M E N U------------------------------------
    // Dropdown menu 
    // When the user clicks on the button,
    // toggle between hiding and showing the dropdown content 
    function dropDownFunc(itemId) {
        const dropdown = document.getElementById(`myDropdown${itemId}`)
        dropdown.classList.toggle("show")
    }

    // create drop down elements
    function dropDownMenu(item) {
        // Create dropdown button
        const divDropdown = document.createElement('div')
        const interiorDiv = document.createElement('div')
        const linkA = document.createElement('a')
        const linkB = document.createElement('a')
        const linkC = document.createElement('a')
        const dropdownBtn = document.createElement('button')

        // css 
        divDropdown.setAttribute("class", "dropdown")
        interiorDiv.setAttribute("class", "dropdown-content")
        interiorDiv.setAttribute("id", "myDropdown")
        // Add a unique ID to each dropdown to associate with the button
        interiorDiv.setAttribute("id", `myDropdown${item.id}`)
        // Add a unique ID to each button to associate with the dropdown
        dropdownBtn.setAttribute("data-dropdown", `myDropdown${item.id}`)
        dropdownBtn.setAttribute("class", "dropbtn")
        linkA.innerHTML = `Price:${(item.current_price).toFixed(2)}$`
        linkB.innerHTML = `Price:${(item.current_price / 1.07).toFixed(2)}€`
        linkC.innerHTML = `Price:${(item.current_price / 0.26).toFixed(2)}₪`
        dropdownBtn.innerHTML = "More info"

        // dropdown menu append children
        divDropdown.appendChild(dropdownBtn)
        interiorDiv.appendChild(linkA)
        interiorDiv.appendChild(linkB)
        interiorDiv.appendChild(linkC)
        divDropdown.appendChild(interiorDiv)


        // Add event listener for moreInfoBtn
        dropdownBtn.addEventListener("click", function () {
            dropDownFunc(item.id)
        });

        return divDropdown
    }

    // Close the dropdown menu if the user clicks outside of it
    document.addEventListener('click', function (event) {
        if (!event.target.matches('.dropbtn')) {
            let dropdowns = document.getElementsByClassName("dropdown-content");
            let i;
            for (i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i]
                // Check if openDropdown is not null or undefined before accessing classList
                if (openDropdown && openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show')
                }
            }
        }
    });
    //-----------------------------D A R K    M O D E--------------------------------

    // darkMode
    function darkMode() {
        const body = document.body
        const darkModeBtn = document.getElementById("darkModeBtn")

        // Get the current dark mode state from local storage - get this if true, else = false
        const ifDarkmode = localStorage.getItem('darkMode') === 'true'
        console.log(ifDarkmode)

        // Toggle the dark mode state
        const newDarkModeState = !ifDarkmode
        localStorage.setItem('darkMode', newDarkModeState)

        body.classList.toggle('darkMode', newDarkModeState)
        darkModeBtn.innerHTML = newDarkModeState ? 'Light Mode' : 'Dark Mode'

        if (newDarkModeState) {
            body.setAttribute("data-bs-theme", "dark")
        } else {
            body.removeAttribute("data-bs-theme")
        }
    }
    document.getElementById("darkModeBtn").addEventListener("click", darkMode)
    // Save dark/light mode if you're refreshing the page
    function onload() {
        const ifDarkmode = localStorage.getItem('darkMode') === 'true'
        const body = document.body;
        const darkModeBtn = document.getElementById("darkModeBtn")
        // Set the class, button text, and attribute based on the current state
        body.classList.toggle('darkMode', ifDarkmode);
        darkModeBtn.innerHTML = ifDarkmode ? 'Light Mode' : 'Dark Mode'

        if (ifDarkmode) {
            body.setAttribute("data-bs-theme", "dark")
        } else {
            body.removeAttribute("data-bs-theme")
        }
    }
    document.addEventListener('DOMContentLoaded', onload)

    //-----------------------------S E A R C H   O N    K E Y D O W N --------------------------------

    // Show coins by search (on  key down)
    function createCoinCardBySearch() {
        let searchInputId = document.getElementById("searchInputId")
        divResponse.innerHTML = ""
        const newArray = arr.filter(item => item.symbol.toLowerCase().includes(searchInputId.value.toLowerCase()))
        console.log(newArray)
        let count = newArray.length
        displayAllCoins(newArray, count)
    }
    searchInputId.addEventListener("keydown", createCoinCardBySearch)
    searchInputId.addEventListener("click", createCoinCardBySearch)
    searchInputId.addEventListener("keyup", createCoinCardBySearch)

    //-----------------------------C H A R T  --------------------------------

    function showChart() {

        canvasSection.style.display = 'flex'
        divResponse.style.display = 'none'
    }

    function createMainChart() {

        const myDataAll = localStorage.getItem('reports');
        const dataAll = JSON.parse(myDataAll)
        showChart()
        const dataSet = dataAll.map(x => ({
            label: x.id,
            data: [x.current_price, x.current_price, x.current_price, x.current_price],
            borderWidth: 1

        }))

        mainChart.data.labels = [1, 2, 3, 'Today']
        mainChart.data.datasets = dataSet
        mainChart.update()
    }
    let charts = document.getElementById("charts")
    charts.addEventListener("click", () => createMainChart())
    homePage.addEventListener("click", function () {
        canvasSection.style.display = 'none'
        divResponse.style.display = 'flex'
        displayAllCoins(arr, arr.length)
    })
})()
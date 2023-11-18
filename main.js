

(() => {
    "use strict"

    let arr = []
    let arrayReports = []
    const divResponse = document.getElementById("cardsResponse")

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

    // main function 
    function webInit() {
        const coins = localStorage.getItem('coins')
        if (coins !== null) {
            arr = JSON.parse(coins)
            console.log(arr);
        } else {
            addToLocalStorage()
        }
        displayAllCoins(arr, arr.length)
    }


    // display all coins on the screen
    function displayAllCoins(someArray, count) {
        // Clear 
        divResponse.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const index = someArray.indexOf(someArray[i])
            const item = someArray[i];
            const divElement = document.createElement('div')
            const coinName = document.createElement('h3')
            const coinSymbol = document.createElement('p')
            const coinImg = document.createElement('img')
            const brakeEl = document.createElement('br')
            const moreInfoBtn = document.createElement('button')


            // css 
            divElement.setAttribute("class", "coinCard")
            coinImg.setAttribute("src", `${item.image}`)
            coinImg.setAttribute("class", "myImgDiv")

            // set data into cells
            coinName.innerHTML = `${item.name}`
            coinSymbol.innerHTML = `${item.symbol}`
            moreInfoBtn.innerHTML = "More info"

            // buttons
            moreInfoBtn.addEventListener("click", function () {
                dropDownFunc(index)
            })

            //-------------------------------------------------------------
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
            linkA.innerHTML = `Price:${(item.current_price).toFixed(2)}$`
            linkB.innerHTML = `Price:${(item.current_price / 1.07).toFixed(2)}€`
            linkC.innerHTML = `Price:${(item.current_price / 0.26).toFixed(2)}₪`

            //-------------------------------------------------------------
            // toogle switch
            const switchBtnDiv = document.createElement('div')
            const switchBtnInput = document.createElement('INPUT')
            const switchBtnLabel = document.createElement('LABEL')


            // css 
            switchBtnDiv.setAttribute("class", "form-check form-switch")
            switchBtnInput.setAttribute("class", "form-check-input")
            switchBtnInput.setAttribute("type", "checkbox")
            switchBtnInput.setAttribute("role", "switch")
            //-----------------------------------------------

            // reports 
            // check if you have any data in local storage
            function ifExistReports() {
                const myData = localStorage.getItem("reports")
                if (myData !== null) {
                    arrayReports = JSON.parse(myData);
                }
                return arrayReports.some((report) => report.id === item.id);
            }
            // Initialize switch state based on local storage
            if (ifExistReports(item)) {
                switchBtnInput.checked = true;
                if (switchBtnInput.checked === false) {
                    reportError.split(item, 1)
                }
            }

            // add new crypto to reports array
            function addToReports(item) {
                if (!ifExistReports(item)) {
                    // Remove previous attributes
                    switchBtnInput.removeAttribute("id");
                    switchBtnLabel.removeAttribute("class");
                    switchBtnLabel.removeAttribute("for");
                    // check if array already has this crypto
                    if (!arrayReports.some((report) => report.id === item.id) && arrayReports.length < 5) {
                        arrayReports.push(item)
                        const json = JSON.stringify(arrayReports)
                        localStorage.setItem("reports", json)
                        // Set new attributes
                        switchBtnInput.setAttribute("id", "flexSwitchCheckChecked");
                        switchBtnInput.setAttribute("checked", "checked");
                        switchBtnLabel.setAttribute("for", "flexSwitchCheckChecked");
                        switchBtnInput.checked = true
                    } else {
                        alert("Item not added to reports. Either already exists or maximum limit reached.");
                        // Set default attributes
                        switchBtnInput.checked = false
                    }
                } else {
                    // Delete from reports
                    arrayReports = arrayReports.filter((report) => report.id !== item.id);
                    const json = JSON.stringify(arrayReports);
                    localStorage.setItem("reports", json);
                }
            }


            // CHANGE FUNCTIONS FOR REPORT ARRAY
            function changeBtnfunc(clickedItemSymbol) {
                // Assuming you have a function to prompt the user to select another item
                const newItemSymbol = prompt("Select another item - symbol:").toLowerCase();
                if (newItemSymbol !== null) {
                    const existingItemIndex = arrayReports.findIndex(item => item.symbol === clickedItemSymbol);
                    const newItem = arr.find(item => item.symbol === newItemSymbol);
                    if (existingItemIndex !== -1 && newItem && !arrayReports.some((report) => report.symbol === newItem.symbol)) {
                        arrayReports[existingItemIndex] = newItem;
                        localStorage.setItem("reports", JSON.stringify(arrayReports));
                        console.log(`Changed item with ID ${clickedItemSymbol} to ${newItemSymbol}`);
                        printReports(); // Update the display
                        displayAllCoins(arr, arr.length)
                    } else {
                        console.log("Invalid item selection or already exists or item not found.");
                    }
                }
            }

            function change() {
                // Add event listener to the "Change this crypto" buttons
                arrayReports.forEach(item => {
                    const changeBtn = document.getElementById(`changeBtn_${item.id}`);
                    if (changeBtn) {
                        changeBtn.addEventListener("click", () => {
                            changeBtnfunc(item.symbol);
                        })
                    }
                });
            }

            // show your chosen crypto in pop-up 
            function printReports() {
                ifExistReports()
                let popupText_id = document.getElementById('popupText_id')
                let html = ''
                if (arrayReports.length === 0) {
                    html += `<div><p <h4 class="">You don't have any crypto!Please add them!</h4></p></div>`
                    popupText_id.innerHTML = html;
                } else {
                    for (const item of arrayReports) {
                        html += `<div class='coinCardPopUp ' id="${item.id}"> <br> <img class="myImgDiv"  src="${item.image}" ></h2>`;
                        html += `<p <h4 class="coinCardBoxHeaderReport">${item.name}</h4></p>`;
                        html += `<p class='coinCardPriceReport'>USD: $${(item.current_price * 1).toFixed(2)}</p>`;
                        html += `<p class='coinCardPriceReport'>ILS: ₪${(item.current_price * 3.51).toFixed(2)}</p>`;
                        html += `<p class='coinCardPriceReport'>Euro: €${(item.current_price * 0.93).toFixed(2)}</p>`
                        html += `<button id="changeBtn_${item.id}" type="button" class="btn btn-warning">Change this crypto</button></div>`
                    }
                    popupText_id.innerHTML = html
                    change()
                }
            }
            // add some function to print your choosen cryptos
            document.getElementById("reports").addEventListener("click", printReports)
            switchBtnInput.addEventListener('change', () => addToReports(item));

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
        const body = document.body;
        const darkModeBtn = document.getElementById("darkModeBtn");

        // Get the current dark mode state from local storage - get this if true, else = false
        const ifDarkmode = localStorage.getItem('darkMode') === 'true';
        console.log(ifDarkmode);

        // Toggle the dark mode state
        const newDarkModeState = !ifDarkmode;
        localStorage.setItem('darkMode', newDarkModeState);

        body.classList.toggle('darkMode', newDarkModeState);
        darkModeBtn.innerHTML = newDarkModeState ? 'Light Mode' : 'Dark Mode';

        if (newDarkModeState) {
            body.setAttribute("data-bs-theme", "dark");
        } else {
            body.removeAttribute("data-bs-theme");
        }
    }

    document.getElementById("darkModeBtn").addEventListener("click", darkMode);

    // Save dark/light mode if you're refreshing the page
    function onload() {
        const ifDarkmode = localStorage.getItem('darkMode') === 'true';
        const body = document.body;
        const darkModeBtn = document.getElementById("darkModeBtn");


        // Set the class, button text, and attribute based on the current state
        body.classList.toggle('darkMode', ifDarkmode);
        darkModeBtn.innerHTML = ifDarkmode ? 'Light Mode' : 'Dark Mode';

        if (ifDarkmode) {
            body.setAttribute("data-bs-theme", "dark");
        } else {
            body.removeAttribute("data-bs-theme");
        }
    }
    document.addEventListener('DOMContentLoaded', onload)
    // ---------------------------------------------------------

    // Dropdown menu 
    // When the user clicks on the button,
    // toggle between hiding and showing the dropdown content 
    function dropDownFunc(index) {
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
    // --------------------------------------------------------

    // Show coins by search (on  key down)
    function createCoinCardBySearch() {
        let searchInputId = document.getElementById("searchInputId")
        divResponse.innerHTML = "";
        const newArray = arr.filter(item => item.symbol.toLowerCase().includes(searchInputId.value.toLowerCase()));
        console.log(newArray);
        let count = newArray.length
        displayAllCoins(newArray, count);
    }
    searchInputId.addEventListener("keydown", createCoinCardBySearch);
    searchInputId.addEventListener("click", createCoinCardBySearch);
    searchInputId.addEventListener("keyup", createCoinCardBySearch);




})()
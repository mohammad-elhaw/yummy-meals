
const mealData = document.querySelector("#mealData");
const navBar = document.querySelector("#navbar");
const navMenu = document.querySelector("#nav-logo > * + i");
const navBox = document.querySelector("#nav-content");
const searchContainer = document.querySelector("#search-container");
const screenLoader = document.querySelector("#loader-screen");
const navLinks = document.querySelectorAll(".links li");
let submitBtn;


document.querySelector("#nav-content #categories").addEventListener("click", ()=>{
    getCategories();
});

document.querySelector("#nav-content #area").addEventListener("click", ()=>{
    getArea();
});

document.querySelector("#nav-content #ingredients").addEventListener("click", ()=>{
    getIngredients();
});

document.querySelector("#nav-content #search").addEventListener("click", ()=>{
    showSearchInputs();
});

document.querySelector("#nav-content #contact-us").addEventListener("click", ()=>{
    showContact();
});


navMenu.addEventListener("click", (e)=>{
    let isClose = e.target.classList.contains("fa-align-justify");
    if(isClose) openNavBar();
    else closeNavBar(); 

});

let boxWidth = "";

function openNavBar(){
    navBar.classList.remove(`-left-[${boxWidth}px]`);
    navBar.classList.add("left-0");

    navMenu.classList.remove("fa-align-justify");
    navMenu.classList.add("fa-x");

    for (let i = 0; i < 5; i++) {
        const delay = i * 100;
    
        setTimeout(() => {
            navLinks[i].style.transition = 'top 0.5s ease-in-out';
            navLinks[i].style.top = '0';
        }, delay);
    }
    
}

function closeNavBar(){
    boxWidth = navBox.offsetWidth;
    navBar.classList.add(`-left-[${boxWidth}px]`);
    navBar.classList.remove("left-0");

    navMenu.classList.add("fa-align-justify");
    navMenu.classList.remove("fa-x");

    navLinks.forEach((li) => {
        
        li.style.transition = 'top 0.5s ease'; 
        li.style.top = '300px';
    });

}


(function(){
    closeNavBar();
    searchByName();
})();

async function searchByName(name = '', quantity = 25){
    closeNavBar();
    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    response = await response.json();

    closeScreenLoader();
    response.meals ? displayMeals(response.meals.slice(0,quantity)) : displayMeals([]);
    
}


function displayMeals(arr){
    let container = ``;

    for(let i = 0; i < arr.length; ++i){
        container +=
        `
            <div class=" sm:w-1/4 p-3">
                <div id="${arr[i].idMeal}" class="items relative group overflow-hidden cursor-pointer">
                    <div class="meal-layer border rounded-md"><h2 class="text-xl font-medium">${arr[i].strMeal}</h2></div>
                    <img src="${arr[i].strMealThumb}" class="border rounded-md border-none w-full" alt="">
                </div>
            </div>
        `;
    }
    mealData.innerHTML = container;
    addMealsItemsEvent();
}


function addMealsItemsEvent(){
    document.querySelectorAll(".items").forEach((item)=>{
        item.addEventListener("click",()=>{
            const id = item.getAttribute("id");
            getMealsDetails(id);
        });
    });
}

async function getMealsDetails(id){
    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    response = await response.json();
    closeScreenLoader();
    showDetails(response.meals[0]);
}

function showDetails(meal){
    searchContainer.innerHTML = "";
    
    let recipes = ``;

    for(let i = 0; i < 20; ++i){
        if(meal[`strIngredient${i}`] && meal[`strMeasure${i}`]){
            recipes += 
            `
                <li class="m-2 p-1 bg-[#cff4fc] rounded-md">
                    ${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}
                </li>
            `
        }
    }

    let tagsArr = meal.strTags?.split(",");
    let tags = ``;

    if(tagsArr){
        for(let i = 0; i < tagsArr.length; ++i){
            tags +=
            `
            <li class="m-2 p-1 bg-[#f8d7da] rounded-md">${tagsArr[i]}</li> 
            `
        }
    }
    

    let container = 
    `
        <div class="sm:w-1/3 px-4">
                <img src="${meal.strMealThumb}" alt="">
                <h2 class="text-white text-xl font-medium mb-2">${meal.strMeal}</h2>
            </div>

            <div class="sm:w-2/3 px-4">
                <h2 class="text-white text-2xl font-bold mb-2">Instructions</h2>

                <p class="text-white mb-4">${meal.strInstructions}</p>

                <h3 class="text-white text-xl font-semibold mb-2">
                    <span class="text-white font-bold">Area :</span>
                    ${meal.strArea}
                </h3>

                <h3 class="text-white text-xl font-semibold mb-2">
                    <span class="text-white font-bold">Category :</span>
                    ${meal.strCategory}
                </h3>

                <h3 class="text-white text-xl font-semibold mb-2">Recipe :</h3>
                
                <ul class="flex flex-wrap text-[#055160] mb-4">
                    ${recipes}
                </ul>


                <h3 class="text-white text-xl font-semibold mb-2">Tags :</h3>
                <ul class="flex flex-wrap text-[#842029] mb-4">
                    ${tags}
                </ul>

                <a class="btn btn-success" href="${meal.strSource}" target="_blank">Source</a>
                
                <a class="btn btn-danger" href="${meal.strYoutube}" target="_blank">Youtube</a>
            </div>
    `;

    mealData.innerHTML = container;
}


function openScreenLoader(){
    
    
    screenLoader.classList.remove("hidden");
    screenLoader.firstElementChild.style.opacity = 0;
    
    void screenLoader.firstElementChild.offsetWidth;
    screenLoader.firstElementChild.style.transition = "all 0.3s ease-in-out";
    screenLoader.firstElementChild.style.opacity = 1;
    
}

function closeScreenLoader(){

    const icon = screenLoader.firstElementChild;
    icon.style.opacity = 0;

    icon.addEventListener('transitionend', function handleTransitionEnd() {
        screenLoader.classList.add("hidden");
        icon.removeEventListener('transitionend', handleTransitionEnd);
    });
}

async function getCategories(){
    searchContainer.innerHTML = "";
    closeNavBar();

    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();
    
    closeScreenLoader();
    displayCategories(response.categories);
    
}

function displayCategories(arr){
    let container = ``;
    for(let i = 0; i < arr.length; ++i){
        container +=
        `
            <div class="w-full sm:w-1/4 p-3">
                <div data-category="${arr[i].strCategory}" class="items relative group overflow-hidden cursor-pointer">
                    <div class="meal-layer flex-col">
                        <h2 class="text-xl font-medium">
                            ${arr[i].strCategory}
                        </h2>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                    <img src="${arr[i].strCategoryThumb}" class="border rounded-md border-none w-full" alt="">
                </div>
            </div>
        `;
    }
    mealData.innerHTML = container;
    addCategoryItemEvent();
}


function addCategoryItemEvent(){
    document.querySelectorAll(".items").forEach((item)=>{
        item.addEventListener("click", ()=>{
            const category = item.getAttribute("data-category");
            getCategoryMeal(category);
        });
    });
}


async function getCategoryMeal(category){
    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();

    closeScreenLoader();
    displayMeals(response.meals.slice(0, 20));
}


async function getArea(){
    searchContainer.innerHTML = "";
    closeNavBar();
    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();

    closeScreenLoader();
    displayArea(response.meals);
}


function displayArea(arr){
    let container = ``;

    for(let i = 0; i < arr.length; ++i){
        container +=
        `
            <div class="w-full sm:w-1/4 p-3">
                <div data-area="${arr[i].strArea}" class="items relative group cursor-pointer text-center">
                    <i class="fa-solid fa-house-laptop fa-4x text-white"></i>
                    <h3 class="text-xl font-medium text-white">${arr[i].strArea}</h3>
                </div>
            </div>
        `;
    }

    mealData.innerHTML = container;
    addAreaItemEvent();
}

function addAreaItemEvent(){
    document.querySelectorAll(".items").forEach((item)=>{
        item.addEventListener("click", ()=>{
            const area = item.getAttribute("data-area");
            getAreaMeal(area);
        });
    });
}


async function getAreaMeal(area){
    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();

    closeScreenLoader();
    displayMeals(response.meals);
}


async function getIngredients(){
    searchContainer.innerHTML = "";
    closeNavBar();
    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();

    closeScreenLoader();
    displayIngredients(response.meals.slice(0,20));
}


function displayIngredients(arr){
    let container = ``;

    for(let i = 0; i < arr.length; ++i){
        container +=
        `
            <div class="w-full sm:w-1/4 p-3">
                <div data-ingredient="${arr[i].strIngredient}" class="items relative group cursor-pointer text-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x text-white"></i>
                    <h3 class="text-xl font-medium text-white">${arr[i].strIngredient}</h3>
                    <p class="text-white ">${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        `;
    }
    mealData.innerHTML = container;
    addIngredientItemEvent();
}

function addIngredientItemEvent(){
    document.querySelectorAll(".items").forEach((item)=>{
        item.addEventListener("click", ()=>{
            const ingredient = item.getAttribute("data-ingredient");
            getIngredientsMeal(ingredient);
        });
    });
}


async function getIngredientsMeal(ingredient){
    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    response = await response.json();

    closeScreenLoader();
    displayMeals(response.meals.slice(0,20));
}

function showSearchInputs(){
    closeNavBar();
    searchContainer.innerHTML =
    `
        <div class="w-full py-6 flex flex-col sm:flex-row">
            <div class="w-full sm:w-1/2 px-3">
                <input class="w-full text-white bg-transparent border 
                    rounded-md py-[0.375rem] px-[0.75rem] focus:outline-0 
                    focus:border-[#86b7fe] 
                    focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]" 
                    type="text" 
                    placeholder="Search By Name">
            </div>

            <div class="w-full sm:w-1/2 px-3">
                <input id="search-by-letter" class="w-full text-white bg-transparent border 
                    rounded-md py-[0.375rem] px-[0.75rem] focus:outline-0 
                    focus:border-[#86b7fe] 
                    focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]" 
                    type="text"
                    maxLength="1"
                    placeholder="Search By First Letter">
            </div>
        </div>
        
    `;
    mealData.innerHTML= "";
    addSearchItemEvent();
}


function addSearchItemEvent(){
    const firstInput = searchContainer.firstElementChild.querySelector("input");
    const secondInput = document.querySelector("#search-by-letter");
    

    firstInput.addEventListener("input", ()=>{
        let val = firstInput.value;
        searchByName(val);
    });

    secondInput.addEventListener("input", ()=>{
        let val = secondInput.value;
        searchByFirstLetter(val);
    });
}


async function searchByFirstLetter(val){
    closeNavBar();

    if(!val) val = 'a';
    openScreenLoader();
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${val}`);
    response = await response.json();

    closeScreenLoader();
    response.meals ? displayMeals(response.meals) : displayMeals([]);

}


function showContact(){
    searchContainer.innerHTML = "";
    closeNavBar();
    mealData.innerHTML = 
    `
        <div class="min-h-screen container flex flex-wrap justify-center items-center">

                <div class="container w-3/4 text-center">
                    <div class="flex flex-wrap">
                        <div class="w-full md:w-1/2 p-3">
                            <input id="nameInput" class="w-full custom-btn bg-white" type="text" placeholder="Enter Your name">

                            <div class="w-full alert-btn hidden">Special characters and numbers not allowed</div>
                        </div>

                        <div class="w-full md:w-1/2 p-3">
                            <input id="emailInput" class="w-full custom-btn bg-white" type="text" placeholder="Enter Your Email">

                            <div class="w-full alert-btn hidden">Email not valid *exemple@yyy.zzz</div>
                        </div>

                        <div class="w-full md:w-1/2 p-3">
                            <input id="phoneInput" class="w-full custom-btn bg-white" type="text" placeholder="Enter Your Phone">

                            <div class="w-full alert-btn hidden">Enter valid Phone Number</div>
                        </div>

                        <div class="w-full md:w-1/2 p-3">
                            <input id="ageInput" class="w-full custom-btn bg-white" type="text" placeholder="Enter Your Age">

                            <div class="w-full alert-btn hidden">Enter valid age</div>
                        </div>

                        <div class="w-full md:w-1/2 p-3">
                            <input id="passwordInput" class="w-full custom-btn bg-white" type="password" placeholder="Enter Your Password">

                            <div class="w-full alert-btn hidden">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
                        </div>

                        <div class="w-full md:w-1/2 p-3">
                            <input id="repasswordInput" class="w-full custom-btn bg-white" type="password" placeholder="Repassword">

                            <div class="w-full alert-btn hidden">Enter valid repassword</div>
                        </div>
                        
                    </div>
                    
                    <button id="submit-btn" class="btn btn-outline-danger" disabled>submit</button>
                </div>
                
            </div>
    `;

    submitBtn = document.querySelector("#submit-btn");

    
    document.querySelector("#nameInput").addEventListener("keyup", (e) => {
        let val = e.target.value;
        let id = e.target.id;
        let nextSibling = e.target.nextElementSibling;
        inputsValidation(id, val, nextSibling);
    })
    
    document.querySelector("#emailInput").addEventListener("keyup", (e) => {
        let val = e.target.value;
        let id = e.target.id;
        let nextSibling = e.target.nextElementSibling;
        inputsValidation(id, val, nextSibling);
    })
    
    document.querySelector("#phoneInput").addEventListener("keyup", (e) => {
        let val = e.target.value;
        let id = e.target.id;
        let nextSibling = e.target.nextElementSibling;
        inputsValidation(id, val, nextSibling);
    })
    
    document.querySelector("#ageInput").addEventListener("keyup", (e) => {
        let val = e.target.value;
        let id = e.target.id;
        let nextSibling = e.target.nextElementSibling;
        inputsValidation(id, val, nextSibling);
    })
    
    document.querySelector("#passwordInput").addEventListener("keyup", (e) => {
        let val = e.target.value;
        let id = e.target.id;
        let nextSibling = e.target.nextElementSibling;
        inputsValidation(id, val, nextSibling);
    })
    
    document.querySelector("#repasswordInput").addEventListener("keyup", (e) => {
        let val = e.target.value;
        let id = e.target.id;
        let nextSibling = e.target.nextElementSibling;
        inputsValidation(id, val, nextSibling);
    })

   

    
}


let nameInputValidation = false;
let emailInputValidation = false;
let phoneInputValidation = false;
let ageInputValidation = false;
let passwordInputValidation = false;
let repasswordInputValidation = false;


function inputsValidation(id, val, alertElement){
    if(id == "nameInput"){
        if(nameValidation(val)){
            alertElement.classList.add("hidden");
            nameInputValidation = true;
        }
        else{
            alertElement.classList.remove("hidden");
            nameInputValidation = false;
        }
    }
    else if(id == "emailInput"){
        if(emailValidation(val)){
            alertElement.classList.add("hidden");
            emailInputValidation = true;
        }
        else{
            alertElement.classList.remove("hidden");
            emailInputValidation = false;
        }
    }
    else if(id == "phoneInput"){
        if(phoneValidation(val)){
            alertElement.classList.add("hidden");
            phoneInputValidation = true;
        }
        else{
            alertElement.classList.remove("hidden");
            phoneInputValidation = false;
        }
    }
    else if(id == "ageInput"){
        if(ageValidation(val)){
            alertElement.classList.add("hidden");
            ageInputValidation = true;
        }
        else{
            alertElement.classList.remove("hidden");
            ageInputValidation = false;
        }
    }
    else if(id == "passwordInput"){
        if(passwordValidation(val)){
            alertElement.classList.add("hidden");
            passwordInputValidation = true;
        }
        else{
            alertElement.classList.remove("hidden");
            passwordInputValidation = false;
        }
    }
    else{
        if(repasswordValidation(val)){
            alertElement.classList.add("hidden");
            repasswordInputValidation = true;
        }
        else{
            alertElement.classList.remove("hidden");
            repasswordInputValidation = false;
        }
    }

    if(
        nameInputValidation &&
        emailInputValidation &&
        phoneInputValidation &&
        ageInputValidation &&
        passwordInputValidation &&
        repasswordInputValidation
    ) submitBtn.removeAttribute("disabled");
    else submitBtn.setAttribute("disabled", true);
}


function nameValidation(val) {
    return (/^[a-zA-Z ]+$/.test(val))
}

function emailValidation(val) {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val));
}

function phoneValidation(val) {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val));
}

function ageValidation(val) {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(val));
}

function passwordValidation(val) {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(val));
}

function repasswordValidation(val) {
    return document.getElementById("passwordInput").value == val;
}
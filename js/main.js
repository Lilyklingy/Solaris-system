/* defining data */
const overlayElem = document.querySelector('.overlay-plant-infor');
const plantsElem = document.querySelector('.plants');
const url = 'https://fathomless-shelf-54969.herokuapp.com/';

getKey();

overlayElem.addEventListener('click', () => {
    overlayElem.style.display = 'none';
});

async function getKey(){
    const responseKey = await fetch(`${url}keys`, {
        method: 'POST'
    });
    
    let dataKey = await responseKey.json();
    const key = dataKey.key;
    
    getBodies(key);
}

async function getBodies(key) {
    const responseBodies = await fetch(`${url}bodies`, {
        method: 'GET',
        headers: {'x-zocom': key}
    })
    
    let data = await responseBodies.json();
    console.table(data.bodies);
    generateBodies(data.bodies);
    generateEventlisteners(data.bodies);
}

function generateEventlisteners(bodies) {
    const bodiesElem = document.querySelectorAll('.plants-stars');
    for(let body of bodiesElem) {
        body.addEventListener('click', event => {
            overlayElem.style.display = 'flex';
            displayData(body.id, bodies);
        });
    }
}

function displayData(bodyId, bodies) {

    const titleElem = document.querySelector('.overlay-title');
    const subitleElem = document.querySelector('.overlay-subtitle');
    const descriptionElem = document.querySelector('.overlay-description');
    const circuitElem = document.querySelector('#circuit');
    const distanceElem = document.querySelector('#distance');
    const tempratureDayElem = document.querySelector('#tempratureDay');
    const tempratureNightElem = document.querySelector('#tempratureNight');
    const moonsElem = document.querySelector('#moons');
    const bodyOverlayElem = document.querySelector('.overlay-plant');
    
    for(let body of bodies) {
        if(bodyId == body.latinName.toLowerCase()){
            console.log(body);
            titleElem.innerHTML = body.name.toUpperCase();
            subitleElem.innerHTML = body.latinName.toUpperCase();
            descriptionElem.innerHTML = body.desc;
            circuitElem.innerHTML = body.circumference;
            distanceElem.innerHTML = body.distance;
            tempratureDayElem.innerHTML = body.temp.day;
            tempratureNightElem.innerHTML = body.temp.night;

            if(body.moons == 0) {
                moonsElem.innerHTML = "Inga månar";
            } else if(body.moons == 1) {
                moonsElem.innerHTML = body.moons[0];
            } else{
                moonsElem.innerHTML = convertArrayToString(body.moons);
            }
            
            bodiesId(bodyOverlayElem, body);
            displayBodyAside(bodyOverlayElem, body);

            break;
        }
    }

}

function convertArrayToString(moons) {
    console.log(moons);
    let stringOfMoons = "";
    for(let moon of moons) {
        stringOfMoons += `${moon}, `;
    }
    stringOfMoons = stringOfMoons.slice(0, -2);
    return stringOfMoons;
}

function generateBodies(bodies) {
    for(let body of bodies){
        const bodyElem = document.createElement('aside');
        const planetSize = (body.circumference / 2000);
        
        
        bodiesId(bodyElem, body);
        bodiesClass(bodyElem, body);
        
        if(body.type == "star") {
            displayBodyAside(bodyElem, body);
        } else if(body.type == "planet") {
            bodyElem.style.height = planetSize + "px";
            bodyElem.style.width = planetSize + "px";
        } else {
            console.log("What is going on?");
        }
        
        plantsElem.appendChild(bodyElem);
    }
}

function displayBodyAside(bodyElem, body) {
    const starSize = (body.circumference / 6000);
    const starHidden = -(starSize/10)*9;
    
    plantsElem.style.marginLeft = starHidden*-0.1 + "px";
    bodyElem.style.height = starSize + "px";
    bodyElem.style.width = starSize + "px";
    bodyElem.style.left = starHidden + "px";
}

function bodiesId(bodyElem, body) {
    bodyElem.id = body.latinName.toLowerCase();
}

function bodiesClass(bodyElem, body){
    bodyElem.classList.add('plants-stars');
    if(body.type == "star") {
        bodyElem.classList.add('plant-star');
    }
}
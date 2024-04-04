var points = 10;

var prestiges = 0;
var prestigerequirement = 1000000;
var prestigepoints = 0;

var upgrades = {
                1: {amount: 0, price: 10, id: "firstupgrade"},
                2: {amount: 0, price: 100, id: "secondupgrade"},
                3: {amount: 0, price: 1000, id: "thirdupgrade"}
               };

var autoInterval = 10;

var pointcounter = document.getElementById("pointcounter");
var autocounter = document.getElementById("autocounter");
var clickcounter = document.getElementById("clickcounter");
var prestigecounter = document.getElementById("prestigecounter");

function updatePointCounter() {
    pointcounter.textContent = "You have " + Math.round(points) + " Rizz";
}

function updateAutoCounter() {
    autocounter.textContent = "You gain " + Math.round(upgrades[1].amount) + " Rizz every second";
}

function updatePrestigeCounter() {
    prestigecounter.textContent = "You have " + prestigepoints + " Skibidi Points";
}

function handleAutoClick() {
    points += upgrades[1].amount/100;
    upgrades[1].amount += upgrades[2].amount/100
    upgrades[2].amount += upgrades[3].amount/100
    
    updatePointCounter()
    updateAutoCounter()
}

function handleUpgrade(num) {
    let upgradecost = upgrades[num].price;
    
    if (points >= upgradecost) {
        points -= upgradecost;
        upgrades[num].amount += 1;
        //upgrades[num].cost += Math.round(upgradecost/10)
        
        updatePointCounter()
        updateAutoCounter()
    }
}

function prestige() {
    if (points >= prestigerequirement) {
        prestiges += 1;
        points = 0;
        prestigepoints += 1;
        updatePointCounter()
        updateAutoCounter()
        updatePrestigeCounter()
    }
}

setInterval(handleAutoClick, autoInterval);
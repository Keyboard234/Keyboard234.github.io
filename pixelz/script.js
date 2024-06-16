const display = document.getElementById("display");
const ctx = display.getContext("2d");
const imageLoaderCanvas = document.getElementById("imageLoaderCanvas");
const loadctx = imageLoaderCanvas.getContext("2d");

const pixelCounter = document.getElementById("pixelCounter");
const mainButton = document.getElementById("mainButton");

const sourcevid = document.getElementById("Video");

var currentrow = 0;
var currentcol = 0;
var currentframe = 0;
var maxframes;

var pixels = 0;
var pixelsPerClick = 1;
var pixelsPerSecond = 0;
var autoRate = 100;
var autopixels = 0;
var pixelMultiplier = 1;

var imgwidth = 15;
var imgheight = 15;
var pixelsize = 32;

var fileURL;
var imageData;

var clickupgrades = { "click": { "cost": 10, "effect": 1 } }
var autoupgrades = { "auto": { "cost": 0, "effect": 1 } }

document.getElementById('fileInput').addEventListener('change', function(event) {
    file = event.target.files[0];
    var fr = new FileReader();
    fr.addEventListener("load", () => {
        fileURL = fr.result;
        loadVideo(fileURL);
    });
    fr.readAsDataURL(file);
    mainButton.textContent = "Loading...";
})

function loadVideo(fileurl) {
    sourcevid.src = fileurl;
    sourcevid.currentTime = currentframe;
    sourcevid.addEventListener("canplay", () => {
        loadctx.drawImage(sourcevid, 0, 0, imgwidth, imgheight);
        imageData = loadctx.getImageData(0, 0, imgwidth, imgheight).data;
        updateClickButton();
    });
}

function getImagePixel(x, y) {
    var pixelNum = x + (y * imgwidth);
    var pixelStart = pixelNum * 4;
    var color = "rgb(" + imageData[pixelStart].toString() + ", " + imageData[pixelStart + 1].toString() + ", " + imageData[pixelStart + 2].toString() + ")"
    return color
}

function updatePixelCounter() {
    pixelCounter.textContent = pixels + " Pixels";
}
function updateClickButton() {
    mainButton.textContent = "Render " + pixelsPerClick*pixelMultiplier + " Pixels";
}

function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelsize, y * pixelsize, pixelsize, pixelsize);
}

function newPixel() {
    var currentcolor = getImagePixel(currentrow, currentcol);
    drawPixel(currentrow, currentcol, currentcolor);
    currentrow++;
    if (currentrow > imgwidth - 1) {
        currentcol++;
        currentrow = 0;
        if (currentcol > imgheight - 1) {
            currentcol = 0;
            currentrow = 0;
            currentframe += 0.2;
            if (currentframe > sourcevid.duration) {
                currentframe = 0;
            }
            sourcevid.currentTime = currentframe;
        }
    }
}

function handleUpgrade(upgName) {
    if (clickupgrades[upgName] && pixels >= clickupgrades[upgName].cost) {
        pixels -= clickupgrades[upgName].cost;
        pixelsPerClick += clickupgrades[upgName].effect;
        updateClickButton();
        updatePixelCounter();
    }
    if (autoupgrades[upgName] && pixels >= autoupgrades[upgName].cost) {
        pixels -= autoupgrades[upgName].cost;
        pixelsPerSecond += autoupgrades[upgName].effect;
        updatePixelCounter();
    }
    if (upgName == "imageSize" && pixelsize > 2 && pixels >= 10000) {
        pixels -= 10000;
        
        pixelsize /= 2;
        imgwidth *= 2;
        imgheight *= 2;
        
        currentrow = 0;
        currentcol = 0;
        currentframe = 0;
        
        pixelMultiplier++;
        
        sourcevid.currentTime = currentframe;
        updatePixelCounter();
    }
}

function handleClick() {
    if (!imageData) { return; }
    pixels += pixelsPerClick*pixelMultiplier;
    updatePixelCounter()
    for (i = 0; i < pixelsPerClick*pixelMultiplier; i++) {
        newPixel();
    }
}

function handleAutoClick() {
    if (!imageData) { return; }
    autopixels += pixelsPerSecond*pixelMultiplier / autoRate;
    if (autopixels >= 1) {
        var newpixels = Math.floor(autopixels);
        pixels += newpixels;
        updatePixelCounter()
        for (i = 0; i < newpixels; i++) {
            newPixel();
        }
        autopixels = 0;
    }
}

setInterval(handleAutoClick, 1000 / autoRate)

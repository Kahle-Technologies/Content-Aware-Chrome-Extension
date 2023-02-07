window.addEventListener('load', () => {

    document.getElementById("kt_addSearchItem").onclick = () => {
        addQuerySpec();
    }

    document.getElementById("kt_addSearchItemInput").onkeyup = function (event) {
        if (event.key === "Enter")
            addQuerySpec();
    }

    chrome.storage.local.get('kt_searchTerms', (searchTerms) => {
        let kt_SearchQuery = searchTerms.kt_searchTerms;
        if (!(kt_SearchQuery == "" || kt_SearchQuery == undefined)) {
            querySpecs = JSON.parse(kt_SearchQuery);
            loadQuerySpecs();
        }
    })

});

let querySpecs = [];

function addQuerySpec() {
    let value = document.getElementById("kt_addSearchItemInput").value;
    if (value === undefined || value == "") return;
    let hex = `#${Math.floor(Math.random() * (255 - 0 + 1) + 0).toString(16)}${Math.floor(Math.random() * (255 - 0 + 1) + 0).toString(16)}${Math.floor(Math.random() * (255 - 0 + 1) + 0).toString(16)}`
    querySpecs.push({ searchString: value, color: hex });
    setQuerySpecs();
    document.querySelector("#kt_searchCriteraItems > tbody").innerHTML = "";
    loadQuerySpecs();
    document.getElementById("kt_addSearchItemInput").value = null;
}

function loadQuerySpecs() {
    for (let i = 0; i < querySpecs.length; i++) {
        createItem(querySpecs[i], i);
    }
}

function setQuerySpecs() {
    chrome.storage.local.set({ "kt_searchTerms": JSON.stringify(querySpecs) }, () => { });
}

function removeQuerySpec(index) {
    querySpecs.splice(index, 1);
    document.querySelector("#kt_searchCriteraItems > tbody").innerHTML = "";
    setQuerySpecs();
    loadQuerySpecs();
}

function updateColor(index, newColor) {
    querySpecs[index].color = newColor;
    setQuerySpecs();
}

function createItem(querySpec, index) {
    var table = document.querySelector("#kt_searchCriteraItems > tbody");
    var tr = document.createElement("tr");
    var td1 = document.createElement("td");
    td1.className = "td-1";
    var td2 = document.createElement("td");
    td2.className = "td-2";
    var label = document.createElement("label");
    label.innerText = querySpec.searchString;
    label.htmlFor = `colorInput${index}`;
    label.style.width = "100%";
    td1.appendChild(label);
    setTdColor(td1, querySpec.color);
    var color = document.createElement("input");
    color.type = "color";
    color.value = querySpec.color;
    color.name = `colorInput${index}`;
    color.oninput = (element) => { setTdColor(td1, element.target.value) };
    color.onchange = () => { updateColor(index, color.value) };
    td1.appendChild(color);
    var button = document.createElement("button");
    button.innerText = "Remove";
    button.onclick = () => { removeQuerySpec(index) };
    td2.appendChild(button);
    td1.onclick = () => { color.click() };
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.append(tr);
}

function setTdColor(element, color) {
    element.style.backgroundColor = color;
    element.style.color = fontColor(color);
}

function fontColor(hex) {
    let lightGuaranteedThreshold = 200;
    let darkThreshold = 175;
    let darkThresholdMixUp = 150;
    let darkThresholdMixLow = 50;
    let red = parseInt(hex[1] + hex[2], 16);
    let green = parseInt(hex[3] + hex[4], 16);
    let blue = parseInt(hex[5] + hex[6], 16);
    let rgb = [red, green, blue];
    let enforceLight = rgb.filter(num => num > lightGuaranteedThreshold).length > 0;
    let underDarkThreshold = rgb.filter(num => num < darkThreshold);
    let underDarkThresholdMixLow = underDarkThreshold.filter(num => num < darkThresholdMixLow);
    let underDarkThresholdMixUp = underDarkThresholdMixLow.filter(num => num < darkThresholdMixUp);
    if ((red + blue + green < 340) && !enforceLight && (underDarkThreshold.length === 3 || (underDarkThresholdMixLow.length > 0 && underDarkThresholdMixUp.length > 0)))
        return "#ebebeb";
    else return "#444";
}
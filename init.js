/// Author Daniel Kahle
///Written to be used for both OTES internal useage and Kahle Technologies external usage.
///OTES:ckeogdplnlkgkmogjnpmocloghjkbggh
///Kahle Tech: jjgkbaokpbjpmkfflamehnbhfjdfodkj
const buttonId = "kt_notifier_div";
let itemsFound = [];
let itemsFoundPlain = [];
function addNotification(searchTerm) {
    if(itemsFoundPlain.includes(searchTerm.searchString)) return;
    itemsFound.push(`<span style="background:${searchTerm.color};color:${fontColor(searchTerm.color)}">${searchTerm.searchString}</span>`);
    itemsFoundPlain.push(searchTerm.searchString)
}

function displayNotifications() {
  document.querySelector(buttonId)?.remove();
  var darkMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var background = (darkMode) ? "#444444" : "#eeeeee";
  var div = document.createElement("div");
  div.id = buttonId;
  div.innerHTML = `Located: "${itemsFound.join(", ")}"`;
  div.style.backgroundColor = background;
  div.style.color = fontColor(background);
console.log(div);
  chrome.storage.local.get('kt_alertSize', (kt_alertSize) => {
    let alertSize;
    if (Number(kt_alertSize.kt_alertSize))
      alertSize = parseFloat(kt_alertSize.kt_alertSize).toFixed(2);
    else
      alertSize = 1;
    div.style.fontSize = `${alertSize}em`;
    let body = document.querySelector("body");
    body.prepend(div);
    body.style.marginTop = `${document.getElementById("kt_notifier_div").offsetHeight}px`;
  })
}
function kt_search(searchTerm) {
  let doc = document.querySelector("body").innerHTML;
  let reg = new RegExp(`(${searchTerm.searchString}(?=(([^<>]*?)\<)(?!\/textarea)))`, "gi");
  found = reg.test(doc);
  if (found) {
    if(searchTerm.highlight === true) {
      let html = doc.replace(reg, `<span style="background:${searchTerm.color};color:${fontColor(searchTerm.color)};">${searchTerm.searchString}</span>`)
      document.body.innerHTML = html;
    }

      addNotification(searchTerm);
    }
    return found;
}
function kt_start_search() {
  chrome.storage.local.get('kt_searchTerms', (searchQuery) => {
    let kt_SearchQuery = JSON.parse(searchQuery.kt_searchTerms);
    let foundOnPage = false;
    for (let i = 0; i < kt_SearchQuery.length; i++)
        if (kt_search(kt_SearchQuery[i]))
        foundOnPage = true;
    if(foundOnPage)
      displayNotifications();
  });
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

window.addEventListener('load', () => {
  kt_start_search();
});

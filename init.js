const buttonId = "kt_notifier_div";
function addNotifier(searchTerm) {

  document.querySelector(buttonId)?.remove();
  var div = document.createElement("div");
  div.id = buttonId;
  div.innerText = `Content Aware Found: "${searchTerm.searchString}"`;
  div.style.background = searchTerm.color;
  div.style.color = fontColor(searchTerm.color);


  chrome.storage.local.get('kt_alertSize', (kt_alertSize) => {
    let alertSize;
    if (Number(kt_alertSize.kt_alertSize))
      alertSize = parseFloat(kt_alertSize.kt_alertSize).toFixed(2);
    else
      alertSize = 1;
    div.style.fontSize = `${alertSize}em`;
    document.querySelector("body").appendChild(div);
    document.querySelector("body").style.marginTop = `${document.getElementById("kt_notifier_div").offsetHeight}px`;
  })
}
function kt_search(searchTerm) {
  let found = window.find(searchTerm.searchString);
  if (found)
    addNotifier(searchTerm);
  window.getSelection()?.removeAllRanges();
  return found;
}
function kt_start_search() {
  chrome.storage.local.get('kt_searchTerms', (searchQuery) => {
    let kt_SearchQuery = JSON.parse(searchQuery.kt_searchTerms);
    for (let i = 0; i < kt_SearchQuery.length; i++)
      if (kt_search(kt_SearchQuery[i]))
        break;
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
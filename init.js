const buttonId = "kt_notifier_div";
function addNotifier(divText) {
  document.querySelector(buttonId)?.remove();
  var div = document.createElement("div");
  div.id = buttonId;
  div.innerText = divText;
  document.querySelector("body").appendChild(div);
  document.querySelector("body").style.marginTop = "1em";
}
function kt_search(searchString) {
  let found = window.find(searchString);
  if(found)
    addNotifier(`Content Aware Found: "${searchString}"`);
  window.getSelection()?.removeAllRanges();
  return found;
}
function kt_start_search(){
  chrome.storage.local.get('kt_searchTerms', (searchTerms)=>{
    let kt_SearchQuery = searchTerms.kt_searchTerms.split("\n");
    for(let i = 0; i < kt_SearchQuery.length; i++)
      if(kt_search(kt_SearchQuery[i]))
        break;
});
}
window.addEventListener('load', ()=>{
  kt_start_search();
});
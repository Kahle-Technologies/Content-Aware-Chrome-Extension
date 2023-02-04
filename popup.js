document.addEventListener('DOMContentLoaded', function() {  
    document.getElementById("kt_bigSearchButton").onclick = ()=>{
        let textArea = document.getElementById("kt_SearchQuery");
        chrome.storage.local.set({"kt_searchTerms": textArea.value}, () => {});
        kt_start_search();
    }
    chrome.storage.local.get('kt_searchTerms', (searchTerms)=>{
        let kt_SearchQuery = searchTerms.kt_searchTerms;
        if(!(kt_SearchQuery == "" || kt_SearchQuery == undefined)){
            document.getElementById("kt_SearchQuery").value = kt_SearchQuery;
        } 
    });
}, false);
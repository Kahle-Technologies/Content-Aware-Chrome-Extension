window.addEventListener('load', () => {

    document.getElementById("kt_fontSizeChanger").oninput = function (element) {
        document.getElementById("kt_notifier_div").style.fontSize = `${element.target.value}em`;
        document.querySelector("body").style.marginTop = `${document.getElementById("kt_notifier_div").offsetHeight}px`;
    }

    document.getElementById("kt_fontSizeChanger").onchange = function (element) {
        document.getElementById("kt_notifier_div").style.fontSize = `${element.target.value}em`;
        document.querySelector("body").style.marginTop = `${document.getElementById("kt_notifier_div").offsetHeight}px`;
        chrome.storage.local.set({ "kt_alertSize": element.target.value }, () => { });
    }

    document.getElementById("kt_resetSizeButton").onclick = function () {
        let defaultSize = 1;
        document.getElementById("kt_notifier_div").style.fontSize = `${defaultSize}em`;
        document.querySelector("body").style.marginTop = `${document.getElementById("kt_notifier_div").offsetHeight}px`;
        document.getElementById("kt_fontSizeChanger").value = defaultSize;
        chrome.storage.local.set({ "kt_alertSize": defaultSize }, () => { });
    }

    chrome.storage.local.get('kt_alertSize', (kt_alertSize) => {
        let alertSize;
        if (Number(kt_alertSize.kt_alertSize))
            alertSize = parseFloat(kt_alertSize.kt_alertSize).toFixed(2);
        else
            alertSize = 1;

        let hex = `#${Math.floor(Math.random() * (255 - 0 + 1) + 0).toString(16)}${Math.floor(Math.random() * (255 - 0 + 1) + 0).toString(16)}${Math.floor(Math.random() * (255 - 0 + 1) + 0).toString(16)}`
        document.getElementById("kt_fontSizeChanger").value = alertSize;
        document.getElementById("kt_notifier_div").style.fontSize = `${alertSize}em`;
        document.getElementById("kt_notifier_div").style.background = hex;
        document.getElementById("kt_notifier_div").style.color = fontColor(hex);

        document.querySelector("body").style.marginTop = `${document.getElementById("kt_notifier_div").offsetHeight}px`;
    })

});

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
const injectCheckbox: HTMLInputElement = document.getElementById("injection") as HTMLInputElement;
const ignoreBansCheckbox: HTMLInputElement = document.getElementById("ignoreBans") as HTMLInputElement;

window.onload = function () {
    chrome.storage.local.get("injection", function (data) {
        injectCheckbox.checked = data.injection;
    });

    chrome.storage.local.get("ignoreBans", function (data) {
        ignoreBansCheckbox.checked = data.ignoreBans;
    });
};

injectCheckbox.addEventListener("change", function (event: any) {
    chrome.storage.local.set({injection: event.target.checked});
});

ignoreBansCheckbox.addEventListener("change", function (event: any) {
    chrome.storage.local.set({ignoreBans: event.target.checked});
});
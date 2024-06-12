const injectCheckbox = document.getElementById('injection');
const ignoreBansCheckbox = document.getElementById('ignore-bans');

window.onload = function() {
    chrome.storage.local.get("injection", function (data) {
        injectCheckbox.checked = data.injection;
    });

    chrome.storage.local.get("ignoreBans", function (data) {
        ignoreBansCheckbox.checked = data.ignoreBans;
    });
};

injectCheckbox.addEventListener('change', (event) => {
    chrome.storage.local.set({injection: event.target.checked});
});

ignoreBansCheckbox.addEventListener('change', (event) => {
    chrome.storage.local.set({ignoreBans: event.target.checked});
});
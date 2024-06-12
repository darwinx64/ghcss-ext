const injectCheckbox = document.getElementById('injection');

window.onload = function() {
    chrome.storage.local.get("injection", function (data) {
        injectCheckbox.checked = data.injection;
    });
};

injectCheckbox.addEventListener('change', (event) => {
    chrome.storage.local.set({injection: injectCheckbox.checked});
});
// from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function inject() {
    const element = await waitForElement('#user-content-ghusrcss-code')
    if (element && element.textContent.trim()) {
        const styleElement = document.createElement("style")
        styleElement.textContent = element.textContent.trim()
        element.appendChild(styleElement) // we could also put this in the <head> but it gets buggy
    }

}

inject()

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'urlchange') {
            inject()
        }
    })
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
    // if injection = true, run this code
    const element = await waitForElement('#user-content-ghusrcss-code')
    if (element && element.textContent.trim()) {
        const styleElement = document.createElement("style")
        styleElement.textContent = element.textContent.trim()
        element.appendChild(styleElement) // we could also put this in the <head> but it gets buggy
    } 
    // else, give error in console
}

function injectWarning() {
    let text = "Would you like to load this user's custom CSS?";
    if (confirm(text) == true) {
        inject();
    } else {
      console.log("Inject failed because the user disallowed."); 
    }
  }

  injectWarning()
  // inject()

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'urlchange') {
            injectWarning() // might be the cause of #2?
        }
    })
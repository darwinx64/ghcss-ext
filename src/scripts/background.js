function injectScript(tabId) {
    chrome.scripting.executeScript(
        {
            target: {tabId: tabId},
            files: ["ghcss.js"],
        }
    );
}

chrome.webNavigation.onCompleted.addListener((details) => {
    if (["reload", "typed", "link"].includes(details.transitionType)) {
        injectScript(details.tabId);
    }
});
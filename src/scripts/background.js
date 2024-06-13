import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
    console.log("Installed!");
});

// Listen for tab updates and send a message to content scripts when the page is fully loaded and the tab is active
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
        chrome.tabs.sendMessage(tabId, {action: "ghcss"});
    }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle checkUser action by fetching user data from the backend server
    if (request.action === "checkUser" && request.userId) {
        fetch(`https://ghcss.bims.sh/user/${request.userId}`)
            .then(response => response.json())
            .then(data => sendResponse(data))
            .catch(error => console.error("Error fetching user data:", error));

        return true; // make the handler asynchronous
    }
});
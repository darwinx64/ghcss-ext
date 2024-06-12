chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
        chrome.tabs.sendMessage(tabId, {action: "ghcss"});
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkUser" && request.userId) {
        fetch(`http://localhost:5296/user/${request.userId}`)
            .then(response => response.json())
            .then(data => sendResponse(data))
            .catch(error => console.error("Error fetching user data:", error));

        return true;
    }
});

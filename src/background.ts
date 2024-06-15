chrome.runtime.onInstalled.addListener(() => {
    console.log("Installed GH-CSS");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.active) {
        chrome.tabs.sendMessage(tabId, {
            action: "ghcss",
            tabId: tabId
        }).catch(error => console.error(`Failed to send message: ${error}`));
    }

    return true;
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.url !== "") {
        if (request.action === "json") {
            await fetch(request.url)
                .then(response => response.json())
                .then(data => {
                    console.log(`Fetched JSON: ${request.url}`, data);

                    sendResponse(data)
                    return true;
                })
                .catch(error => console.error(`Failed to fetch JSON: ${error}`));
        } else if (request.action === "text") {
            await fetch(request.url, {
                headers: {
                    "Accept": "text/plain"
                }
            })
                .then(async response => response.text())
                .then(data => {
                    console.log(`Fetched text: ${request.url}`, data);

                    sendResponse(data)
                    return true;
                })
                .catch(error => console.error(`Failed to fetch text: ${error}`));
        } else {
            await fetch(request.url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch: ${response.statusText}`);
                    }

                    console.log(`Fetched: ${request.url}`, response);

                    sendResponse(response)
                    return true;
                })
                .catch(error => console.error(`Failed to fetch: ${error}`));
        }
    }

    return true; // make the handler asynchronous
});
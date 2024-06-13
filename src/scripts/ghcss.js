
//import DOMPurify from 'dompurify';

//console.log(DOMPurify.sanitize("<div>hello<div>"));

// Check if the URL corresponds to a valid GitHub user profile
function isGithubUserProfile(url) {
    try {
        const parsedUrl = new URL(url);

        // Ensure the URL is a valid GitHub profile
        if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "github.com") {
            return false;
        }

        const pathSegments = parsedUrl.pathname.split("/").filter(segment => segment !== "");

        // Ensure the URL path has exactly one segment, which is the username
        if (pathSegments.length === 1) {
            const username = pathSegments[0];
            const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,38}[a-zA-Z0-9])?$/;
            return usernameRegex.test(username);
        }

        return false;
    } catch (error) {
        return false;
    }
}

// Fetch the CSS file from the GitHub repository
async function fetchCssFile(url) {
    const parsedUrl = new URL(url);
    const username = parsedUrl.pathname.split("/").filter(segment => segment !== "")[0];
    const ghCssUrl = `https://raw.githubusercontent.com/${username}/${username}/main/gh.css`;

    try {
        const response = await fetch(ghCssUrl);
        if (!response.ok) return null;

        return await response.text();
    } catch (error) {
        console.error("Error fetching CSS file:", error.message);
        return null;
    }
}

// Append a style tag with the fetched CSS content to the document head
async function appendStyleTag(url) {
    try {
        const cssContent = await fetchCssFile(url);
        if (cssContent == null) return;

        const username = new URL(document.URL).pathname.split("/").filter(segment => segment!== "")[0];
        const styleElement = document.createElement("style");

        styleElement.id = "ghcss-container";
        styleElement.setAttribute("username", username);
        styleElement.innerText = cssContent;

        document.head.appendChild(styleElement);
        document.body.dataset.applied = "true";
    } catch (error) {
        console.error("Error appending style tag:", error.message);
    }
}

// Apply the custom GitHub CSS stylesheet
async function applyGhCssStylesheet(url) {
    if (!isGithubUserProfile(url)) {
        deleteCssContainer();
        return;
    }

    if (document.body.dataset.applied === "true") return;

    const cssContainer = document.getElementById("ghcss-container");

    if (cssContainer != null) {
        const lastUsername = cssContainer.getAttribute("username");
        const username = new URL(document.URL).pathname.split("/").filter(segment => segment!== "")[0];

        if (lastUsername !== username) {
            deleteCssContainer();
        }
    }

    await appendStyleTag(url);
}

// Remove the existing CSS container if it exists
function deleteCssContainer() {
    const cssContainer = document.getElementById("ghcss-container");
    if (cssContainer != null) cssContainer.remove();
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "ghcss") {
        if (!isGithubUserProfile(document.URL)) {
            deleteCssContainer();
            return;
        } else {
            chrome.storage.local.get("injection", async (data) => {
                if (await data.injection) {
                    const userId = document.querySelector('meta[name="octolytics-dimension-user_id"]').content;
                    chrome.storage.local.get("ignoreBans", async (data) => {
                        if (await data.ignoreBans) {
                            await applyGhCssStylesheet(document.URL);
                        } else {
                            const isBanned = await chrome.runtime.sendMessage({action: "checkUser", userId: userId}).isBanned;
                            if (!isBanned) await applyGhCssStylesheet(document.URL);
                        }
                    });
                }
            });
        }

        return true; // make the handler asynchronous
    }
});
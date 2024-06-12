function isGithubUserProfile(url) {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "github.com") {
            return false;
        }

        const pathSegments = parsedUrl.pathname.split("/").filter(segment => segment !== "");

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

async function fetchCssFile(url) {
    const parsedUrl = new URL(url);
    const username = parsedUrl.pathname.split("/").filter(segment => segment !== "")[0];
    const ghCssUrl = `https://raw.githubusercontent.com/${username}/${username}/main/gh.css`;

    try {
        const response = await fetch(ghCssUrl);
        if (!response.ok) return null;

        return await response.text();
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

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
        console.error(error.message);
    }
}

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

function deleteCssContainer() {
    const cssContainer = document.getElementById("ghcss-container");
    if (cssContainer != null) cssContainer.remove();
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    chrome.storage.local.get("injection", async function (data) {
        if (request.action === "ghcss" && await data.injection) {
            await applyGhCssStylesheet(document.URL);
        }
    });

    return true;
});
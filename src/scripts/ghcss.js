applyGhCssStylesheet(document.URL);

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

async function applyGhCssStylesheet(url) {
    if (document.getElementById("ghcss-container") == null) {
        if (!isGithubUserProfile(url)) return;

        try {
            const cssContent = await fetchCssFile(url);
            if (cssContent == null) return;

            const styleElement = document.createElement("style");
            styleElement.id = "ghcss-container";
            styleElement.innerText = cssContent;

            document.head.appendChild(styleElement);

            console.log("gh.css stylesheet has been applied.");
        } catch (error) {
            console.error(error.message);
        }
    }
}

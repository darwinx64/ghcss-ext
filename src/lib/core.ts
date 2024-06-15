import {fetchCss, getGithubPageType} from "./utils/github";
import {githubPageType} from "./types/github";
import {checkForBan} from "./utils/backend";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    try {
        const githubPage: {type: githubPageType | null, id: string | null} = getGithubPageType();
        if (githubPage.type === null || githubPage.id === null) return false;

        const isBanned = await checkForBan(githubPage.type, githubPage.id)
        if (isBanned) return false;

        // TODO: Fix the css being true??? for some reason
        const css: string = await fetchCss(document.URL, githubPage.type);
        if (css === null || css === undefined) return new Error("Failed to fetch CSS");

        const tabId: number = message.tabId;

        console.log(`Got tabId: ${tabId}`);
        console.log(`Got CSS: ${css}`);

        try {
            await chrome.scripting.insertCSS({
                target: {tabId},
                origin: "AUTHOR",
                css: css
            });
        } catch (error) {
            console.error(`Failed to inject GH-CSS: ${error}`);
        }
    } catch (error) {
        console.error(`Extension error: ${error}`);
    }

    return true;
});
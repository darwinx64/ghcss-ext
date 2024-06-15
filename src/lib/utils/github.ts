import {githubPageType} from "../types/github";

export function getGithubPageType(): { type: githubPageType | null, id: string | null } {
    const metaOrganization = document.querySelector('meta[content^="organization:"]')?.getAttribute("content")?.split(":").pop() || null;
    const metaRepository = document.querySelector('meta[content^="repository:"]')?.getAttribute("content")?.split(":").pop() || null;
    const metaUser = document.querySelector('meta[name="octolytics-dimension-user_id"]')?.getAttribute("content") || null;

    console.log(`Got GitHub page type: ${metaOrganization ? "Organization" : metaRepository ? "Repository" : metaUser ? "User" : "Unknown"} (${metaOrganization || metaRepository || metaUser})`);

    return {
        type: metaOrganization ? githubPageType.Organization : metaRepository ? githubPageType.Repo : metaUser ? githubPageType.User : null,
        id: metaOrganization || metaRepository || metaUser
    }
}

export async function fetchCss(url: string, pageType: githubPageType): Promise<string> {
    let css: string = "";

    try {
        switch (pageType) {
            case githubPageType.Organization:
                let orgCssPath = await getCssPath(url, pageType);
                css = await chrome.runtime.sendMessage({url: orgCssPath, action: "text"});
                break;
            case githubPageType.Repo:
                let repoCssPath = await getCssPath(url, pageType);
                css = await chrome.runtime.sendMessage({url: repoCssPath, action: "text"});
                break;
            case githubPageType.User:
                let userCssPath = await getCssPath(url, pageType);
                css = await chrome.runtime.sendMessage({url: userCssPath, action: "text"});
                break;
        }

        console.log(`Fetched CSS from ${url}`);
    } catch (error) {
        console.error(`Failed to fetch CSS: ${error}`);
    }

    return css;
}

async function getMainBranch(owner: string, repo: string): Promise<any> {
    // TODO: We get ratelimited fast here, so we should cache this (possibly)
    // 60 requests limit
    try {
        const data = await chrome.runtime.sendMessage({
            url: `https://api.github.com/repos/${owner}/${repo}`,
            action: "json"
        });

        console.log(`Got main branch of ${owner}/${repo}: ${data.default_branch}`);

        return data.default_branch;
    } catch (error) {
        console.error(`Failed to get main branch: ${error}`);
        return null;
    }
}

async function getCssPath(url: string, pageType: githubPageType): Promise<any> {
    const basePath = `https://raw.githubusercontent.com`;
    const org = new URL(window.location.href).pathname.split("/").filter(segment => segment !== "")[0];
    const repo = new URL(window.location.href).pathname.split("/").filter(segment => segment !== "")[1];
    const user = new URL(window.location.href).pathname.split("/").filter(segment => segment !== "")[0];

    try {
        let cssPath: string | null = null;
        let mainBranch: string | null = null;

        // Getting the main branch is disabled because of rate limiting, check L47-L48
        switch (pageType) {
            case githubPageType.Organization:
                mainBranch = "main" // await getMainBranch(org, ".github");
                cssPath = `${basePath}/${org}/.github/${mainBranch}/.ghcss/org.css`;
                break;
            case githubPageType.Repo:
                mainBranch = "main" // await getMainBranch(user || org, repo);
                cssPath = `${basePath}/${user || org}/${repo}/${mainBranch}/.ghcss/repo.css`;
                break;
            case githubPageType.User:
                mainBranch = "main" // await getMainBranch(user, user);
                cssPath = `${basePath}/${user}/${user}/${mainBranch}/.ghcss/user.css`;
                break;
        }

        console.log(`Got CSS path: ${cssPath}`);
    } catch (error) {
        console.error(`Failed to get CSS path: ${error}`);
        return null;
    }
}

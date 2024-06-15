import { environment } from "../../environment";
import { githubPageType } from "../types/github";

export async function checkForBan(type: githubPageType, actorId: string): Promise<boolean> {
    console.log(`Checking ${type}:${actorId} for ban...`);

    try {
        if (type === githubPageType.User) {
            const isBanned = chrome.runtime.sendMessage({ url: `${environment.ghcss_base_api_uri}/github/user/${actorId}`, action: "json" })
                .then(data => {
                    if (data.isBanned === undefined || !data.isBanned) {
                        console.log(`User ${actorId} is not banned`);
                        return false;
                    }
                });

            return await Promise.resolve(isBanned) || false;
        }

        // TODO: Implement organization and repository ban checking (on the backend as well)

        return false;
    } catch (error) {
        console.error(`Failed to check for ban: ${error}`);
        return false;
    }
}

import { GitHubIssue } from "../types/github";
import { DEVPOOL_OWNER_NAME, DEVPOOL_REPO_NAME, DEVPOOL_TASK_BODY_REGEX } from "./constants";
import { getAllIssues } from "./issue";

/**
 * Retrieve all devpool issues except those that have been opted out.
 */
export async function getAllDevpoolIssues(projectUrls: Set<string>) {
  const devpoolIssues: GitHubIssue[] = await getAllIssues(DEVPOOL_OWNER_NAME, DEVPOOL_REPO_NAME);

  /**
   * This is techinally hacky and we should really delete the issues
   * from the devpool.
   */

  return devpoolIssues
    .filter((issue) => {
      const match = issue.body?.match(DEVPOOL_TASK_BODY_REGEX);
      if (match?.groups) {
        const { owner, repo } = match.groups;

        if (projectUrls.has(`https://github.com/${owner}/${repo}`)) {
          return true;
        }
      }
    })
    .filter((issue) => !!issue);
}

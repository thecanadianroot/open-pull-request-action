import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
    try {
        const token: string | undefined = core.getInput('token', {required: true});
        const base: string | undefined = core.getInput('base', {required: true});
        const head: string | undefined = core.getInput('head', {required: true});
        const title: string | undefined = core.getInput('title', {required: true});
        const body: string | undefined = core.getInput('body', {required: false}) || process.env.BODY;
        const baseSHA: string | undefined = core.getInput('base-sha', {required: false}) || process.env.BASE_SHA;
        const headSHA: string | undefined = core.getInput('head-sha', {required: false}) || process.env.HEAD_SHA;
        const assignees: string[] | undefined = core.getMultilineInput('assignees', {required: false}) || process.env.ASSIGNEES;
        const labels: string[] | undefined = core.getMultilineInput('labels', {required: false}) || process.env.LABELS;
        const reviewers: string[] | undefined = core.getMultilineInput('reviewers', {required: false}) || process.env.REVIEWERS;
        const teamReviewers: string[] | undefined = core.getMultilineInput('team-reviewers', {required: false}) || process.env.TEAM_REVIEWERS;
        const merge: boolean = core.getBooleanInput('merge', {required: false}) || (process.env.MERGE?.toLowerCase() === 'true') || false;
        const mergeMethod: "merge" | "squash" | "rebase" | undefined = (core.getInput('merge-method', {required: false}) || process.env.MERGE_METHOD) as "merge" | "squash" | "rebase" | undefined || 'squash';

        const failOnAddAssigneesFailure: boolean = core.getBooleanInput('fail-on-add-assignees-failure', {required: false}) || (process.env.FAIL_ON_ADD_ASSIGNEES_FAILURE?.toLowerCase() === 'true') || true;
        const failOnAddLabelsFailure: boolean = core.getBooleanInput('fail-on-add-labels-failure', {required: false}) || (process.env.FAIL_ON_ADD_LABELS_FAILURE?.toLowerCase() === 'true') || true;
        const failOnRequestReviewersFailure: boolean = core.getBooleanInput('fail-on-request-reviewers-failure', {required: false}) || (process.env.FAIL_ON_REQUEST_REVIEWERS_FAILURE?.toLowerCase() === 'true') || true;
        const failOnMergeFailure: boolean = core.getBooleanInput('fail-on-merge-failure', {required: false}) || (process.env.FAIL_ON_MERGE_FAILURE?.toLowerCase() === 'true') || true;

        let repo: string = core.getInput('repository', {required: false}) || process.env.REPOSITORY || github.context.repo.repo;
        let owner = core.getInput('owner', {required: false}) || process.env.OWNER || github.context.repo.owner;
        if (repo.includes('/')) {
            let split = repo.split('/');
            owner = split[0];
            repo = split[1];
        }

        if (!token || !base || !head || !title) {
            core.setFailed(`'token', 'base', 'head' and 'title' inputs are required!`);
            return;
        }

        const octokit = github.getOctokit(token);

        async function createBranch(name: string, sha: string | undefined, ref: string) {
            if (sha) {
                const branch = await octokit.rest.git.createRef({
                    owner,
                    repo,
                    ref: `refs/heads/${ref}`,
                    sha
                }).catch((reason) => {
                    throw new Error(`Couldn't create ${name} branch: ${reason}`);
                });
                core.info(`Created ${name} branch '${ref}' from SHA '${sha}': https://github.com/${owner}/${repo}/tree/${ref}`)
                core.setOutput(`${name}-branch`, branch.data);
            }
        }

        await createBranch('base', baseSHA, base);
        await createBranch('head', headSHA, head);

        // Open pull-request from HEAD to BASE
        const pr = await octokit.rest.pulls.create({
            owner,
            repo,
            title,
            body,
            head,
            base
        }).catch((reason) => {
            throw new Error(`Couldn't open pull-request on ${owner}/${repo}: ${reason}`);
        });
        core.info(`Opened pull-request #${pr.data.number}: ${pr.data.html_url}`)
        core.setOutput('pull-request', pr.data);

        // Add assignees to pull-request if any
        if (assignees?.length > 0) {
            await octokit.rest.issues.addAssignees({
                owner,
                repo,
                issue_number: pr.data.number,
                assignees
            }).catch((reason) => {
                const message = `Couldn't add assignees to pull-request #${pr.data.number}: ${reason}`;
                if (failOnAddAssigneesFailure) {
                    throw new Error(message);
                }
                core.warning(message);
            });
            core.info(`Added assignees to pull-request #${pr.data.number}: ${assignees}`);
        }

        // Add labels to pull-request if any.
        if (labels?.length > 0) {
            await octokit.rest.issues.addLabels({
                owner,
                repo,
                issue_number: pr.data.number,
                labels
            }).catch((reason) => {
                const message = `Couldn't add labels to pull-request #${pr.data.number}: ${reason}`;
                if (failOnAddLabelsFailure) {
                    throw new Error(message);
                }
                core.warning(message);
            });
            core.info(`Added labels to pull-request #${pr.data.number}: ${labels}`);
        }

        // Add reviewers to pull-request if any.
        if (reviewers?.length > 0 || teamReviewers?.length > 0) {
            await octokit.rest.pulls.requestReviewers({
                owner,
                repo,
                pull_number: pr.data.number,
                reviewers: reviewers,
                team_reviewers: teamReviewers
            }).catch((reason) => {
                const message = `Couldn't request reviewers for pull-request #${pr.data.number}: ${reason}`;
                if (failOnRequestReviewersFailure) {
                    throw new Error(message);
                }
                core.warning(message);
            });
            core.info(`Added reviewers to pull-request #${pr.data.number}: ${[...reviewers, ...teamReviewers].join(", ")}`)
        }

        // Merge the pull-request if enabled.
        if (merge) {
            const merged = await octokit.rest.pulls.merge({
                owner,
                repo,
                pull_number: pr.data.number,
                merge_method: mergeMethod
            }).catch((reason) => {
                const message = `Couldn't merge pull-request #${pr.data.number} using merge method ${mergeMethod}: ${reason}`;
                if (failOnMergeFailure) {
                    throw new Error(message);
                }
                core.warning(message);
            });
            core.info(`Merged pull-request #${pr.data.number}: https://github.com/${owner}/${repo}/commit/${merged?.data.sha}`);
        }
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message);
    }
}

run()

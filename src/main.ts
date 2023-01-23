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
        const assignees: string[] = core.getMultilineInput('assignees', {required: false}) || process.env.ASSIGNEES;
        const reviewers: string[] = core.getMultilineInput('reviewers', {required: false}) || process.env.REVIEWERS;
        const owner: string = core.getInput('owner') || process.env.OWNER || github.context.repo.owner;
        const repo: string = core.getInput('repository') || process.env.REPOSITORY || github.context.repo.repo;

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
                    core.setFailed(`Couldn't create ${name} branch: ${reason}`);
                    process.exit(1);
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
            core.setFailed(`Couldn't open pull-request: ${reason}`);
            process.exit(1);
        });
        core.info(`Opened pull-request #${pr.data.number}: https://github.com/${owner}/${repo}/pulls/${pr.data.number}`)
        core.setOutput('pull-request', pr.data);

        // Add assignees to pull-request if any
        if (assignees) {
            await octokit.rest.issues.addAssignees({
                owner,
                repo,
                issue_number: pr.data.number,
                assignees
            }).catch((reason) => core.error(`Couldn't add assignees to pull-request #${pr.data.number}: ${reason}`));
        }

        // Add reviewers to pull-request if any.
        if (reviewers) {
            await octokit.rest.pulls.requestReviewers({
                owner,
                repo,
                pull_number: pr.data.number,
                reviewers
            }).catch((reason) => core.error(`Couldn't add reviewers to pull-request #${pr.data.number}: ${reason}`));
        }
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()

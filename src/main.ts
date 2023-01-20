import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
    try {
        const token: string | undefined = core.getInput('token', {required: true});
        const base: string | undefined = core.getInput('base', {required: true});
        const head: string | undefined = core.getInput('head', {required: true});
        const title: string | undefined = core.getInput('title', {required: true});
        const sha: string | undefined = core.getInput('sha', {required: false}) || process.env.SHA;
        const body: string | undefined = core.getInput('body', {required: false}) || process.env.BODY;
        const assignees: string[] = core.getMultilineInput('assignees', {required: false}) || process.env.ASSIGNEES;
        const reviewers: string[] = core.getMultilineInput('reviewers', {required: false}) || process.env.REVIEWERS;
        const owner: string = core.getInput('owner') || process.env.OWNER || github.context.repo.owner;
        const repo: string = core.getInput('repository') || process.env.REPOSITORY || github.context.repo.repo;

        if (!token || !base || !head || !title) {
            core.setFailed(`'token', 'base', 'head' and 'title' inputs are required!`);
            return;
        }

        const octokit = github.getOctokit(token);

        // Create HEAD branch from SHA if any
        if (sha) {
            const branch = await octokit.rest.git.createRef({
                owner,
                repo,
                ref: `refs/heads/${head}`,
                sha
            });
            core.setOutput('branch', branch.data.ref);
        }

        // Open pull-request from HEAD to BASE
        const pr = await octokit.rest.pulls.create({
            owner,
            repo,
            title,
            body,
            head,
            base
        });
        core.setOutput('pull-request', pr.data.number);

        // Add assignees to pull-request if any
        if (assignees) {
            await octokit.rest.issues.addAssignees({
                owner,
                repo,
                issue_number: pr.data.number,
                assignees
            });
        }

        // Add reviewers to pull-request if any.
        if (reviewers) {
            await octokit.rest.pulls.requestReviewers({
                owner,
                repo,
                pull_number: pr.data.number,
                reviewers
            });
        }
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

run()

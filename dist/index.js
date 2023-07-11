require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
var fs = __nccwpck_require__(147);
const files = fs.readdirSync('.github/', { withFileTypes: true });
console.log();
// async function run(): Promise<void> {
//     try {
//         const token: string | undefined = core.getInput('token', {required: true});
//         const base: string | undefined = core.getInput('base', {required: true});
//         const head: string | undefined = core.getInput('head', {required: true});
//         const title: string | undefined = core.getInput('title', {required: true});
//         const body: string | undefined = core.getInput('body', {required: false}) || process.env.BODY;
//         const baseSHA: string | undefined = core.getInput('base-sha', {required: false}) || process.env.BASE_SHA;
//         const headSHA: string | undefined = core.getInput('head-sha', {required: false}) || process.env.HEAD_SHA;
//         const assignees: string[] | undefined = core.getMultilineInput('assignees', {required: false}) || process.env.ASSIGNEES;
//         const labels: string[] | undefined = core.getMultilineInput('labels', {required: false}) || process.env.LABELS;
//         const reviewers: string[] | undefined = core.getMultilineInput('reviewers', {required: false}) || process.env.REVIEWERS;
//         const teamReviewers: string[] | undefined = core.getMultilineInput('team-reviewers', {required: false}) || process.env.TEAM_REVIEWERS;
//         const merge: boolean = core.getBooleanInput('merge', {required: false}) || false;
//         let repo: string = core.getInput('repository', {required: false}) || process.env.REPOSITORY || github.context.repo.repo;
//         let owner = core.getInput('owner', {required: false}) || process.env.OWNER || github.context.repo.owner;
//         if (repo.includes('/')){
//             let split = repo.split('/');
//             owner = split[0];
//             repo = split[1];
//         }
//
//         if (!token || !base || !head || !title) {
//             core.setFailed(`'token', 'base', 'head' and 'title' inputs are required!`);
//             return;
//         }
//
//         const octokit = github.getOctokit(token);
//
//         async function createBranch(name: string, sha: string | undefined, ref: string) {
//             if (sha) {
//                 const branch = await octokit.rest.git.createRef({
//                     owner,
//                     repo,
//                     ref: `refs/heads/${ref}`,
//                     sha
//                 }).catch((reason) => {
//                     core.setFailed(`Couldn't create ${name} branch: ${reason}`);
//                     process.exit(1);
//                 });
//                 core.info(`Created ${name} branch '${ref}' from SHA '${sha}': https://github.com/${owner}/${repo}/tree/${ref}`)
//                 core.setOutput(`${name}-branch`, branch.data);
//             }
//         }
//
//         await createBranch('base', baseSHA, base);
//         await createBranch('head', headSHA, head);
//
//         // Open pull-request from HEAD to BASE
//         const pr = await octokit.rest.pulls.create({
//             owner,
//             repo,
//             title,
//             body,
//             head,
//             base
//         }).catch((reason) => {
//             core.setFailed(`Couldn't open pull-request on ${owner}/${repo}: ${reason}`);
//             process.exit(1);
//         });
//         core.info(`Opened pull-request #${pr.data.number}: ${pr.data.html_url}`)
//         core.setOutput('pull-request', pr.data);
//
//         // Add assignees to pull-request if any
//         if (assignees?.length > 0) {
//             await octokit.rest.issues.addAssignees({
//                 owner,
//                 repo,
//                 issue_number: pr.data.number,
//                 assignees
//             }).catch((reason) => core.error(`Couldn't add assignees to pull-request #${pr.data.number}: ${reason}`));
//         }
//
//         // Add labels to pull-request if any.
//         if (labels?.length > 0){
//             await octokit.rest.issues.addLabels({
//                 owner,
//                 repo,
//                 issue_number: pr.data.number,
//                 labels
//             })
//         }
//
//         // Add reviewers to pull-request if any.
//         if (reviewers?.length > 0 || teamReviewers?.length > 0) {
//             await octokit.rest.pulls.requestReviewers({
//                 owner,
//                 repo,
//                 pull_number: pr.data.number,
//                 reviewers: reviewers,
//                 team_reviewers: teamReviewers
//             }).catch((reason) => core.error(`Couldn't request reviewers for pull-request #${pr.data.number}: ${reason}`));
//         }
//         if (merge) {
//             await octokit.rest.pulls.merge({
//                 owner,
//                 repo,
//                 pull_number: pr.data.number
//             })
//         }
//     } catch (error) {
//         if (error instanceof Error) core.setFailed(error.message)
//     }
// }
//
// run()

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map
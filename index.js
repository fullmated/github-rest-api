import {Octokit} from "@octokit/rest";
import {sentence} from "@ndaidong/txtgen";

const pat = process.env.PAT;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const branch = process.env.BRANCH;

const octokit = new Octokit({
    auth: pat
})

for (let i = 0; i < 5; i++) {
    const content = sentence();
    const encodedContent = Buffer.from(content).toString('base64');
    const path = `test${i}.txt`;

    await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
        owner: owner,
        repo: repo,
        path: path,
        branch: branch,
        message: `add ${path}`,
        committer: {
            name: 'test',
            email: 'no-reply@github.com'
        },
        content: encodedContent,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
}
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

    const getRes = await octokit.request(`GET /repos/${owner}/${repo}/contents/${path}`, {
        owner: owner,
        repo: repo,
        path: path,
        ref: branch,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    const putReq = {
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
    }
    if (getRes.status === 200) {
        console.log(`${path} exists`);
        putReq.sha = getRes.data.sha;
        putReq.message = `update ${path}`;
    } else {
        console.log(`${path} does not exist`);
    }

    await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, putReq);
}
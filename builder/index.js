const fs = require('node:fs');
const repos = require('./repos.json');

const BASE_URL = 'https://raw.githubusercontent.com';
const OUTPUT_URL = '/../repo.json';

const getRepoFile = async ({ repo }) => {
  const url = `${BASE_URL}/${repo}/main/repo.json`;
  console.log(`Downloading [${url}]`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to retrieve repo "${repo}"! ${response.status} - ${response.statusText}`)
  }

  return response.json();
}

(async () => {
  const pluginManifests = [];
  console.log(`Updating ${repos.length} repos!`);

  for (const repo of repos)  {
    const repoFile = await getRepoFile({ repo });
    pluginManifests.push(repoFile[0]);
  }

  console.log(`Writing ${pluginManifests.length} manifests to repo.json`);
  fs.writeFileSync(__dirname + OUTPUT_URL, JSON.stringify(pluginManifests, null, 2));

  console.log('Done!');
})().catch(console.error);
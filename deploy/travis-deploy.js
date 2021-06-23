// To try or share a feature not ready to merge into dev
// change this to be the branch with the feature.
// After the tests pass in CI, it will deploy to
// app-experiment.staging.thebrane.com.
// Note: This should always be changed back to "none"
// before merging into the "dev" branch
const EXPERIMENT_BRANCH = ''

// Exports the correct deployment config to run on travis
const sh = require('shelljs')
const pullRequest = process.env.TRAVIS_PULL_REQUEST !== 'false'
const branch = process.env.TRAVIS_BRANCH
const path = require('path')

sh.set('-e')

if (pullRequest) {
  console.log('Is a pull request. Not deploying.')
  process.exit(0)
}

const username = process.env.GITLAB_USERNAME
const password = process.env.GITLAB_PASSWORD

sh.cd(__dirname)
sh.exec(`git clone https://${username}:${password}@gitlab.com/TheBrane/api/deploy.git ./deploy-repo`)
sh.cd('deploy-repo')

// TODO: once https://gitlab.com/TheBrane/api/deploy/-/merge_requests/6 is merged
// this if statement should be added back
// if (branch === 'dev') {
sh.exec('git checkout dev')
// }

sh.exec('npm ci')
sh.cp(path.resolve(__dirname, 'deploy-config.json'), './config.json')

sh.cd('mup-configs')

if (branch === 'master' || branch === 'first-users-prod') {
  console.log(`Deploying to production`)
  sh.exec(`node run-mup -e production --app client deploy`)
} else if (branch === 'dev') {
  console.log('Deploying to staging')

  sh.exec('node run-mup -e staging --app client deploy')
} else if (branch === EXPERIMENT_BRANCH) {
  sh.exec('node run-mup -e staging --app client-experiment deploy')
} else {
  console.log('Deployment not setup for this branch')
  process.exit(0)
}

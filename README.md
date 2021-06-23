# The Brane Web Client

## Quick Start

1. Clone the repo with `git clone https://github.com/miherb/thebrane-web-client.git`.
2. Run `npm install` to install the dependencies.
3. Run `npm run dev` to start local development server.

Requires Node 8 and npm 5.10 or newer. 

## Api Endpoints

In development, certain graphs will use the local topics instance, and all other graphs will default to using staging. The local graphs are defined in the `config.js` file and currently are:

- sandbox
- dev

These two graphs are also handled specially in the topics api in development to avoid needing to also run the users api.

The graph that is used is defined in the url:
```
http://localhost:3000/graph/<graph name>

// Uses topics api running locally
http://localhost:3000/graph/dev

// Uses staging api
http://localhost:3000/graph/nasa
```

The endpoints can also be set with env vars:

- BRANE_TOPICS_API
- BRANE_CONTENTS_API
- USERS_API

Or by modifying the `config.js` file.

The contents api is currently not needed for the front end to work. If you want the accounts feature disabled while developing, you can disable the `account` feature flag in `app/utils/features.js`

## Inject Data

Parts of the fixed path expect certain data to be available on page load. For example, the root node, the list of tags in the graph, the graph's background, and the base url for each api. This is handled by the injectData middleware on the client's server.

Since the client's server is in the same data center as the api, it is able to load data needed for the initial render faster than if the client requested it after the js loaded. Caching is used so the response only waits the first time for each graph. Afterwards, it will always use the cached result when sending a response, and refresh the cache in the background.

### PreCache API

We have a newer middleware called `precacheAPI`. It makes calls on the server to the API when loading the client, and injects the results in the the page's HTML. The client then makes the same api calls, but the axios middleware returns the cached result for matching requests.

This has the same performance benefit if used for requests that are needed for the initial render, but also makes the cache optional since the client can fall back to making the request to the API. Compared to Inject Data, this is able to safely cache data that differs between users.

Since the fixed path hasn't been updated to support loading data async, `precacheAPI` hasn't replaced injectData.

## Development Workflow

We follow [git flow](https://nvie.com/posts/a-successful-git-branching-model/). This means:

1) Create a feature or fix branch off of `dev`
2) Once it is ready, create a PR to merge it into `dev`
3) Once someone has reviewed the code, it can be merged
4) When a release is ready, create a PR to merge the dev branch into the master branch. Since all of the code has been already reviewed, you can go ahead and marge it after you have made sure [Staging](https://staging.thebrane.com) works correctly.

You should not push directly to the `dev` or `master` branches.

We use [Story Book](https://storybook.js.org) to:

- simplify developing components
- document reusable components and component states
- test for visual regressions

At the very least, any reusable components you create should have a story. You probably will find that using storybook to initially develop the components is simpler than developing them as part of the app.

The tests take a screenshot of each story and compares it to a screenshot previously taken. Screenshots for new stories are automatically saved. To update screenshots for existing stories, run `npm run test:only -- -u`. Please make sure that only screenshots you expected to change did.

## Tests

We use [Jest](https://jestjs.io/) to run our tests. It runs the tests in node with jsdom.

jsdom is missing support for most of svg, so tests that rely on creating or modifying svg elements might need to have stubs added. For example, the Fixed Path uses svg elements to calculate text width and decide how to wrap text, which does not work with jsdom. To test this type of functionality, instead use visual regression tests by creating stories that show the correct behavior.

The visual regression tests are also run by jest. To update the snapshots, run `npm run test:only -- -u`

To run the tests:

1) First start storybook with `npm run storybook`
2) After storybook starts, run `npm test` in a separate terminal

## Code Editor

If you open The Brane client in [Visual Studio Code](https://code.visualstudio.com/), there are some extensions recommended by the workspace. To install them,

1) Open the extensions sidebar
2) Type `@recommended` in the search bar
3) Install the extensions under `Workspace Recommendations`

The `vscode-styled-components` extension will apply css syntax highlighting and autocompletion to styled components. The other extensions help with formatting and linting the code.

## Features Toggles

Feature toggles are defined in `app/utils/features`, and used to disable unfinished features in production when the `DISABLE_INCOMPLETE` environment variable is set to `true`.

## Deploy

Deploys are normally handled automatically on Travis CI. Commits pushed to the dev branch are automatically deployed to [Staging](https://app.staging.thebrane.com), and commits on master are deployed to [production](https://app.thebrane.com).

### Implementation

The front end is deployed to a vps on Vultr using [Meteor Up](http://meteor-up.com/) and the [mup-node](https://github.com/zodern/mup-node) plugin. Meteor Up handles setting up the server, SSL, dockerizing the app, and deploying it.

The mup configs are in the `deploy` repository.

`travis-deploy.js` is run on Travis CI after all tests have passed. It picks the correct mup config(s) based on the branch name and deploys.

### Manual Deploy

TODO: this section is outdated. Instructions in the `deploy` repository should be used.

1) Set the `DEPLOY_HOST` environment variable with the server's ip address
2) Set the `DEPLOY_SSH_PASS` environment variable with the server's root pasword. This is accessible from the vultr website.
3) If you modified the config, run `mup setup --config <config page>`
4) To deploy, run `mup deploy --config <config path>`
5) To view logs, run `mup logs --config <config path> --tail 200`

## Boilerplate documentation

- [Intro](docs/general): What's included and why
- [**Commands**](docs/general/commands.md): Getting the most out of this boilerplate
- [Testing](docs/testing): How to work with the built-in test harness
- [Styling](docs/css): How to work with the CSS tooling
- [Your app](docs/js): Supercharging your app with Routing, Redux, simple
  asynchronicity helpers, etc.

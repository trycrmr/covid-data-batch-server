# COVID-19 batch server
Originally forked from [ncov2019.live](https://ncov2019.live/) before that repo went private. This codebase is a refactored codebase of that to not serve web pages, but just update the a COVID-19 data source at a certain interval and save it somewhere. 

## Install / Code-contributions
1. Fork the repo (click the button in the top right your Github interface)
2. Clone the repo (SSH: `git clone git@github.com:trycrmr/covid-data-batch-server.git` or HTTPS: `git clone https://github.com/trycrmr/covid-data-batch-server.git`)
3. Add git@github.com:trycrmr/covid-data-batch-server.git as an upstream repo (`git remote add upstream https://github.com/trycrmr/covid-data-batch-server.git`)
4. [Download and install Node.js](https://nodejs.org/en/download/), and `npm ci` to install the dependencies. Run `node index.js` to execute the batch job.
5. Create a new branch named on your forked repo with the following convention: "[issue-number][1-3 words summarizing the issue]" (Example: "19-new-covid-vaccine"). If an issue doesn't exist, open one, reference it, and start working on it. 
6. Open all PRs into master of the upstream repo. Must maintain feature & performance parity. No PRs that vary from the branch naming convention or have merge conflicts with master will be accepted as well.
7. Your PR will be reviewed shortly. In the meantime, repeat steps #5 & #6! 


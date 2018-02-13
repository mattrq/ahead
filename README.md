# AHead

[![Greenkeeper badge](https://badges.greenkeeper.io/mrosenquist/ahead.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/mrosenquist/ahead.svg?branch=master)](https://travis-ci.org/mrosenquist/ahead)
[![Known Vulnerabilities](https://snyk.io/test/github/mrosenquist/ahead/badge.svg?targetFile=package.json)](https://snyk.io/test/github/mrosenquist/ahead?targetFile=package.json)
[![Build Status](https://travis-ci.org/mrosenquist/ahead.svg?branch=master)](https://travis-ci.org/mrosenquist/ahead)
[![Quality Gate](https://sonarcloud.io/api/badges/gate?key=ahead)](https://sonarcloud.io/dashboard?id=ahead)
[![SonarCloud Coverage](https://sonarcloud.io/api/badges/measure?key=ahead&metric=coverage)](https://sonarcloud.io/component_measures/metric/coverage/list?id=ahead)
[![SonarCloud Bugs](https://sonarcloud.io/api/badges/measure?key=ahead&metric=bugs)](https://sonarcloud.io/component_measures/metric/reliability_rating/list?id=ahead)
[![SonarCloud Vulnerabilities](https://sonarcloud.io/api/badges/measure?key=ahead&metric=vulnerabilities)](https://sonarcloud.io/component_measures/metric/security_rating/list?id=ahead)
[![Code smells](https://sonarcloud.io/api/badges/measure?key=ahead&metric=code_smells)](https://sonarcloud.io/component_measures?id=ahead&metric=code_smells)
[![Technical debt](https://sonarcloud.io/api/badges/measure?key=ahead&metric=sqale_index)](https://sonarcloud.io/component_measures?id=ahead&metric=sqale_index)

Command line tool to scan security header. Aims to be a CLI equivalent to securityheaders.io

### Docs
[Developent](docs/development.md)



### Attribution:
**The ideas and default rules set**
 * [securityheaders.io](https://securityheaders.io/)
 * [Scott Helem - Scoring for secuirtyheaders.id](https://scotthelme.co.uk/scoring-transparency-on-securityheaders-io/)
 * [Scott Helem - Articals for secuirtyheaders.id](https://scotthelme.co.uk/tag/securityheaders-io/)
 
**Implementation for a rule bases node cil test tool have been borrowed from eslint**
 * [ESLint](https://eslint.org/)
 * [ESLint - Github](https://github.com/eslint/eslint)

### Todo / Ideas:
 - [ ] Make config extensible
 - [ ] CSP check for 'unsafe'
 - [ ] HSTS check for 'max < 1year'
 - [ ] HSTS check preload
 - [ ] HSTS check for subdomain
 - [ ] Server contains bad value
 - [ ] Examples of using tool with express and supertest
 - [ ] Add integration tests
 - [ ] Update output to match formatter
 - [ ] Push built package to NPM
 - [ ] Vary header not set
 
# Open pull-request action

This action simply opens a pull-request with the specified inputs.

## Usage

```yaml
- name: Open pull-request
  uses: 'thecanadianroot/open-pull-request-action@main'
  with:
    # The GitHub access token. Uses 'github.token' by default. Type: string
    token:  
    
    # The base branch for the pull-request. Required. Type: string
    base: 
    
    # The SHA from which the base branch should be created if this input is used. Optional, but the base branch must already exist. Type: string
    base-sha:
    
    # The head branch for the pull-request. Required. Type: string
    head: 
    
    # The SHA from which the head branch should be created if this input is used. Optional, but the head branch must already exist. Type: string
    head-sha:
    
    # The pull-request title. Required. Type: string
    title: 
    
    # The pull-request body. Optional. Type: string
    body: 
    
    # The pull-request assignees. Optional. Type: array
    assignees:

    # The pull-request labels. Optional. Type: array
    labels:
    
    # The pull-request reviewers (Use this for specific users). Optional. Type: array
    reviewers:

    # The pull-request team reviewers (Use this for organization teams). Optional. Type: array
    team-reviewers:
    
    # Merge the pull-request? Uses false by default. Type: boolean 
    merge: 
    
    # The merge method of the pull-request (choices: merge, squash, rebase). Uses 'squash' method if merge is set to true. Optional. Type: string
    merge-method: 
    
    # The repository owner. Uses current repository owner if not specified. Type: string
    owner:
    
    # The repository name (can be either 'organization/repository' or 'repository' format). Uses current repository name if not specified. Type: string
    repository: 
```

## Outputs

| Output         | Expected values                                                                                                 | Conditions                                      |
|----------------|-----------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `base-branch`  | See [Example response](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#create-a-reference)       | Output will exist if a base branch was created  |
| `head-branch`  | See [Example response](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#create-a-reference)       | Output will exist if an head branch was created |
| `pull-request` | See [Example response](https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#create-a-pull-request) | Always present                                  |


## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:  
```bash
$ npm test
```

## Usage:


# Getting Started

## Setting up the repository locally
The first step to getting started on development, is to clone this github repository.

First, you need to have `git` installed. You can check this by running the command:

```
git --version
```
You should see something along the lines:

```
git version X.XX.X
```

If you see this, then you have installed git. Otherwise, please follow the instructions at the [git page](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

The next step is to make sure you SSH setup with your github account. If you don't, you can add a new public SSH key [here](https://github.com/settings/ssh/new). To generate an SSH key locally, follow the instructions outlined [here](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). 

We recommend you leave all the options empty. 

The next step is to add the generated key to the ssh-agent.

## Cloning the Reposity
We recommend you save the cloned respository to your Documents folder. For example, to get to this folder, just run the command as below:

```
cd ~/Documents/Other/College\ Craft\website
```

Once you've cloned the repository, you're ready to go!

## Making Changes to the Static Website
The static website lives in the `gh-pages` branch of the repository. So in order to make changes to the site, you need to first checkout this branch.

Do this by running the following command:
```
git checkout gh-branches
```

To get any updates on the site, also run the `pull` command:
```
git pull
```

This will update your local branch with any changes made by others on github.

Now simply make any edits you wish to make. To save your changes into your local git.

First, before committing, check the status of the repository using:
```
git status
```
Make sure everything there looks like you expect it to look, and there are no unnecessary changes.

Next, if adding new files, run:
```
git add .
```

Once you've done that, commit your changes:
```
git commit -am "<your message here>"
```

## Publish The Site
The first step to publishing is to merge remote changes. Do this by running:
```
git pull
```

Please resolve any merge conflicts that might arise.

Once done, just push your changes by running:

```
git push
```



# Static Site Publishing

The `main` branch contains our future website, based on React.

The current site is static, and is hosted on GitHub pages, with the URL `collegecraft.ml` redirecting to the appropriate page.



# Development of Calculator
This calculator lives under the `calculator` directory.

Run
```
npm install
```

This should install all the required dependencies. If this is a fresh pull from the directory, you'll also need to provide a few keys. At the top-level (eg, same location as `package.json`), add a file called `.env` which defines the following environment variables:

```
REACT_APP_SCORECARD_APIKEY=<TODO>
```
where the above corresponds to your College ScoreCard API Key.

Then simply run:

```
npm start
```

To get started. See the `package.json` file for other available commands.

## Publishing Calculator to Site

The `index.html` files in the top-level has a link to the calculator. To update it, simply run:

```
npm run build
```

From within the `/calculator` directory. This will update the `/calculator/build` directory, which is linked to from the root `index.html`. 
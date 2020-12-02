# Development
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

To get started. See the `package.json` file for other available types.
# API for serving translation game quizes

## Usage

### Environment setup

In order tu successfully use the api, add your own set of environment variables into `.env` file. Check `.env-example` to get started.

### Docker

App is containerized, so the best course of action is to spin up a docker container by running

`docker-compose up`

In order to toy with the api, you will need `service-account-credentials.json` with read access to [google sheets api](https://developers.google.com/sheets/api) placed inside of the root level of the project

## Import translations from google sheet

Run the following command in your terminal:

`docker exec --interactive node-server npx ts-node src/cli/sheets.ts`

## API endpoints

### v1

Get all translations

GET `/v1/translations`

```typescript
[
    {
        baseLanguageValue: string,
        translationValue: string
    }
]
```


Get random translations

GET `/v1/random-translation`

```typescript
{
    baseLanguageValue: string,
    translationValue: string
}
```

## Running tests

Add `.env-test` file with similar set of variables as in your `.env` file. Check `.env-example` for further reference.

Run `docker-compose -f docker-compose-test.yaml up --abort-on-container-exit --exit-code-from=node-test-app` cli command to run tests in test docker container.




# API for serving translation game quizes

## Usage

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




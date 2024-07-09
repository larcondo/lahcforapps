# lahcforapps
LA Healthchecker for apps.

## Start app

```
npm start
```

## Run in development mode
```
npm run dev
```

## Routes

|Route          |Description                      |
|:------        |:-------                         |
|`/status`      |Show status object               |
|`/logs`        |Show low array (sort descending) |
|`/toggle-log`  |Toggle logs (Disable/Enable)     |

## Vercel config

`vercel.json` :
```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

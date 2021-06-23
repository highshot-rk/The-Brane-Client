## API

The api uses axios.

### Caching

1) The server can use `precacheApi` to inject api responses in the html for api requests the app will make while loading
2) GET requests are automatically cached for 24 hours using indexdb
3) Passing the `braneCacheTTL` to axios will change how many milliseconds the request is cached
4) Stale items from the cache can be removed using the `removeStaleDocument` function

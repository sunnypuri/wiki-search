
### Reference to install Redis
https://redis.io/docs/install/install-redis/install-redis-on-mac-os/

> [Option 1]
### Run with existing dist/build folders

```
Run below commands at root directory
yarn install
yarn start
```


> [Option 2]
### Run with new build

```
cd client
yarn install
yarn build
cd ..client
yarn start
```

### Features

- Added Express for backend API
- Added React for client UI
- Helmet for adding security
- Redis for caching APIs and maintaning History
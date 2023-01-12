## Getting Started

### Development
From your terminal:
```
npm run dev
```
This starts your app in development mode, rebuilding assets on file changes.

### Deployment

Build an image from a Dockerfile
```
docker build -t clear-script:prod .
```

Run a command in a new container
```
docker run -it --rm -p 3000:3000 clear-script:prod
```
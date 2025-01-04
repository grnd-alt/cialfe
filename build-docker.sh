#!/bin/sh

# Build the Docker image
docker build -t cialfe .

# Create and run the container
docker container create --name cialfecont cialfe:latest

# Copy the /app/dist folder from the container to the local directory
docker cp cialfecont:/app/dist ./dist

docker rm cialfecont

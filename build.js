#!/bin/bash

sculpin generate --env=prod
docker build -t static_blog .

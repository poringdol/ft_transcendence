#!/bin/sh
docker cp alpine_rails_1:/pingpong/ ./
sudo cp -rf pingpong/* alpine/rails/files/
sudo rm -rf pingpong

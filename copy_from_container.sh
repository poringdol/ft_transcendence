#!/bin/sh
docker cp srcs_rails_1:/pingpong/ ./
sudo cp -rf pingpong/* srcs/rails/files/
sudo rm -rf pingpong

# docker cp alpine_rails_1:/pingpong/ ./srcs/rails/files
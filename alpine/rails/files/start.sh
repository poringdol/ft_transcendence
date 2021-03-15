#!/bin/sh

rm -rf tmp/pids/server.pid
bin/rails db:migrate RAILS_ENV=development
bin/rails server -b 0.0.0.0

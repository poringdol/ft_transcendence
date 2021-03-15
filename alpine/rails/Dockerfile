FROM ruby:2.7.2-alpine3.13

#install requariments
RUN apk update && apk upgrade
RUN apk add build-base libpq postgresql-dev tzdata npm git

#install yarn
RUN apk add yarn

#install rails
RUN gem install rails
RUN gem install bundler
RUN gem update bundler

#setup
WORKDIR /pingpong
COPY ./files /pingpong
RUN bundle install
RUN yarn install --check-files
RUN yarn add jquery backbone underscore bootstrap
RUN chmod +x start.sh

ENTRYPOINT ["/pingpong/start.sh"]

FROM ruby:2.7.2-alpine3.13

#install requariments
RUN apk update && \
	apk upgrade && \
	apk add build-base \
			git \
			libpq \
			npm \
			postgresql-dev \
			tzdata \
			yarn \
	&& rm -rf /var/lib/apt/lists/*

#install rails
RUN gem install rails && \
	gem install bundler && \
	gem update bundler

#setup
WORKDIR /pingpong
COPY ./files /pingpong
RUN bundle update && \
	bundle install && \
	yarn install --check-files && \
	yarn add jquery \ 
			 backbone \ 
			 underscore \
			 bootstrap@next \
			 @popperjs/core

RUN chmod +x start.sh

ENTRYPOINT ["/pingpong/start.sh"]

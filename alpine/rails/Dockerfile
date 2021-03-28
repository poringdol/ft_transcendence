FROM ruby:2.7.2-alpine3.12

# install requirements
RUN apk update && \
	apk upgrade && \
	apk add build-base \
			git \
			libpq \
			npm \
			postgresql-dev \
			tzdata \
			yarn \
			ruby-dev \
			shared-mime-info \
			pkgconfig imagemagick6 imagemagick6-dev imagemagick6-libs &&\
	apk --update add imagemagick &&\
	rm -rf /var/lib/apt/lists/*

# install rails
RUN gem update --system && \
	gem install rails && \
	gem install bundler && \
	gem update bundler

# setup
WORKDIR /pingpong
COPY ./files /pingpong
RUN bundle update mimemagic && \
	bundle update && \
	bundle install && \
	yarn install --check-files && \
	yarn add jquery \
			 backbone \
			 underscore \
			 bootstrap@next \
			 @popperjs/core

COPY ./sanitized_file.rb ../usr/local/bundle/gems/carrierwave-2.2.0/lib/carrierwave/sanitized_file.rb

RUN chmod +x start.sh

ENTRYPOINT ["/pingpong/start.sh"]

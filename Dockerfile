FROM ruby:2.2.3

WORKDIR /usr/src/app
ENV SERVICE_NAME=ruby:2.2.3 \
    HOME=/root \
    CONTAINER_PS1="[ $(get_container_ip) | \[\e[0;36m\]$(get_container_service)\[\e[m\] | \[\e[0;35m\]\w\[\e[m\] ]\n\[\e[1;31m\]>\[\e[m\] "
COPY .docker/.bashrc   $HOME/


# Install PhantomJS
ENV PHANTOMJS_VERSION=2.1.1
ARG PHANTOMJS_FOLDER="phantomjs-$PHANTOMJS_VERSION-linux-x86_64"
RUN curl -sLOS https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOMJS_FOLDER.tar.bz2 \
    && tar xvjf $PHANTOMJS_FOLDER.tar.bz2 \
    && mv $PHANTOMJS_FOLDER/bin/phantomjs /usr/local/bin \
    && rm -rf $PHANTOMJS_FOLDER


COPY .docker/bootstrap  /bin

EXPOSE 3000

CMD ["bash"]

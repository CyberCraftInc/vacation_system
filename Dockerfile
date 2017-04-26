FROM eleidan/ruby:2.2.3-jessie

WORKDIR $HOME/app

# Install PhantomJS
ENV PHANTOMJS_VERSION=2.1.1
ARG PHANTOMJS_FOLDER="phantomjs-$PHANTOMJS_VERSION-linux-x86_64"
ARG PHANTOMJS_DOWNLOAD_URL=https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOMJS_FOLDER.tar.bz2
RUN curl -sLOf $PHANTOMJS_DOWNLOAD_URL \
    && tar xvjf $PHANTOMJS_FOLDER.tar.bz2 \
    && mv $PHANTOMJS_FOLDER/bin/phantomjs /usr/local/bin \
    && rm $PHANTOMJS_FOLDER.tar.bz2 \
    && rm -rf $PHANTOMJS_FOLDER

EXPOSE 3000

USER root

CMD ["/bin/bash"]

#   Vacation Management System for CyberCraft Inc.

##  Installation
The project is powered by **Ruby**, **Node.js**, **Ruby on Rails**, **Backbone**, and **MySQL**.


### Ruby and RVM
1.  Install RVM.

    Follow instructions on https://rvm.io/.

2.  Install Ruby with the following command:
    ```
    rvm install 2.2.3
    rvm --default use 2.2.3
    ```

3.  Install **bundler** with the following command:
    ```
    gem install bundler
    ```
    For details see http://bundler.io.


### Project Sources
1.  Clone the project repository.

2.  Open the project directory.


### Node.js
Currently **Node.js** 4.x is proven to be sufficient.

For details on how to install **Node.js** see https://nodejs.org.


### MySQL
1.  Install **MySQL** related components with the following command:
    ```
    sudo apt-get install mysql-server mysql-client libmysqlclient-dev
    ```

### PhantomJS
1.  Install PhantomJS from [PPA](https://launchpad.net/~tanguy-patte/+archive/ubuntu/phantomjs)
    ```
    sudo apt-add-repository ppa:tanguy-patte/phantomjs
    sudo apt-get update
    sudo apt-get install phantomjs
    ```


### Resolve Project Dependencies
1.  Install the project related dependencies:
    ```
    bundle install
    ```
    In the command above failed, something like the following may be needed:
    ```
    bundle update <gem>
    ```
    Substitute `<gem>` with particular gem name.

### Configuration
1.  Generate secret token:
    ```
    echo SECRET_KEY_BASE=`rake secret` > .env
    ```

2.  Add DB related credentials:
    ```
    echo DATABASE_USER=user >> .env
    echo DATABASE_PASS=pass >> .env
    ```
    Replace `user` and `pass` with appropriate values.

2.  Add action mailer related credentials:
    ```
    echo EMAIL_USER=user >> .env
    echo EMAIL_PASS=pass >> .env
    ```
    Replace `user` and `pass` with appropriate values.

3.  Create DB with the following command:
    ```
    bundle exec rake db:create
    bundle exec rake db:migrate
    bundle exec rake db:seed
    ```

##  Deployment
The application server is to be hosted on **Heroku**.

### Prerequisites
1.  The Ruby version must be `2.2.3`.
    For the list of supported Ruby versions see appropriate **Heroku**
    [documentation](https://devcenter.heroku.com/articles/ruby-support#ruby-versions).

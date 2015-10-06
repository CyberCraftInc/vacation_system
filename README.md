#   Vacation Management System for CyberCraft Inc.

##  Install
The project is powered by **Ruby**, **Node.js**, **Ruby on Rails**, **Backbone**, and **MySQL**.


### Ruby and RVM
1.  Install RVM.

    Follow instructions on https://rvm.io/.

2.  Install Ruby with the following command:
    ```
    rvm install 2.2.1
    rvm --default use 2.2.1
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
    bundle update devise
    ```

### Configuration
1.  Create the following file from the project's directory:
    ```
    touch config/secrets.yml
    ```

2.  the file must specify MySQL credentials, as follows
    ```yaml
    development:
      secret_key_base: <secret_key>
      database:
        username: <user>
        password: <pass>
    test:
      secret_key_base: <secret_key>
      database:
        username: <user>
        password: <pass>
    ```
    Replace `<user>` and `<pass>` with user name and password respectively.
    Replace `<secret_key>` with Devise related secret key.

3.  Create DB with the following command:
    ```
    bundle exec rake db:create
    bundle exec rake db:migrate
    bundle exec rake db:seed
    ```

Node Todo
===========

A little todo app


Description
---------------
John Duff (http://github.com/jduff) started writing his own todo app using Rails 3. 
I decided to see how hard it would be to do the same using nodejs and express.

It's a work in progress

Much thanks to John for giving me the css and fiddly bits so I could get going!


Requirements
-------------------

 * node.js 
 * mongodb (soon!)


Installation
--------------

    git clone git://github.com/glongman/node-todo.git
    cd node-todo

    # Update submodules
    git submodule update --init --recursive

    # Copy the default configuration file and edit as you please.
    cp config/app_config.js.sample config/app_config.js
    
Edit config/app_config.js adding a random session secret.

I have not found a nice way to do this yet. Currently I run the following ruby script
and paste the output into the file. You need ruby, rubygems, and the activesupport gem installed. I used version 2.3.5 of activesupport.
    
    ruby -e "require 'rubygems';require 'active_support'; puts ActiveSupport::SecureRandom.hex(30)"

Running Node Todo
------------------------------

To start the server, run the following:

    node start.js


Tests
--------

    coming soon.


License
-------

Node Todo is licensed under the MIT License. (See the LICENSE file)

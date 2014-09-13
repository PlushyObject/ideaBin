IdeaBin is intended to be a platform to better enable people to 
easily collaborate with others while maintaining project versions
allowing idea owners to retain control over their projects using 
the Git versioning sysem, as well as allowing them to approve and 
undo changes submitted by collaborators. 


Stack:
	Rails 4.1.5
	Ruby 2.1.2
	AngularJS
	PostGreSql

Getting Started:

	In order to get started you'll need Ruby2.1.2 as well as Rails 4.1.5 installed. You can find documentation on installing these and getting started with Ruby on Rails at rubyonrails.org. This project also relies on PostGreSQL, and the database file currently relies on the default user with an empty password.

Once installed you should be able to clone this repo and fire up a rails server to see it working. 

Overview:

	In ideaBin everything focuses on the management of and contribution to ideas, so naturally an idea is the focal point
of the code and the app in general. Currently the code is quite simple
and consists of just ideas and users. Whenever an idea is created, 
we take the liberty of generating a folder in /public/data/repository/:user_id as well as initializing a new git repository. When users upload changes to the project by simply dragging and dropping either a new file or one they downloaded and edited, ideaBin then does 1 of 2 things. 
	1) If you are the user that created the idea then the upload is performed and changes are simultaneously committed to the repository so you don't have to worry about it. 
	2) If you aren't the user that created the idea then the original repository is cloned and placed in the users repository folder at /public/data/repository/:user_id. The system then takes the uploaded file and places it in the folder as well as committing the changes. 
	When finished ideaBin will be a fully open source platform that you can contribute to through the platform as well as managing your own projects through an intuitive User interface and integrated code editors, image editors, diagramming tools and other things that teams tend to need when collaborating on a project. There is certainly lots to do, so feel free to help out if that's something you'd be in to. 	

Contribute:

	There's no shortage of things that need to be done on this project. If you are interested in contributing there are a number of things you can do. There is currently no log of bugs, but if you find one I'd love to know about it. You can also find features or whatnot that need to be fixed in the issues section of github.  Any and all help, criticism or even donations are very much appreciated. 

Donate:

	If you'd like to help keep my fridge full of beer and/or see
my work on this progress you can send bitcoins to 1DZ1om2PgLMmJp8CqRwnacuGNpdGhGHhBu



meteor-hangs
============

This small application that shows a possible bug/issue with `meteor/WebApp/send` that simply serves files from the `.uploads` directory using `send` - same package as `meteor` uses for serving files from the `public` folder.

## To try it out

1. Clone the project
        `git clone https://github.com/albertmatyi/meteor-hangs.git`
1. Enter its folder
        `cd meteor-hangs`
1. Run the server
        `meteor`
1. Open up chrome and navigate to
        `http://localhost:3000/uploads/penken.jpg`
1. Open up the Inspector and disable the cache
    ![Disable cache](http://i.imgur.com/NuATTPq.png)
1. Refresh the page ~810-2000 times (may vary) - Simply keep your finger on the refesh button (`F5`, `Ctrl + R` or `Cmd + R`)
     The console will show how many time the resource was requested and served
1. **Result:** Meteor hangs and will not serve any other client


## Tested on

* OS
  * Linux manjaro 3.16.2-1-MANJARO #1 SMP PREEMPT Sat Sep 6 10:22:00 UTC 2014 x86_64 GNU/Linux
  * OSX 10.9.5
* Meteor
  * 0.9.3.1



## Note

Interestingly enough if I run wget 10000 times using the following bash line:

    for i in `seq 10000`; do wget http://localhost:3000/uploads/penken.jpg -qO /dev/null; sleep 0.01; done

The issue doesn't manifest itself.

Any ideas?

## Relevant (and only) code in `/server/serve.js`

		var idx = 0;
		var send = Meteor.npmRequire('send');

		WebApp.connectHandlers.use(function(req, res /*, next*/ ) {
		    sendFile(req, res, '/penken.jpg');
		});

		var sendFile = function(req, res, urlPath) {
		    var lidx = idx++;
		    console.log(lidx, 'requesting', urlPath);

		    send(req, urlPath, {
		        root: process.env.PWD + '/.uploads',
		        maxAge: 20 * 60 * 1000
		    }).pipe(res);
		};


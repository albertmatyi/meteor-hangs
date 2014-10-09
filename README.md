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
1. Open up chrome and navigate to (you should see a picture)
        `http://localhost:3000/`
1. Open up the Inspector and disable the cache
    ![Disable cache](http://i.imgur.com/NuATTPq.png)
1. Refresh the page ~810-4500 times (may vary) - Simply keep your finger on the refesh button (`F5`, `Ctrl + R` or `Cmd + R`)
     The console will show how many time the resource was requested and served
1. **Result:** Meteor hangs and will not serve any other client


## Tested on

* OS
  * Linux manjaro 3.16.2-1-MANJARO #1 SMP PREEMPT Sat Sep 6 10:22:00 UTC 2014 x86_64 GNU/Linux
  * OSX 10.9.5
* Meteor
  * 0.9.3.1



## Note


* I don't know if this is a specific `meteor` issue or it is a `send`,  `WebApp` etc.
* I couldn't pinpoint the problem - since it is hard to reproduce and node-inspector cannot debug a hung application
* Interestingly enough if I run wget 10000 times using the following bash line:

        for i in `seq 10000`; do wget http://localhost:3000/uploads/penken.jpg -qO /dev/null; sleep 0.01; done
  The issue doesn't manifest itself.
* It also happens when the requests are not coming in this burst but I leave the app running for 4hrs and a UI testing script simulates the user interaction (clicks), triggering new requests. The app halts even then.
* I noticed the problem also when I simply `pipe`d `fileStream`s to the `response` object (taking care myself of the custom headers)
* The `send` used by `meteor` is an older version (`0.1.4`) while mine is `0.9.3`

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



## Misc infos

Open file descriptors after hang (output of `lsof`)

	    COMMAND   PID   USER   FD      TYPE             DEVICE SIZE/OFF    NODE NAME
		node    27109 matyas  cwd       DIR                8,7     4096 2547816 /home/matyas/work/test/hangxample/.meteor/local/build/programs/server
		node    27109 matyas  rtd       DIR                8,6     4096       2 /
		node    27109 matyas  txt       REG                8,7  9216272 2626536 /home/matyas/.meteor/packages/meteor-tool/.1.0.33.4l5l80++os.linux.x86_64+web.browser+web.cordova/meteor-tool-os.linux.x86_64/dev_bundle/bin/node
		node    27109 matyas  mem       REG                8,7    35664 2660800 /home/matyas/.meteor/packages/meteor-tool/.1.0.33.4l5l80++os.linux.x86_64+web.browser+web.cordova/meteor-tool-os.linux.x86_64/dev_bundle/lib/node_modules/fibers/bin/linux-x64-v8-3.14/fibers.node
		node    27109 matyas  mem       REG                8,6  2047384 2103289 /usr/lib/libc-2.19.so
		node    27109 matyas  mem       REG                8,6   149301 2103305 /usr/lib/libpthread-2.19.so
		node    27109 matyas  mem       REG                8,6    90072 2104929 /usr/lib/libgcc_s.so.1
		node    27109 matyas  mem       REG                8,6  1063360 2101988 /usr/lib/libm-2.19.so
		node    27109 matyas  mem       REG                8,6  1024264 2113364 /usr/lib/libstdc++.so.6.0.20
		node    27109 matyas  mem       REG                8,6    31760 2103282 /usr/lib/librt-2.19.so
		node    27109 matyas  mem       REG                8,6    14672 2103233 /usr/lib/libdl-2.19.so
		node    27109 matyas  mem       REG                8,6   160042 2103264 /usr/lib/ld-2.19.so
		node    27109 matyas    0u     unix 0xffff8801b0c53480      0t0 8695528 socket
		node    27109 matyas    1u     unix 0xffff8801b0c50700      0t0 8695530 socket
		node    27109 matyas    2u     unix 0xffff8801b0c54600      0t0 8695532 socket
		node    27109 matyas    3r     FIFO                0,8      0t0 8695534 pipe
		node    27109 matyas    4w     FIFO                0,8      0t0 8695534 pipe
		node    27109 matyas    5u  a_inode                0,9        0    5629 [eventpoll]
		node    27109 matyas    6r     FIFO                0,8      0t0 8695535 pipe
		node    27109 matyas    7w     FIFO                0,8      0t0 8695535 pipe
		node    27109 matyas    8u  a_inode                0,9        0    5629 [eventfd]
		node    27109 matyas    9r      DIR                8,6     4096       2 /
		node    27109 matyas   10u     IPv4            8695538      0t0     TCP *:29647 (LISTEN)



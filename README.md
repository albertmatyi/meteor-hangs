meteor-hangs
============

This small application that shows a possible bug/issue with `meteor/WebApp/send` that simply serves files from the `.uploads` directory using `send` - same package as `meteor` uses for serving files from the `public` folder.

## To try it out

1. Clone the project
        `git clone git@github.com:albertmatyi/meteor-hangs.git`
1. Enter its folder
        `cd meteor-hangs`
1. Run the server
        `meteor`
1. Open up chrome and navigate to
        `http://localhost:3000/penken.jpg`
1. Open up the Inspector and disable the cache
    ![Disable cache](http://i.imgur.com/NuATTPq.png)
1. Refresh the page ~1400 times (may vary) - Simply keep your finger on the refesh button
1. **Result:** Meteor hangs and will not serve any other client


## Tested on

* Linux manjaro 3.16.2-1-MANJARO #1 SMP PREEMPT Sat Sep 6 10:22:00 UTC 2014 x86_64 GNU/Linux
* Meteor 0.9.3.1




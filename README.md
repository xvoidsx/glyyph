# glyyph
glyyph is a beautiful, minimal nostr client

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/687ae4f6-9b71-4628-a26c-ff75e1393973" />

glyyph is a minimal nostr client that focuses on ease of use over stuffing it full of features.

> Please note that glyyph is still in development, and things are going to be updated quite a bit. You'll see this repo get updated frequently as we bring in some of the features on the roadmap we're putting together.
>
> As glyyph is still in development, there is no public instance of it yet. We will be setting up a test instance soon for people to come test out if they'd like and report any bugs they encounter. When there is a live instance up and running, we will update it here with a link. Until then, you're more than welcome to clone this repo and run an instance of it on your own machine to test it out!

### the glyyph stack

glyyph is written in vanilla html/css/js. No fancy frameworks - it aims to be as minimal and quick as possible, so any modern browser can use it on any device.

glyyph leverages the great [nostr-tools](https://github.com/nbd-wtf/nostr-tools) library for handling nostr operations.

### running glyyph

If you want to run a development version of glyyph, fork it, or contribute to the code yourself, you'll need to know how to run it! 

Here are the simple steps.

Ensure you have `nodejs` and `npm` installed on your machine: 

`sudo apt install nodejs npm`

Next, grab `live-server` from npm - we use this to start up a local webserver so you can view and interact with glyyph in your browser: 

`npm install -g live-server`

Now, you can run glyyph like this - ensure you're in the `/glyyph` folder, and start the webserver to serve glyyph. It will open it in your default browser, pointing to `http://127.0.0.1:8080`.

`live-server index.html` 

Now you should see glyyph! You can log into it with a nostr extension of your choosing (currently tested are **nos2x** on chromium and **nos2x-fox** on firefox.

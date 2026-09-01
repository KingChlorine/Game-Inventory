#Git history purge and path reconfiguration

**Issue** 
Accidentally pushed a config file containing API credentials. Local environment path issues preventeed me from using 'pip' cleanup commands
**Solution**
1. Genreated new api secret so leaked on was revoked
2. Used copilot to find away to access environment variables of correct user as there was a system bug bringing up config for different user.
3. Used copilot to tell me how to use environment variables correct the pip path in vscode.
4. Installed 'git-filter-repo' to remove file from all historical commits.
5. Credential variables stored in .env, used gitignore to use this file. Updated app.py to call .env to get variables.
**credits**
Copilot

**Issue**
Render refreshes after inactivity so json persistence doesn't work
**Solution TBD**
1. Have the ubdate json requests sent to github so the updated file is loaded to render from there
**or**
2. Free sql database that offers long term storage.
**considerations**
I could revert to local storage which would be fine for the intended purpose of this app but I want to use this app to apply and develop database knowledge.

**CORS - Cross origin resource sharing**
I misunderstood the purpose of cors which led to unnecessary strict use, preventing update/put requests. I thought cors was just giving blanket permission to speciied urls to exchange data.
My working understanding is that cors still blocks the retrieval of browser-based data from external(cross-origin) urls unless certain conditions are met including coming from an allowed origin and having preflight permissions granted for non standard requests such as put and delete. So CORS checks if a js http request to the backend is allowed and/or is this type of request allowed.
I imagined CORS was doing so much more but all it does is check if webpage is allowed to make JS HTTP requests to backend.
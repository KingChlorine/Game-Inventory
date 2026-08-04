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
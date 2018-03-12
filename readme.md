# From Source To Production With Ease

When puzzling together a build pipeline, going from source code to a built
artifact that is released to production, there's a lot of pieces that need
to go together. How do you mint a version number? How do you perform the
actual build? Where do you put the build artifacts? How do you securely
and confidently deploy the artifacts to production?

This talk attempts to answer all of these questions by providing real-world
experience with tools and techniques that solve each piece of the puzzle,
using Cake, GitVersion, TeamCity and Octopus Deploy.

## Setup

This setup is currently written for macOS. This means all paths, etc. will
be Unix style and pretty much nothing of this will work verbatim in Windows.
If there's demand for writing a Windows version of this,
[please submit an issue](https://github.com/asbjornu/from-source-to-production-with-ease/issues).

### Requirements

- [TeamCity](https://www.jetbrains.com/teamcity/) (will be installed and
  booted through Docker)
- [GitVersion](https://github.com/GitTools/GitVersion)
- [pjson](https://github.com/igorgue/pjson) (requires Python)
- [Octopus Deploy](https://octopus.com/) running somewhere.
- [Docker](https://www.docker.com/)

### Do The Dance

To get the presentation and TeamCity up and running, the folders
`~/Library/TeamCity/Logs` and `~/Library/TeamCity/Data` need to exist. When
they do, `docker-compose up` in the root of this repository should bring the
two websites up and running on `http://localhost` and `http://localhost:8080`
respectively.

Octopus Deploy was so difficult to get running on Docker that I gave that up
and just installed it in a Windows Server Core 2016 VM in Parallels instead.

Visit `http://localhost:8080` and complete the TeamCity setup. Do the same for
Octopus Deploy wherever you installed that.

Once GitVersion is installed and the presentation, TeamCity and Octopus Deploy
is up and running, you should be able to perform the examples successfully.

The exercises use GitVersion and `pjson` (to colorize the JSON in the console)
and has aliased `gv` to `gitversion | pjson`. To install `pjson`, you need
Python. When Python is installed, `pip install pjson` will install it on your
`PATH`.

## Exercises

### Get Your Git Up

First we're going to do some initial setup of Git and TeamCity.

1.  Create the folders `~/demo/remote` and `~/demo/local`.
2.  `cd ~/demo/remote` and type `git init --bare`.
3.  `cd ~/demo/local` and type `git clone ~/demo/remote`.
4.  Add and commit a `readme.md` file in the `local` repository.
3.  Type `gv` in the repository to see that GitVersion has created version
    `0.1.0` for your repository.
5.  `git push` to the remote repository that we are going to set up in TeamCity.
6.  Open the TeamCity web interface.
7.  Authorize the build agent in TeamCity by clicking "Agents" and
    "Unauthorized"
8.  Create a new project from the repository `/usr/demo/remote` in TeamCity.
9.  Edit the Version Control Settings for the attached VCS root and change:
    1. "Changes Checking Interval" from 60 to 1 seconds (expand the
        "advanced options" to reveal this setting).
        (PS: This is done only for demo purposes. You want to keep this at 60s in
        production)
    2. Branch specification: `+:refs/heads/*`
9.  Change the `readme.md` file in `~/demo/local`, commit it and push.
10. See that the change is picked up by TeamCity, triggering a build.
11. Notice that TeamCity uses an integer build counter to number its builds.
12. Type `gv` at the command line and notice how the `BuildMetaData` is
    incremented.

### Baking a Cake

Next we're going to add Cake and a build script to our repository.

1. Visit [cakebuild.net](https://cakebuild.net/), then go to:
    1. Get Started
    2. Setting Up A New Project
    3. Copy, paste and execute the OS X command to add a Cake build script to
       the project:
       `curl -Lsfo build.sh https://cakebuild.net/download/bootstrapper/osx`
2. Make the build script executable: `chmod +x build.sh`
3. Add the build script to Git: `git add build.sh`
4. Commit: `git commit -m 'Added Cake bootstrap script'`
5. Add a `build.cake` file containing the example from Cake's tutorial
   chapter 2 ("Create a Cake Script").
6. Execute the build script: `./build.sh`
7. Notice how the "Hello World" message is printed on the command line.
8. Add and commit the `build.cake` file to Git:
   ```bash
   git add build.cake
   git commit -m 'Added Cake build script'
   ```

### Layering the Cake

Now, let's add GitVersion to the repository.

1. Add `#tool "nuget:?package=GitVersion.CommandLine&version=4.0.0-beta0012"`
   to the first line of the `build.cake` file.
2. Add this right after the `var target` line:
   ```c#
   var gitVersion = GitVersion(new GitVersionSettings
   {
       OutPutType = GitVersionOutput.Json
   });
   ```
3. Then add tis to `Task("Default")`:
   ```c#:
   Information("NuGetVersion: {0}", gitVersion.NuGetVersion);
   Information("InformationalVersion: {0}", gitVersion.InformationalVersion);
   ```
4. Execute `./build.sh` and notice the version numbers written to the
   command line.
5. Add and commit the changes to `build.cake` to Git.

### Serving the Cake

Now, let's set put Cake to work in TeamCity.

1. Open TeamCity's web interface and edit the settings of the build
   configuration for the demo project we've created.
2. Navigate to "Build Steps" and click "Add build step"
   1. Step name: Build.
   2. Expand advanced options.
   3. Run: Executable with parameters
   4. Command executable: `./build.sh`.
4. Go to "Parameters" and click "Add new parameter".
   1. Name: `env.GitVersion_NuGetVersion`.
   2. Leave the Value empty.
4. Click "Add new parameter" again.
   1. Name: `env.Git_Branch`.
   2. Value: `%teamcity.build.vcs.branch.<vcsid>%` where `<vcsid>` is the
      ID of the VCS attached to the build configuration. You should get
      autocompleted this by TeamCity.
6. Go to "General Settings", expand "Advanced options" and change the "Build
   number format" to `%env.GitVersion_NuGetVersion%`.
7. Add a `Task("GitVersion")` and add the following code to it in `cake.build`:
   ```c#
   GitVersion(new GitVersionSettings
   {
       OutPutType = GitVersionOutput.BuildServer
   });
   ```
8. Add `.IsDependentOn("GitVersion")` to `Task("Default")`.
9. Commit the change to Git and and push:
   ```bash
   git commit -am 'Output GitVersion to build server instead of JSON'
   git push
   ```
10. Go back to TeamCity and notice that it picks up the change, builds the
   project and uses GitVersion's version number as its build number.

### Wrestling the Octopus

Now, let's set up Octopus Deploy.

1. Open Octopus Deploy's web interface in a browser.
2. Create two environments: `Staging` and `Production`.
3. Create a new SSH Account
   1. Username: `octopus`.
   2. Password: `OpenSesame`.
4. Create a new deployment target for `Staging`.
   1.  Target Type: SSH Connection
   2.  Click "Enter details manually"
   3.  Display Name: Staging Server.
   4.  Environments: Staging.
   5.  Target Roles: Create new role called `Web`.
   6.  Account: Choose the `SSH` account created earlier.
   7.  Host: The IP address of your host machine where `docker-compose up`
       was executed.
   8.  Port: `2222`
   9.  Fingerprint: If empty, log in to the `staging` container as such:
       `ssh -o FingerprintHash=md5 octopus@localhost -p 2222`
       The MD5 fingerprint will be printed to the console.
   10. .NET Framework: Mono not installed (beta)
5. Create a new deployment target for `Production`.
   1.  Target Type: SSH Connection
   2.  Click "Enter details manually"
   3.  Display Name: Production Server.
   4.  Environments: Production.
   5.  Target Roles: Create new role called `Web`.
   6.  Account: Choose the `SSH` account created earlier.
   7.  Host: The IP address of your host machine where `docker-compose up`
       was executed.
   8.  Port: `2223`
   9.  Fingerprint: If empty, log in to the `production` container as such:
       `ssh -o FingerprintHash=md5 octopus@localhost -p 2223`
       The MD5 fingerprint will be printed to the console.
   10. .NET Framework: Mono not installed (beta)
6. Create a new project
  1. Name: Demo project

Next we're going to add some build steps according to
[this raw scripting guide](https://octopus.com/docs/deploying-applications/custom-scripts/raw-scripting).

1. Add step 
  1. Step template: Transfer Package
  2. Execution Plan: Deployment targets
    1. Runs on targets in Roles: `Web`
  3. Package feed: Octopus Server
  4. Package ID: `Demo`
  5. Transfer Path: `~/temp/uploads`
2. Add another step
  1. Step template: Run a Script
  2. Step Name: Unpack
  3. Execution Plan: Deployment targets
    1. Runs on targets in roles: `Web`
  4. Script Content: Bash
     ```bash
     cp index.html /usr/share/nginx/html
     ```
3. Click your profile picture in the top right corner
   1. "Profile"
   2. "My API Keys"
   3. "New API Key"
      1. Purpose: Deployments from TeamCity
   4. Copy the API key.

### Octopi Like Cake Too

Now let's go back to the `build.cake` to instrument Octopus Deploy.

1. Add `#tool "nuget:?package=OctopusTools"` as a second line to `build.cake`.
2. Rename the existing `Task("Default")` to `Version`.
3. Add the following `Tasks` to `build.cake`:
   ```c#
   Task("OctoPack")
       .IsDependentOn("GitVersion")
       .Does(() =>
       {
           OctoPack("Demo", new OctopusPackSettings
           {
               Include = new [] { "index.html" },
               Version = gitVersion.NuGetVersion,
               Overwrite = true
           });
       });

   Task("OctoPush")
       .IsDependentOn("OctoPack")
       .Does(() =>
       {
           OctoPush("<the URL of your Octopus Deploy server>",
                    "<paste in the key copied from Octopus Deploy>",
                    new OctopusPushSettings
                    {
                        ReplaceExisting = true
                    });
       });

   Task("OctoRelease")
       .IsDependentOn("OctoPush")
       .Does(() =>
       {
           OctoCreateRelease("Demo", new CreateReleaseSettings
           {
               Server = "<the URL of your Octopus Deploy server>",
               ApiKey = "<paste in the key copied from Octopus Deploy>",
               ReleaseNumber = gitVersion.NuGetVersion
           });
       });
   
   Task("TeamCity")
       .IsDependentOn("OctoRelease");
   ```
4. Remember to replace the strings with `<text>` in them with valid values.
5. Go over to TeamCity and add `--target=TeamCity` to the command parameters
   to run the `TeamCity` task instead of the `Default` task.
6. Commit the changes to `build.cake`, push them and notice how TeamCity now:
   1. Builds the project.
   2. Creates a NuGet package (`.nupkg`) with OctoPack.
   3. Pushes the NuGet package to Octopus Deploy.
   4. Creates a release in Octopus Deploy.
   5. All with the same version number provided by GitVersion.

### Put GitVersion to Work

Now, let's see how GitVersion reacts to changes in Git.

1.  First, go to Octopus Deploy and open the "Demo" project.
2.  Under "Variables" create a new variable named `Environment` with the values:
    1. `production` for the environment scope `Production`
    2. `staging` for the environment scope `Staging`
3.  Create the file `index.html` and add some basic HTML to it. Somewhere in the
    file, add the text `#{Environment}` to test Octopus Deploy's variable
    substitution functionality.
4.  Add and commit `index.html` to Git.
5.  Create a tag: `git tag 1.0`
6.  Push the tag: `git push --tags`
7.  Then push the commit: `git push`
8.  See how TeamCity now creates a build named `1.0`
9.  See how release version `1.0` is created in Octopus Deploy.
10. Create a `develop` branch so we can iterate a bit without having to
    create tags for everything we want published:
    ```git
    git checkout -b develop
    git push --set-upstream origin develop
    ```
11. Make a change to the `index.html` file, commit and push it on the `develop`
    branch.
12. Notice how the version number in TeamCity is set to `1.1.0-alpha.X` where
    `X` is the number of commits since the last tag on `master`.

### Deploy It!

Now, let's auto-deploy all stable releases to the `Staging` environment. Add
the following to the `build.cake` file:

```c#
Task("OctoDeploy")
    .IsDependentOn("OctoRelease")
    .WithCriteria(gitVersion.PreReleaseTag == String.Empty)
    .Does(() =>
    {
        OctoDeployRelease("http://octopus-deploy.example",
                        "API-XXXXXXXXXXXXXXXXXXXX",
                        "Demo",
                        "Staging",
                        gitVersion.NuGetVersion,
                        new OctopusDeployReleaseDeploymentSettings());
    });
```

Then change `IsDependentOn("OctoRelease")` for `Task("TeamCity")` to `OctoDeploy`.
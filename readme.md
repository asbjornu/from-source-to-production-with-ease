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
9.  Edit the Version Control Settings for the attached VCS root and change
    the "Changes Checking Interval" from 60 to 2 seconds (expand the
    "advanced options" to reveal this setting).
    (PS: This is done only for demo purposes. You want to keep this at 60s in
    production)
9.  Change the `readme.md` file in `~/demo/local`, commit it and push.
10. See that the change is picked up by TeamCity, triggering a build.
11. Type `gv` at the command line and notice how the `BuildMetaData` is
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
2. Add some GitVersion to the `Default` build target:
   ```c#
   var gitVersion = GitVersion(new GitVersionSettings
   {
     OutPutType = GitVersionOutput.Json
   });

   Information("NuGetVersion: {0}", gitVersion.NuGetVersion);
   Information("InformationalVersion: {0}", gitVersion.InformationalVersion);
   ```
3. Execute `./build.sh` and notice the version numbers written to the
   command line.
4. Add and commit the changes to `build.cake` to Git.

### Having the Cake and eating it too

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
7. Remove the code added in step 2 in the previous section and add this to
   `cake.build` instead:
   ```c#
   GitVersion(new GitVersionSettings
   {
     OutPutType = GitVersionOutput.BuildServer
   });
   ```
8. Commit the change to Git and and push:
   ```bash
   git commit -am 'Output GitVersion to build server instead of JSON'
   git push
   ```
9. Go back to TeamCity and notice that it picks up the change, builds the
   project and uses GitVersion's version number as its build number.
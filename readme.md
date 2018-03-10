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

### Exercises

#### Get Your Git Up

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
11. 
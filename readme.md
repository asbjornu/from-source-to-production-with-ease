# From Source To Production With Ease

When puzzling together a build pipeline, going from source code to a built
artifact that is released to production, there's a lot of pieces that need
to go together. How do you mint a version number? How do you perform the
actual build? Where do you put the build artifacts? How do you securely
and confidently deploy the artifacts to production?

This talk attempts to answer all of these questions by providing real-world
experience with tools and techniques that solve each piece of the puzzle,
using Cake, GitVersion, TeamCity and Octopus Deploy.

## How I set stuff up

This is currently just random notes scribbled down during setup and
development. I hope to make these more coherent over time.

1. `vagrant init StefanScherer/windows_2016_docker`
2. `$Password = Read-Host "Enter a password" -AsSecureString; Set-LocalUser -Name Administrator -Password $Password`
3. `netsh advfirewall firewall add rule name="yolo" dir=in action=allow protocol=TCP localport=2376`
4. Followed [this guide](https://www.ntweekly.com/2017/02/06/part-2-run-windows-containers-on-windows-docker-host/)
   to set up the docker daemon to agree to being a `DOCKER_HOST` for macOS.

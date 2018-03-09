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

This requires a Windows installation to perform. Any Windows with PowerShell
should do. The next part is taken from [this video](https://youtu.be/I0yCfiVh6aw).

First, mount the Windows Server 2016 ISO. For this tutorial, it's mounted at
`D:\`. Copy the folder `NanoServer` from the mounted ISO to somewhere on
your hard disk. Let's use `C:\Nano`. Then type the following commands in a
PowerShell:

```powershell
Import-Module C:\Nano\NanoServerImageGenerator\NanoServerImageGenerator.psm1
New-NanoServerImage -Edition Standard -MediaPath D:\ -BasePath C:\Nano -TargetPath C:\Nano\windows-nano-server-01.vhd -DeploymentType Guest -ComputerName NANOSERVER -Storage -Package Microsoft-NanoServer-Guest-Package
```
Next you can fill the created disk image with packages by following
[this tutorial](https://www.petri.com/how-to-install-windows-server-2016-nano-in-a-vm).

Finally, if you want to use the VHD in Parallels, you need to
[create a `.vmc` file alongside it](https://stackoverflow.com/a/5176279/61818).

### Derailment

Now, if you did like me and typed `.vhdx` instead of `.vhd` in the
`New-NanoServerImage` command, you might need to convert the `.vhdx` file
to a `.vhd` file. Or you can just redo the process. I didn't know that
was possible first, which derailed me to [this blog post explaining how
to convert VHD to VHDX and back](http://itproctology.blogspot.no/2013/03/converting-vhdx-vhd-and-back-without.html). Interesting!

### Install SQL Server

https://www.starwindsoftware.com/blog/install-sql-server-2016-on-windows-server-2016-server-core
 netsh advfirewall firewall add rule name="Open Port 80" dir=in action=allow protocol=TCP localport=80
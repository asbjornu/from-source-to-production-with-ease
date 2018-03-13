#tool "nuget:?package=GitVersion.CommandLine&version=4.0.0-beta0012"

var target = Argument("Target", "Default");
var gitVersion = GitVersion(new GitVersionSettings
{
    OutputType = GitVersionOutput.Json
});

Task("Default")
    .Does(() =>
    {
        Information("Hello Vilnius");
        Information("GitVersion: {0}", gitVersion.NuGetVersion);
    });

RunTarget(target);
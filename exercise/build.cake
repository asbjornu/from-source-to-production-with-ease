#tool "nuget:?package=GitVersion.CommandLine&version=4.0.0-beta0012"
#tool "nuget:?package=OctopusTools"

var target = Argument("Target", "Default");
var gitVersion = GitVersion(new GitVersionSettings
{
    OutputType = GitVersionOutput.Json
});

Task("GitVersion")
    .Does(() => {
        GitVersion(new GitVersionSettings
        {
            OutputType = GitVersionOutput.BuildServer
        });
    });

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

Task("Default")
    .IsDependentOn("OctoPack")
    .Does(() =>
    {
        Information("Hello Vilnius");
        Information("GitVersion: {0}", gitVersion.NuGetVersion);
    });

RunTarget(target);
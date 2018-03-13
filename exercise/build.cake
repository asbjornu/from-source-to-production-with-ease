#tool "nuget:?package=GitVersion.CommandLine&version=4.0.0-beta0012"
#tool "nuget:?package=OctopusTools"

var target = Argument("Target", "Default");
var octopusServer = "http://10.37.129.4/";
var octopusApiKey = "API-OEYO3MAELSOXQV1EURKB5A787B0";
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

Task("OctoPush")
    .IsDependentOn("OctoPack")
    .Does(() =>
    {
        var packageFiles = GetFiles("./*.nupkg");

        OctoPush(octopusServer,
                 octopusApiKey,
                 packageFiles,
                 new OctopusPushSettings
                 {
                     ReplaceExisting = true
                 });
    });

Task("TeamCity")
    .IsDependentOn("OctoPush");

Task("Default")
    .IsDependentOn("OctoPack")
    .Does(() =>
    {
        Information("Hello Vilnius");
        Information("GitVersion: {0}", gitVersion.NuGetVersion);
    });

RunTarget(target);
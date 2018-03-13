var target = Argument("Target", "Default");

Task("Default")
    .Does(() =>
    {
        Information("Hello Vilnius");
    });

RunTarget(target);
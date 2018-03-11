FROM jetbrains/teamcity-agent
LABEL maintainer="Asbjørn Ulsberg <asbjorn@ulsberg.no>"
LABEL version="1.0"

# INSTALL MONO

RUN apt-get update \
    && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF

RUN echo "deb http://download.mono-project.com/repo/debian xenial/snapshots/5.10 main" > /etc/apt/sources.list.d/mono-xamarin.list \
    && apt-get update \
    && apt-get install -y mono-devel ca-certificates-mono fsharp mono-vbnc nuget referenceassemblies-pcl \
    && rm -rf /var/lib/apt/lists/*
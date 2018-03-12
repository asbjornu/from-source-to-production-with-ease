FROM nginx:alpine
FROM frolvlad/alpine-mono

RUN apk update && \
    apk add --no-cache openssh bash openssl

RUN mkdir /var/run/sshd && \
    adduser -g "octopus" -D octopus && mkdir /home/octopus/.ssh && \
    echo "octopus:OpenSesame" | chpasswd && \
    chown -R octopus.octopus /home/octopus && \
    chmod 700 /home/octopus/.ssh && \
    ssh-keygen -A

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]

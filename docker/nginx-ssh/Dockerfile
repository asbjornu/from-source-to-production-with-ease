FROM nginx:alpine

RUN apk update
RUN apk add openssh
RUN mkdir /var/run/sshd
RUN adduser -g "octopus" -D octopus && mkdir /home/octopus/.ssh
RUN echo "octopus:OpenSesame" | chpasswd
RUN sed -i 's/.*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
RUN chown -R octopus.octopus /home/octopus
RUN chmod 700 /home/octopus/.ssh
RUN ssh-keygen -A

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]

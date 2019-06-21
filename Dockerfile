FROM node

RUN apt-get update && apt install -y sudo

RUN adduser databoard

RUN echo databoard:123456 | chpasswd

RUN usermod -aG sudo databoard

USER databoard

COPY package.json /home/databoard

RUN curl https://install.meteor.com | sh

ENV PATH "$PATH:/home/databoard/.meteor"

RUN npm update npm

RUN cd /home/databoard && meteor npm install

RUN mkdir -p /home/databoard/app && cp -a /home/databoard/node_modules /home/databoard/app

WORKDIR /home/databoard/app

COPY . /home/databoard/app

ENV NAME meteor

EXPOSE 3000

RUN echo 123456 | sudo -S chown -R databoard /home/databoard/app/.meteor

CMD ["meteor"]
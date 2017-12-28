FROM node:7.10.0

WORKDIR /sails
# some bash niceties
ADD .docker/root/.bashrc /root/

EXPOSE 1337
CMD ["npm", "start"]

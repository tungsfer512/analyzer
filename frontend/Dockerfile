FROM node:12.21.0-buster
WORKDIR /frontend
COPY package.* ./
RUN npm install
COPY . /frontend/
CMD [ "npm", "run", "start" ]
# ENTRYPOINT ["tail", "-f", "/dev/null"]


# Tell Docker to get Node Alpine version need to download 'bash' to get into /bin/bash
FROM node:16-alpine3.11 
RUN apk update && apk add bash

WORKDIR /usr/src/smart-brain-api
COPY ./ ./

RUN npm install
CMD ["/bin/bash"]
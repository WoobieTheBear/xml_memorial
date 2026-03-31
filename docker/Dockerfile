FROM node:20-slim

# 1. Install Java JDK
RUN apt-get update && \
    apt-get install -y default-jdk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 2. Fix the Java Path so the NPM package can't miss it
ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH="$PATH:$JAVA_HOME/bin"

WORKDIR /usr/src/app

# 3. COPY THE PACKAGE.JSON
COPY src/package*.json ./

# 4. Install dependencies
RUN npm install

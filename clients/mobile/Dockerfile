FROM ubuntu:20.04

USER root
WORKDIR /home/developer

RUN curl -sL https://deb.nodesource.com/setup_15.x | bash -
RUN echo "debconf debconf/frontend select Noninteractive" | debconf-set-selections
RUN apt-get update && apt upgrade -y && apt-get install -y dialog build-essential file apt-utils nodejs npm curl zip unzip xz-utils libglu1-mesa wget openjdk-8-jdk

RUN mkdir -p Android/sdk
ENV ANDROID_SDK_ROOT /home/developer/Android/sdk
RUN mkdir -p .android && touch .android/repositories.cfg
RUN wget -O sdk-tools.zip https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
RUN unzip sdk-tools.zip && rm sdk-tools.zip
RUN mv tools Android/sdk/tools
RUN cd Android/sdk/tools/bin && yes | ./sdkmanager --licenses
RUN cd Android/sdk/tools/bin && ./sdkmanager "build-tools;29.0.2" "patcher;v4" "platform-tools" "platforms;android-29" "sources;android-29"
ENV PATH "$PATH:/home/developer/Android/sdk/platform-tools"

WORKDIR /user/src/apps/mobile_client
VOLUME /user/src/apps/Psynder-mobile-android.apk

COPY . .
RUN npm ci
RUN chmod +x android/gradlew

WORKDIR /user/src/apps/mobile_client/android/app

RUN keytool -genkey -v -keystore psynder.keystore -alias psynder_alias -keypass "psynderTMPappkeygenpassword" -storepass "psynderTMPappkeygenpassword" -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=, OU=, O=Psynder, L=, S=, C=FR"

RUN ../gradlew clean && ../gradlew assembleRelease

RUN cp ./build/outputs/apk/release/app-release.apk /user/src/apps/Psynder-mobile-android.apk

# VOLUME /user/src/apps/mobile_client/

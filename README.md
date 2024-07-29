# Arsenal

Gun Collection Management App written in React Native with TypeScript, leveraging Expo and using React Native Paper UI

## Run it

This is an Expo app using React Natvie and TypeScript. Confirm your system is set up for that.

- clone repo
- ```npm install```
- ```npx expo start```

## Dependencies

See ```package.json```

## Data handling

The app is built around Expo SecureStore and Async Storage. Collection objects are stored in SecureStore with an id consisting of a uuid4 string.
This string is stored in a key database in Async Storage and used to map over the SecureStore entries to retrieve them.
Preferences and tags are stored in Async Storage.

The app loads all databases into memory and performs all manipulations on that database image. 
All save operations are saved in Async Storage or SecureStore in the background.

## Licensing and usage

The app is a premium app on the Google Playstore, but you are free as per the license to build your own APK from the source code if you are able AND willing to do so.
```eas.json``` is set up with a preview (APK) and production (AAB) build profile for Expo.

Releases are available as APK up to Alpha 9.0.0. 

If you use the code or parts of it for your own app, you agree to credit me and link to this repo.
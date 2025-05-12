# tldr
This is a new [**React Native CLI**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli). This guide will take you through the steps to get started with the project and later will touch on techinical details.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding. This guide will not go into detail about the environment setup, and assumes that you will be testing on an Android device.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native. It's recommended to use yarn to install the dependencies and run the project.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# using Yarn
yarn android
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

# Some important links, if required

To learn more about React Native, take a look at the following resources:

- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Techincal Details
## Tech-Stack

- React Native - base framework
- React Native Stack and Bottom Tabs Navigation - navigation
- React Native Vector Icons - icons
- React Native Firebase - firebase integration
- React Native Google Auth - google auth integration
- Redux toolkit - state management
- Typescript - type safety

## Brief explanation on tech-stack 

Due to firebase's widely documentation, support and ease of use, it was chosen as the backend as well as the authentication provider for this project. Though a major hickup was faced due to the react-native libraries of firebase currntly undergoing a major migration to the new firebase v22. The rest are the standard libraries and tools used in react native. 

## Brief explanation on Implemented Features

### Authentication

- Login with Google
- Logout
- Auth state persistence using AsyncStorage

### Travel Logs

- Add a travel log using text input, camera, date picker and location(manual inptu)
- View all travel logs in a list feed
- Backup travel logs to firebase

### Chat

- Find all available users 
- Send and receive messages 1 on 1
- Message history persistence using firebase
- Real-time message updates

## Notes on improvements

Due to spending a lot of time on the firebase integration, the UI and finishing of the entire app was not to my satisfaction. Some state management and the UI can be improved. Along with some minor improvements, the app can be made more robust and user friendly.
export const IS_DEV = process.env.APP_VARIANT === 'development';
export const IS_PREV = process.env.APP_VARIANT === "preview"
export const IS_RC = process.env.APP_VARIANT === "releaseCandidate"

export default {
  "expo": {
    "name": IS_DEV ? " Arsenal DEV" : IS_PREV ? "Arsenal PRE" : IS_RC ? "Arsenal RC" : "Arsenal",
    "slug": "waffenschrank",
    "version": "5.0.0",
    "orientation": "portrait",
    "icon": "./assets/appIconC.png",
    "userInterfaceStyle": "light",
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": IS_DEV ? "com.m00gendai.arsenal.dev" : IS_PREV ? "com.m00gendai.arsenal.pre" : IS_RC ? "com.m00gendai.arsenal.rc" : "com.m00gendai.arsenal",
      "name": "Arsenal: Armamentarium",
      "buildNumber": "5",
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs access to your camera to take photos.",
        "NSPhotoLibraryUsageDescription": "This app needs access to your photo library to save photos.",
      },
      "config":
      { 
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/appIconC.png",
        "backgroundColor": "#ffffff"
      },
      "package": IS_DEV ? "com.m00gendai.arsenal.dev" : IS_PREV ? "com.m00gendai.arsenal.pre" : IS_RC ? "com.m00gendai.arsenal.rc" : "com.m00gendai.arsenal",
      "versionCode": 14,
      "permissions": [
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VISUAL_USER_SELECTED"
      ]
    },
    "web": {
      "favicon": "./assets/appIconC.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-asset",
      "expo-local-authentication",
      "expo-web-browser",
      "expo-sharing",
      "expo-font",
      [
        "./plugins/withAndroidMainActivityAttributes",
        {
          "android:largeHeap": false,
          "android:hardwareAccelerated": true
        }
      ],
      ["expo-sqlite", {
        "useSQLCipher": true,
      }],
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "16.4"
          }
        }
      ],
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#000000",
          "image": "./assets/appIconC.png",
          "dark": {
            "image": "./assets/appIconC.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ],
      [
      "react-native-vision-camera",
      {
        "cameraPermissionText": "Arsenal needs access to your Camera.",
        "enableCodeScanner": true
      }
    ],
    ],
    "extra": {
      "eas": {
        "projectId": "5ef50f11-cb46-4131-abc8-d04acd131837"
      }
    },
    "owner": "m00gendai"
  }
}
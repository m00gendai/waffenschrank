export const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  "expo": {
    "name": IS_DEV ? " Arsenal DEV" : "Arsenal",
    "slug": "waffenschrank",
    "version": "1.2.3",
    "orientation": "portrait",
    "icon": "./assets/appIconC.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": IS_DEV ? "com.m00gendai.arsenal.dev" : "com.m00gendai.arsenal",
      "name": "Arsenal: Armamentarium",
      "buildNumber": "5"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/appIconC.png",
        "backgroundColor": "#ffffff"
      },
      "package": IS_DEV ? "com.m00gendai.arsenal.dev" : "com.m00gendai.arsenal",
      "versionCode": 14
    },
    "web": {
      "favicon": "./assets/appIconC.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-build-properties",
      "expo-asset",
      "expo-local-authentication",
      [
        "./plugins/withAndroidMainActivityAttributes",
        {
          "android:largeHeap": true,
          "android:hardwareAccelerated": true
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "5ef50f11-cb46-4131-abc8-d04acd131837"
      }
    },
    "owner": "m00gendai"
  },
  "android": {
    "permissions": [
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_MEDIA_VISUAL_USER_SELECTED"
    ]
  },
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "This app needs access to your camera to take photos.",
      "NSPhotoLibraryUsageDescription": "This app needs access to your photo library to save photos."
    }
  }
}

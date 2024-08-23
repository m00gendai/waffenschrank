const IS_DEV = process.env.APP_VARIANT === "development"

export default {
  "expo": {
    "name": "Arsenal",
    "slug": "waffenschrank",
    "version": "1.0.0",
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
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/appIconC.png",
        "backgroundColor": "#ffffff"
      },
      "package": IS_DEV ? "com.m00gendai.arsenal.dev" : "com.m00gendai.arsenal",
      "versionCode": 9
    },
    "web": {
      "favicon": "./assets/appIconC.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-build-properties",
      "expo-asset",
      "expo-local-authentication"
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
  }
}

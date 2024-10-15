import { drizzle } from "drizzle-orm/expo-sqlite"
import * as SQLite from "expo-sqlite"
import { openDatabaseSync } from "expo-sqlite/next"

export const expo = openDatabaseSync("test_db34.db", {enableChangeListener: true})
export const db = drizzle(expo)

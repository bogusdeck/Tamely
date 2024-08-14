import { Client } from "@notionhq/client";
import { db, doc, getDoc } from "../lib/firebase"; // Adjust the import path as needed

export const getNotionTable = async (userEmail) => {
  // Fetch the user's Notion API key and Database ID from Firestore
  const userDocRef = doc(db, "users", userEmail);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    throw new Error("User Notion credentials not found.");
  }

  const userData = docSnap.data();
  const notionApiKey = userData.notionApiKey;
  const databaseId = userData.notionDatabaseId;

  if (!notionApiKey || !databaseId) {
    throw new Error("Notion API Key or Database ID is missing.");
  }

  const notion = new Client({ auth: notionApiKey });

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response.results.map((page) => ({
    id: page.id,
    title: page.properties.Title.title[0]?.plain_text || "",
    startDate: page.properties["Start Date"].date?.start || "",
    endDate: page.properties["End Date"].date?.end || "",
    totalTime: page.properties["Total Time"].date?.start || "",
    estimatedTime: page.properties["Estimated Time"].date?.start || "",
    status: page.properties.Status.select?.name || "",
  }));
};

import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const getNotionTable = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID;

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

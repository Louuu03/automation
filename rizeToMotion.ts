import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
dotenv.config();

type CleanedData = {
  startTime: string;
  title?: string;
  type?: string;
  duration: number;
  client: string;
  id: string;
  description: string;
};

const TRANX_WORKSPACE_ID = "fcO6QxE1rF5XXLheI97Sy";
const ELPHYC_WORKSPACE_ID = "KUul2SowFZ01kZ7IQfi28";
const LOU_ID = "Ol2eJ2a8CPgyU9WoTrtQZfdLObj2";

export const rizeToMotion = async (webhookData: any) => {
  const cleanedData = await cleanUpRizeData(webhookData);
  if (cleanedData === null) return;
  if (cleanedData.type === "create") {
    await createMotion(cleanedData.data!);
  } else if (cleanedData.type === "update") {
    await deleteMotion(cleanedData.id as string);
    await createMotion(cleanedData.data!);
  } else if (cleanedData.type === "delete") {
    await deleteMotion(cleanedData.id as string);
  }
};

export const cleanUpRizeData = async (
  webhookData: any
): Promise<{ type: string; data?: CleanedData; id?: string } | null> => {
  console.log("cleanUpRizeData", webhookData);
  if (!webhookData.event_type) return null;
  const {
    start_time,
    end_time,
    title,
    type,
    id,
    description,
    parent_type,
    parent,
  } = webhookData.data;
  const isExsit = await isExsitMotion(id);
  const duration = Math.round(
    (new Date(end_time).getTime() - new Date(start_time).getTime()) / 1000 / 60
  );

  const hour = new Date(start_time).getHours();
  const client =
    parent_type === "client" ? parent.name : hour < 18 ? "Tranx" : "Elphyc";

  if (webhookData.event_type === "session_timer_stopped") {
    return {
      type: isExsit ? "update" : "create",
      data: {
        startTime: start_time,
        title,
        type,
        duration,
        client,
        id,
        description,
      },
    };
  } else if (webhookData.event_type === "time_entry_created") {
    return {
      type: isExsit ? "update" : "create",
      data: {
        startTime: start_time,
        title,
        type,
        duration,
        client,
        id,
        description,
      },
    };
  } else if (webhookData.event_type === "time_entry_updated") {
    return {
      type: isExsit ? "update" : "create",
      id: isExsit as string,
      data: {
        startTime: start_time,
        duration,
        client,
        id,
        description,
      },
    };
  } else if (webhookData.event_type === "time_entry_deleted") {
    return {
      type: "delete",
      id: isExsit as string,
    };
  }
  return null;
};

export const createMotion = async (data: CleanedData) => {
  console.log("createMotion");
  const motionApiKey = process.env.MOTION_API_KEY || "";
  try {
    const response = await axios.post(
      "https://api.usemotion.com/v1/tasks",
      {
        name: "Work time - " + data.client + " - " + data.id,
        description:
          data?.title +
          " / " +
          data?.type +
          ": " +
          "\n" +
          data.description +
          "\n" +
          "start time: " +
          new Date(data.startTime).toLocaleString(),
        duration: data.duration,
        workspaceId:
          data.client === "Tranx" ? TRANX_WORKSPACE_ID : ELPHYC_WORKSPACE_ID,
        status: "Completed",
        assigneeId: LOU_ID,
        labels: ["Rize"],
      },
      {
        headers: {
          "X-API-Key": motionApiKey,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Motion task created");
    return response.data;
  } catch (error: any) {
    const { status, statusText, data } = error.response;
    console.error("Error updating Motion task");
    console.error(`Status: ${status} ${statusText}`);
    console.error("Response data:", JSON.stringify(data, null, 2));
  }
};

export const deleteMotion = async (id: string) => {
  if (!id) return;
  const motionApiKey = process.env.MOTION_API_KEY || "";
  try {
    const response = await axios.delete(
      "https://api.usemotion.com/v1/tasks/" + id,
      {
        headers: {
          "X-API-Key": motionApiKey,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Motion task deleted");
    return response.data;
  } catch (error: any) {
    const { status, statusText, data } = error.response;
    console.error("Error updating Motion task");
    console.error(`Status: ${status} ${statusText}`);
    console.error("Response data:", JSON.stringify(data, null, 2));
  }
};

export const isExsitMotion = async (id: string): Promise<false | string> => {
  console.log("isExsitMotion");
  const motionApiKey = process.env.MOTION_API_KEY || "";
  try {
    const response = await axios.get("https://api.usemotion.com/v1/tasks", {
      headers: {
        "X-API-Key": motionApiKey,
        "Content-Type": "application/json",
      },
      params: {
        name: id,
        label: "Rize",
        includeAllStatuses: true,
      },
    });
    if (response?.data?.tasks?.length > 0) return response.data.tasks[0].id;
    return false;
  } catch (error) {
    console.error("Error finding Motion task");
    return false;
  }
};

import axios from "axios";

const status: { [key: string]: string } = {
  sc901803724845_Y0x9gavA: "paused",
  sc901803724845_nIGklBTK: "in progress",
  sc901803724845_xEAAadP6: "pull requested",
  sc901803724845_0ZNAayPf: "completed",
  sc901803724845_fiwnjcAP: "to do",
  sc901803724845_0wPgkbct: "fixing",
};

export const clickupToMotion = async (webhookData: any) => {
  if (!webhookData) return;
  const { status_id, name } = webhookData.payload;
  const motionApiKey = process.env.MOTION_API_KEY || "";
  const TRANX_WORKSPACE_ID = "fcO6QxE1rF5XXLheI97Sy";
  const LOU_ID = "Ol2eJ2a8CPgyU9WoTrtQZfdLObj2";

  try {
    const response = await axios.post(
      "https://api.usemotion.com/v1/tasks",
      {
        name: "Task " + status[status_id as string] + " - " + name,
        description: webhookData.date.toLocaleString(),
        workspaceId: TRANX_WORKSPACE_ID,
        status: "Completed",
        assigneeId: LOU_ID,
        labels: ["Clickup"],
        duration: 5,
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
  } catch (error) {
    console.error("Error creating Motion task");
  }
};

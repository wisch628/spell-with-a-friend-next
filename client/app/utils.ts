// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callPostRoute = async (route: string, body: any) => {
  const response = await fetch(`http://${getBackendUrl()}/${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
  return response;
};

export const captialize = (word: string) => {
  return String(word).charAt(0).toUpperCase() + String(word).slice(1);
};

export const getBackendUrl = (isWebsocket: boolean = false) => {
  const isProd = process.env.NODE_ENV !== "production";
  const port = isWebsocket ? 8001 : 8000;
  console.log({isWebsocket})
  return isProd ? `18.119.126.107:${port}` : `localhost:${port}`;
};

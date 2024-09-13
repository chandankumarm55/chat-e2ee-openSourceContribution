import { configContext } from "./configContext";

type CustomError = Error & {
  status: number
}

const getBaseURL = (): string => {
  const { apiURL } = configContext();
  const BASE_URI = apiURL || (process.env.NODE_ENV === "production" ? 'https://chat-e2ee-2.azurewebsites.net' : '');
  return BASE_URI;
}

const makeRequest = async (url: string, { method = 'GET', body }: { method: string, body?: any }) => {
  const res = await window.fetch(`${getBaseURL()}/api/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    ...(body && { body: JSON.stringify(body) })
  });

  if (!res.ok) {
    const json = res.headers.get('Content-Type').includes('application/json')
      ? await res.json()
      : await res.text();

    const err = new Error(json.message || json.error || JSON.stringify(json)) as CustomError;
    err.status = res.status;

    throw err;
  }

  return await res.json();
};

export default makeRequest;
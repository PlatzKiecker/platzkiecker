import useSWR, { mutate } from "swr";
import axios from "axios";
import { getCookie } from "./csrf";

export default function mySWR(path: string) {
  const url = `http://localhost:8000${path}`;
  const { data, error, isLoading } = useSWR(url, fetcher);

  async function update(newData: Record<string, any>) {
    const response = await axios.put(url, newData, {
      withCredentials: true,
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
    console.log(response);
    mutate(url, newData, false);
  }

  return {
    data,
    loading: isLoading,
    error: error,
    update: update,
  };
}

async function fetcher(args: any) {
  return fetch(args, { credentials: "include" }).then((res) => res.json());
}

export async function postRequest(url: string, data: Record<string, any>) {
  return await axios.post(url, data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
}

export async function putRequest(url: string, data: Record<string, any>) {
  return await axios.put(url, data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
}

export async function deleteRequest(url: string) {
  return await axios.delete(url, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
}

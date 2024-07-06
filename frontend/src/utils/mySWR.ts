import useSWR, { mutate } from "swr";
import axios from "axios";
import { getCookie } from "./csrf";

const BASE_URL = "http://localhost:8000"; // Define your base URL here

export default function mySWR(path: string) {
  const url = `${BASE_URL}${path}`; // Construct the full URL
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

  async function remove() {
    const response = await axios.delete(url, {
      withCredentials: true,
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
    console.log(response);
    mutate(url, null, false); // Invalidate the SWR cache
  }

  return {
    data,
    loading: isLoading,
    error,
    update,
    remove,
  };
}

async function fetcher(args: any) {
  return fetch(args, { credentials: "include" }).then((res) => res.json());
}

export async function postRequest(url: string, data: Record<string, any>) {
  return await axios.post(`${BASE_URL}${url}`, data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
}

export async function putRequest(url: string, data: Record<string, any>) {
  return await axios.put(`${BASE_URL}${url}`, data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
}

export async function deleteRequest(url: string) {
  return await axios.delete(`${BASE_URL}${url}`, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
}
import useSWR from "swr";

export default function mySWR(path: string) {
  const url = `http://localhost:8000${path}`;
  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data,
    loading: isLoading,
    error: error,
  };
}

async function fetcher(args: any) {
  return fetch(args, { credentials: "include" }).then((res) => res.json());
}

import useSWR, { mutate } from "swr";


const fetcher = (url: string, options: any) => fetch(url, options).then(res => res.json());

export const useLogin = () => {
  const { data, error } = useSWR('/api/login', fetcher, { revalidateOnFocus: false });

  const login = async (username: String, password: String) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      mutate('/api/login', data, false);
      return data;
    } else {
      throw new Error(data.message || 'Failed to login');
    }
  };

  return {
    login,
    data,
    error
  };
};
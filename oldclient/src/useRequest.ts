import axios from "axios";
import { useState, useEffect } from "react";

/**
 * @param url
 * @returns [data, failed, loading]
 */
export default function useRequest<T>(url: string): [T, boolean, boolean] {
  const [data, setData] = useState([]);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
        setFailed(true);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return [data as T, failed, loading];
}

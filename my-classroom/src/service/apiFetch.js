import { useState, useEffect } from 'react';
import axios from 'axios';
import {createAuthorizationHeader} from  "./utils";

export default function useApiFetch(url, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
 
  useEffect(() => {
    let axiosConfig = createAuthorizationHeader();
    const fetchData = async () => {
      setErrorMessage(null);
      setIsLoading(true);
 
      try {
        const result = await axios(url, axiosConfig);
        setData(result.data);
      } catch (error) {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setErrorMessage(resMessage);
      }
 
      setIsLoading(false);
    };
 
    fetchData();
  }, [url]);
 
  return [{ data, isLoading, errorMessage }, setData];
};
 

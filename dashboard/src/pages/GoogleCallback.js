import { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { ApiClientError } from "redirink-node-client";
import { ApiClientLocalStorage } from "../api";

const useQuery = () => new URLSearchParams(useLocation().search);

const GoogleCallback = ({ setToken, ...props }) => {
  const query = useQuery();
  const [error, setError] = useState(null);
  // Only code is needed for authentication
  const code = query.get("code") ?? null;

  useEffect(() => {
    const authenticate = async () => {
      try {
        // NOTE: you can't call static methods with class instance
        const token = await ApiClientLocalStorage.signinGoogle({ code });
        console.log("Social login token: ", token);
        localStorage.setItem("token", token);

        // Trigger update
        setToken(token);
      } catch (error) {
        if (error instanceof ApiClientError) {
          // If API error redirect to the normal username/password login
          setError(error);
          return;
        }

        throw error;
      }
    };

    authenticate();
  }, []);

  // If invalid code redirect to the login page
  if (!code || error) {
    return <Redirect to="/examples/login" />;
  }

  return <p>Authenticating via Google...</p>;
};

export default GoogleCallback;

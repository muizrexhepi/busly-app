import React, { createContext, useContext, useState, useEffect } from "react";
import { Station } from "@/models/station";
import { getStations } from "@/actions/station";

type StationsContextType = {
  stations: Station[];
  loading: boolean;
  error: Error | null;
};

const StationsContext = createContext<StationsContextType>({
  stations: [],
  loading: true,
  error: null,
});

export const useStations = () => {
  const context = useContext(StationsContext);
  if (!context) {
    throw new Error("useStations must be used within a StationsProvider");
  }
  return context;
};

export const StationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch stations")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return (
    <StationsContext.Provider value={{ stations, loading, error }}>
      {children}
    </StationsContext.Provider>
  );
};

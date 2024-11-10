import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Station } from '@/models/station';

// export type Station ={ _id: string; city: string,name:string }

const useRecentStations = (cookieName:string) => {
  const [recentStations, setRecentStations] = useState<Station[]>([]);

  const fetchRecentStations = useCallback(async () => {
    if (!cookieName) {
      return { error: 'No cookie provided!' };
    }
    const storedStations = JSON.parse(await AsyncStorage.getItem(cookieName) || '[]');
    setRecentStations(storedStations || []);
  }, [cookieName]);

  const updateRecentStations = async (newStation:Station) => {
    const storedStations = JSON.parse(await AsyncStorage.getItem(cookieName) || '[]');
    const updatedStations = [
      newStation,
      ...storedStations.filter((station:Station) => station._id !== newStation._id),
    ].slice(0, 5);
    await AsyncStorage.setItem(cookieName, JSON.stringify(updatedStations));
    setRecentStations(updatedStations);
  };

  useEffect(() => {
    fetchRecentStations();
  }, [fetchRecentStations]);

  return { recentStations, updateRecentStations };
};

export default useRecentStations;

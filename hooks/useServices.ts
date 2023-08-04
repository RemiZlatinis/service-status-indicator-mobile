import { useEffect, useState } from 'react';

import { Service } from '../models';
import { getServices } from '../api';

function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>()
  const [serverDisconnected, setServerDisconnected] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setServices(await getServices());
        setLastUpdate(Date.now())
        setServerDisconnected(false)
      } catch (error) {
        console.error("Error fetching services:", error);
        setServerDisconnected(true)
        setServices([])
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return { services, lastUpdate, serverDisconnected }
}

export default useServices;
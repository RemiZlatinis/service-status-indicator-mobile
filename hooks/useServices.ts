import { useEffect, useState } from 'react';

import { Service } from '../models';
import { getServices } from '../api';
import { isServerSet } from '../utils/settingsStorage';

function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>()
  const [serverDisconnected, setServerDisconnected] = useState<boolean>()

  useEffect(() => {
    const fetchData = async () => {
      if (!await isServerSet()) return setServerDisconnected(undefined);

      try {
        setServices(await getServices());
        setLastUpdate(Date.now())
        setServerDisconnected(false)
      } catch (error) {
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
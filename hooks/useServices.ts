import { useEffect, useState } from 'react';

import { Service } from '../models';
import { getServices } from '../api';
import { isServerSet } from '../utils/settingsStorage';

function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverDisconnected, setServerDisconnected] = useState<boolean>()

  useEffect(() => {
    const fetchData = async () => {
      if (!await isServerSet()) return setServerDisconnected(undefined);

      try {
        setLoading(true);
        setServices(await getServices());
        setServerDisconnected(false)
      } catch (error) {
        setServerDisconnected(true)
        setServices([])
      } finally {
        setLoading(false)
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return { services, loading, serverDisconnected }
}

export default useServices;
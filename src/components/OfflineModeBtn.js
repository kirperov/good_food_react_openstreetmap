import { useState, useEffect } from "react";

const OfflineButton = ({ callbackOffline }) => {
const [offlineData, setOfflineData ] = useState(false)

  const handleCheck = () => {
      if(offlineData) {
        window.location.reload();
        setOfflineData(false)
      } else {
        setOfflineData(true)
      }
  };

  useEffect(() => {
    callbackOffline(offlineData);
  }, [offlineData]);

  return (
    <div>
        <input onClick={handleCheck} type="checkbox" id="offlineMode" name="offlineMode" />
        <label htmlFor="offlineMode">Offline</label>
    </div>
  );
};

export default OfflineButton;
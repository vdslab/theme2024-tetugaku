import { useState, useEffect } from "react";
import App from "./App";
import AppFM from "./AppFM";

function AppContainer (){
  const [isMobile, setIsMobile] = useState(window.innerWidth / window.innerHeight < 1);
  useEffect(() => {

    const handleResize = () => {
      setIsMobile(window.innerWidth / window.innerHeight < 1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <AppFM /> : <App />;
};

export default AppContainer;

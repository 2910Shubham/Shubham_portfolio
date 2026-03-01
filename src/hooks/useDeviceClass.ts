import { createContext, createElement, useContext, useEffect, useState } from "react";

export type DeviceClass = "low" | "mid" | "high";

export const DeviceClassContext = createContext<DeviceClass>("high");

type DeviceClassProviderProps = {
  children: React.ReactNode;
};

export function DeviceClassProvider({ children }: DeviceClassProviderProps) {
  const [deviceClass, setDeviceClass] = useState<DeviceClass>("high");

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as any).deviceMemory ?? 4;

    if (coarse || cores <= 2 || memory <= 2) {
      setDeviceClass("low");
      return;
    }

    if (cores <= 4 || memory <= 4) {
      setDeviceClass("mid");
      return;
    }

    setDeviceClass("high");
  }, []);

  return createElement(DeviceClassContext.Provider, { value: deviceClass }, children);
}

export function useDeviceClass(): DeviceClass {
  return useContext(DeviceClassContext);
}

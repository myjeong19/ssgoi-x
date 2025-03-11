import React, { createContext, useContext, useState } from 'react';
import type { TransitionRouteConfig } from '../types';

export const ConfigContext = createContext<
  | {
      config: TransitionRouteConfig | undefined;
      setConfig: (config: TransitionRouteConfig) => void;
    }
  | undefined
>(undefined);

export const ConfigProvider = ({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: TransitionRouteConfig;
}) => {
  const [config, setConfig] = useState<TransitionRouteConfig | undefined>(initialConfig);

  return <ConfigContext.Provider value={{ config, setConfig }}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => {
  const config = useContext(ConfigContext);

  if (!config) {
    throw new Error('ConfigContext not found');
  }

  return config;
};

export const useInitConfig = () => {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error('ConfigContext not found');
  }

  const { setConfig } = context;

  return (newConfig: TransitionRouteConfig) => {
    setConfig(newConfig);
    return newConfig;
  };
};

export const useConfigValue = () => {
  const { config } = useConfig();

  if (!config) {
    throw new Error('Config is not initialized');
  }

  return config;
};

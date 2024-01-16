import React, { createContext, Dispatch, SetStateAction } from "react";

interface PlotViewContextProps {
  activePlotIndex: number | null;
  setActivePlotIndex: Dispatch<SetStateAction<number | null>>;
}

const PlotViewContext = createContext<PlotViewContextProps>({
  activePlotIndex: null,
  setActivePlotIndex: () => {}, // Пустая функция-заглушка
});

export default PlotViewContext;

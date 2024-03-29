// ControlPanel.tsx
import React, { useState } from "react";
// import { FaPlay, FaPause } from "react-icons/fa";

interface ControlPanelProps {
  index: number;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  coordinateSystem: number;
  setCoordinateSystem: (num: number) => void;
  isOrthographicCamera: boolean;
  setOrthographicCamera: (orthographicCamera: boolean) => void;
  isSetTrace: boolean;
  setIsSetTrace: (setTrace: boolean) => void;
  isSpheraVisible: boolean;
  setIsSpheraVisible: (spheraVisible: boolean) => void;
  isCylinders: boolean;
  setIsCylinders: (setCylinders: boolean) => void;
  isGreatCircles: boolean;
  setIsGreatCircles: (setGreatCircles: boolean) => void;

  isQuaternion1Visible: boolean;
  setIsQuaternion1Visible: (setQuaternion1Visible: boolean) => void;
  isQuaternion2Visible: boolean;
  setIsQuaternion2Visible: (setQuatenion2Visible: boolean) => void;
  isResultQuaternionVisible: boolean;
  setIsResultQuaternionVisible: (setResultQuaternionVisible: boolean) => void;

  // isExclusiveViewActive: boolean;
  onToggleExclusiveView: () => void;
  onClearTraces: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  index,
  isRunning,
  setIsRunning,
  coordinateSystem,
  setCoordinateSystem,
  isOrthographicCamera,
  setOrthographicCamera,
  isSetTrace,
  setIsSetTrace,
  isSpheraVisible,
  setIsSpheraVisible,
  isCylinders,
  setIsCylinders,
  isGreatCircles,
  setIsGreatCircles,

  isQuaternion1Visible,
  setIsQuaternion1Visible,
  isQuaternion2Visible,
  setIsQuaternion2Visible,
  isResultQuaternionVisible,
  setIsResultQuaternionVisible,

  // isExclusiveViewActive,
  onToggleExclusiveView,
  onClearTraces,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex items-center">
      {/* Чекбокс для управления эксклюзивным режимом */}
      <div className="flex items-center">
        <label htmlFor={`exclusiveView${index}`} className="text-xs mr-2">
          Exclusive
        </label>
        <input
          id={`exclusiveView${index}`}
          type="checkbox"
          // checked={isExclusiveViewActive}
          onChange={onToggleExclusiveView}
          className="form-checkbox h-4 w-4 mr-4"
        />
      </div>
      {/* Кнопка Run с иконкой
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? <FaPause /> : <FaPlay />}
      </button> */}

      {/* <div className="flex items-center">
        <label htmlFor="exclusiveView" className="text-xs mr-2">
          Exclusive View:
        </label>
        <input
          id="exclusiveView"
          type="checkbox"
          onChange={(e) =>
            setExclusiveView(e.target.checked ? coordinateSystem : null)
          }
          className="form-checkbox h-4 w-4"
        />
      </div> */}

      <div className="flex items-center mr-4">
        <select
          id={`viewSelect${index}`}
          value={coordinateSystem}
          onChange={(e) => setCoordinateSystem(parseInt(e.target.value, 10))}
          className="form-select border border-x-gray-400"
        >
          <option value={0}>Free</option>
          <option value={1}>-&gt; Left</option>
          <option value={2}>-&gt; Right</option>
          <option value={3}>-&gt; Result</option>
        </select>
      </div>

      <div className="flex items-center">
        <label htmlFor={`trace${index}`} className="text-xs mr-2">
          Trace
        </label>
        <input
          id={`trace${index}`}
          type="checkbox"
          checked={isSetTrace}
          onChange={(e) => setIsSetTrace(e.target.checked)}
          className="form-checkbox h-4 w-4 mr-4"
        />
      </div>

      <div className="flex items-center mr-4">
        <button onClick={onClearTraces} className="btn">
          Clear traces
        </button>
      </div>

      <div className="flex items-center">
        <label htmlFor={`cameraType${index}`} className="text-xs mr-2">
          Orthographic
        </label>
        <input
          id={`cameraType${index}`}
          type="checkbox"
          checked={isOrthographicCamera}
          onChange={(e) => setOrthographicCamera(e.target.checked)}
          className="form-checkbox h-4 w-4 mr-4"
        />
      </div>

      {/* Выпадающий список с чекбоксами */}
      <div className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)} className="btn">
          Show
        </button>

        {showDropdown && (
          <div className="absolute border border-gray-300 bg-white p-2">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isQuaternion1Visible}
                  onChange={(e) => setIsQuaternion1Visible(e.target.checked)}
                />
                <span className="ml-2">Quaternion 1</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isQuaternion2Visible}
                  onChange={(e) => setIsQuaternion2Visible(e.target.checked)}
                />
                <span className="ml-2">Quaternion 2</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isResultQuaternionVisible}
                  onChange={(e) =>
                    setIsResultQuaternionVisible(e.target.checked)
                  }
                />
                <span className="ml-2">Result quaternion</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSpheraVisible}
                  onChange={(e) => setIsSpheraVisible(e.target.checked)}
                />
                <span className="ml-2">Sphera</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isCylinders}
                  onChange={(e) => setIsCylinders(e.target.checked)}
                />
                <span className="ml-2">Cylinders</span>
              </label>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isGreatCircles}
                  onChange={(e) => setIsGreatCircles(e.target.checked)}
                />
                <span className="ml-2">Circles</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;

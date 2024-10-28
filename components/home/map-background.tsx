import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, {
  Rect,
  Line,
  Circle,
  Path,
  Text,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

export default function Component() {
  const { width, height } = useWindowDimensions();
  const mapHeight = height * 0.5;

  const gridSize = 40; // Increased grid size
  const gridLines = [];

  // Create diagonal grid lines
  for (let i = -mapHeight; i <= width + mapHeight; i += gridSize) {
    gridLines.push(
      <Line
        key={`d${i}`}
        x1={i}
        y1={0}
        x2={i + mapHeight}
        y2={mapHeight}
        stroke="#c5d1c8"
        strokeWidth="2"
        opacity="0.7"
      />
    );
  }

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: mapHeight,
      }}
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${mapHeight}`}>
        <Defs>
          <LinearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#e8f0eb" stopOpacity="1" />
            <Stop offset="1" stopColor="#e8f0eb" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        <Rect
          x="0"
          y="0"
          width={width}
          height={mapHeight}
          fill="url(#fadeGradient)"
        />
        {gridLines}

        {/* City markers */}
        <Circle cx={width * 0.8} cy={mapHeight * 0.2} r="6" fill="#4fd1c5" />
        <Text
          x={width * 0.8 + 12}
          y={mapHeight * 0.2 + 5}
          fontSize="14"
          fill="#2d3748"
          fontWeight="bold"
        >
          Manchester
        </Text>

        <Circle cx={width * 0.2} cy={mapHeight * 0.8} r="6" fill="#4fd1c5" />
        <Text
          x={width * 0.2 + 12}
          y={mapHeight * 0.8 + 5}
          fontSize="14"
          fill="#2d3748"
          fontWeight="bold"
        >
          Paris
        </Text>

        {/* Route line */}
        <Path
          d={`M ${width * 0.8} ${mapHeight * 0.2} L ${width * 0.2} ${
            mapHeight * 0.8
          }`}
          stroke="#4fd1c5"
          strokeWidth="3"
          strokeDasharray="8,8"
        />
      </Svg>
    </View>
  );
}

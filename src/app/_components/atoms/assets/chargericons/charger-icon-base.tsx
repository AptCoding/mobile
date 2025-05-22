import { SvgXml } from "react-native-svg";

export interface ChargerIconProps {
  style?: object;
  size?: number;
}

const ChargerIconBase = ({
  svgString,
  iconProps: { style, size },
}: {
  svgString: string;
  iconProps: ChargerIconProps;
}) => {
  return (
    <SvgXml
      xml={svgString}
      width={size ? size : "100%"}
      height={size ? size : "100%"}
      style={{ ...style }}
    />
  );
};

export default ChargerIconBase;

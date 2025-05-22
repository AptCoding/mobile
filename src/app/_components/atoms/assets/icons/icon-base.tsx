import { SvgXml } from "react-native-svg";

export interface IconProps {
  style?: object;
  size?: number;
  color?: string;
}

function IconBase({
  svgString,
  iconProps: { style, size, color = "#5D5D5D" },
}: {
  svgString: string;
  iconProps: IconProps;
}) {
  const svg = svgString.replaceAll("[COLOR]", color ? color : "#5D5D5D");
  return (
    <SvgXml
      xml={svg}
      width={size ? size : "100%"}
      height={size ? size : "100%"}
      style={{ ...style }}
    />
  );
}

export default IconBase;

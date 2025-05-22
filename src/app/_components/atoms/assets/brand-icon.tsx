import { SvgXml } from "react-native-svg";

const BrandIcon = ({ style }: { style?: object }) => {
  return (
    <SvgXml
      xml={`
            <svg width="80" height="64" viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_384_9022)">
                <path d="M74.7872 63.1742H54.6528L23.0982 27.7422H61.0048C63.7043 27.7422 65.0541 25.5984 65.0541 21.2976C65.0541 16.9968 63.7043 14.853 61.0114 14.853H15.4163V63.1676H0.634766V0.078125H61.9046C67.5552 0.078125 72.0148 2.28808 75.29 6.70136C78.3204 10.711 79.8356 15.5742 79.8356 21.2976C79.8356 27.021 78.3204 31.8908 75.29 35.8939C72.0148 40.3138 67.5552 42.5171 61.9046 42.5171H56.254L74.7938 63.1676L74.7872 63.1742Z" fill="#D1D1D1" />
            </g>
            <defs>
                <clipPath id="clip0_384_9022">
                <rect width="80" height="64" fill="white" />
                </clipPath>
            </defs>
            </svg>
        `}
      width="100%"
      height="100%"
      style={{ maxHeight: 64, maxWidth: 80, ...style }}
    />
  );
};

export default BrandIcon;

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663123178525/fDCYNs6656b7JMsC7bMdFf/logo_ec5529c5.png";

interface CcpsLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const heightMap = {
  sm: "h-7 md:h-9",
  md: "h-10 md:h-14",
  lg: "h-14 md:h-20",
  xl: "h-20 md:h-28",
};

export function CcpsLogo({ size = "md", className = "" }: CcpsLogoProps) {
  return (
    <img
      src={LOGO_URL}
      alt="CCPS 家慶佳業"
      className={`${heightMap[size]} w-auto object-contain ${className}`}
      draggable={false}
    />
  );
}

import type { Color } from "./color.types";

export const lightToDark = (color: string, limit: number): string[] => {
  const hexToRgb = (hex: string): [number, number, number] => {
    const trimmedHex = hex.replace("#", "");
    const bigint = parseInt(trimmedHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const rgbToHex = (rgb: [number, number, number]): string => {
    const [r, g, b] = rgb;
    const toHex = (c: number): string => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const lightenColor = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = rgb;
    const lightenValue = (value: number): number =>
      Math.round(value + (255 - value) * percent);
    const lightenedRgb: [number, number, number] = [
      lightenValue(r),
      lightenValue(g),
      lightenValue(b),
    ];
    return rgbToHex(lightenedRgb);
  };

  const darkenColor = (hex: string, percent: number): string => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = rgb;
    const darkenValue = (value: number): number => Math.round(value * (1 - percent));
    const darkenedRgb: [number, number, number] = [
      darkenValue(r),
      darkenValue(g),
      darkenValue(b),
    ];
    return rgbToHex(darkenedRgb);
  };

  let maxLighten = 1;
  let maxDarken = 1;
  if (limit % 2 !== 0) {
    maxLighten = 10;
    maxDarken = 10;
  }

  maxLighten = Math.floor(limit / 2);
  maxDarken = Math.floor(limit / 2);

  const colorList: string[] = [];
  const lightenStep = 0.1;
  const darkenStep = 0.1;

  let currentColor = color;

  let i = 0;

  while (currentColor !== "#000000") {
    colorList.push(currentColor);
    currentColor = darkenColor(currentColor, darkenStep);

    i++;
    if (colorList[colorList.length - 1] === colorList[colorList.length - 2]) {
      colorList.pop();
      break;
    }
    if (i > maxDarken) break;
  }

  i = 0;
  
  currentColor = color;
  while (currentColor !== "#000000") {
    currentColor = lightenColor(currentColor, lightenStep);
    colorList.unshift(currentColor);
    i++;
    
    if (colorList[0] === colorList[1]) {
      colorList.shift();
      break;
    }
    if (i >= maxLighten) break;
  }

  return colorList;
};

export const colorInfo = (hexColor: string | null): Color => {
  if (!hexColor) return {
    rgb: "rgb(0, 0, 0)",
    hsl: "hsl(0, 0, 0)",
    hex: "#000000"
  };

  const rgb = hexColor
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
    , (_, r, g, b) => "#" + r + r + g + g + b + b)
    .substring(1)
    .match(/.{2}/g)
    ?.map(x => parseInt(x, 16))
    .join(", ");
  
  const hsl = hexColor
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
    , (_, r, g, b) => "#" + r + r + g + g + b + b)
    .substring(1)
    .match(/.{2}/g)
    ?.map(x => (parseInt(x, 16) / 255).toFixed(3))
    .join(", ");

  return {
    rgb: `rgb(${rgb})`,
    hsl: `hsl(${hsl})`,
    hex: hexColor
  };
}

export const randomColor = (): string => {
  const min = 0x100000;
  const max = 0xffffff;
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  return "#" + random.toString(16);
}
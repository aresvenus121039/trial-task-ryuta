export const formatPercent = (value: number) =>
  value > 0 ? `+${value.toFixed(3)}` : value.toFixed(3);

export const formatNumber = (value: number, precision = 2) => {
  if (value < 1000) {
    return value.toFixed(precision);
  } else if (value < 1000000) {
    return (value / 1000).toFixed(precision) + " K";
  } else if (value < 1000000000) {
    return (value / 1000000).toFixed(precision) + " M";
  } else {
    return (value / 1000000000).toFixed(precision) + "B";
  }
};

export const formatWithCommas = (value: number, precision = 2) => {
  const val =
    Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const updowncheck = (current: string, before: string) => {
  const first = Number(current).toFixed(5)
  const next = Number(before).toFixed(5)
  
  console.log(first, Number(next));
  
  if(first == 0 || first - next == 0){
    return [
      1,
      0
    ]
  }

  const percent = ((Math.abs(first - next) / first) * 100).toFixed(2);

  return [
    first >= next,
    percent
  ]
}
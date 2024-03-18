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
  
  if(first == '0' || first == next){
    return [
      1,
      0
    ]
  }

  const percent = ((Math.abs(Number(first) - Number(next)) / Number(first)) * 100).toFixed(2);

  return [
    first >= next,
    percent
  ]
}

export const objectToTuple = (obj: any) => {
  // Get the keys of the object
  if(obj == null) return;
  const keys = Object.keys(obj);
  
  // Create an array of values using the keys
  const values = keys.map(key => obj[key]);
  
  // Return the array as a tuple
  return values;
}
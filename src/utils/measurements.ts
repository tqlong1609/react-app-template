export const getMeasurementValue = (value: number) => {
  // mmをcmにしてから
  // 少数第二位を四捨五入するために10を一度かけて計算
  // 少数の末尾に0を表示したいためにtoFixedを使用
  return (Math.round((value / 10) * 10) / 10).toFixed(1)
}

export const getMeasurementVolumeValue = (value: number) => {
  // 立法センチメートルに変換してから
  // 少数第二位を四捨五入するために10を一度かけて計算
  // 少数の末尾に0を表示したいためにtoFixedを使用
  return (Math.round((value / 1000) * 10) / 10).toFixed(1)
}

export const isVolume = (name: string) => {
  // MRBではmeasurementのtypeで判断しているが、MBDでは簡略化のためnameで判断
  return name.includes('volume') || name.includes('Volume')
}

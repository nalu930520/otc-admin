
export function queryCountry() {
  return fetch('https://api.mobiapp.cn/public/country').then((response) => { return response.json() })
}
export function queryCurrency() {
  return fetch('https://api.mobiapp.cn/public/currency').then((response) => { return response.json() })
}

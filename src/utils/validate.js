import accountList from './account'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * 判断用户名须为配置文件中的用户名
 */
export function validUsername(str) {
  const valid_map = accountList.map(i => i.name)
  return valid_map.indexOf(str.trim()) >= 0
}

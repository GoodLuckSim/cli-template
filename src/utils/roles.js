import Dao from '@/utils/dao.js'
/**
 * 判断是否是Technical Header用户
 *
 * @export
 * @returns
 */
export function isTechnicalHeader(key) {
  const userInfo = Dao.get('userInfo')
  const roleIds = userInfo && userInfo.roleIds ? userInfo.roleIds : []
  return roleIds.includes('202041')
}

import request from '@/api/request'

// 设备查询
export function queryEquipmentInfo(data) {
  return request({
    url: `/equipmentInfo/query?currentPage=${data.currentPage}&pageSize=${data.pageSize}`,
    method: 'post',
    data
  })
}

// 设备新增
export function addEquipmentInfo(data) {
  return request({
    url: '/equipmentInfo/add',
    method: 'post',
    data
  })
}

// 设备修改
export function editEquipmentInfo(data) {
  return request({
    url: '/equipmentInfo/update',
    method: 'post',
    data
  })
}

// 设备修改
export function deleteEquipmentInfo(data) {
  return request({
    url: `/equipmentInfo/delete?securityCode=${data}`,
    method: 'post'
  })
}

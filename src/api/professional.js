import request from '@/api/request'

// 专业人士查询
export function queryProfessionalInfo(data) {
  return request({
    url: `/recognitionperson/query?currentPage=${data.currentPage}&pageSize=${data.pageSize}`,
    method: 'post',
    data
  })
}

// 专业人士新增
export function addProfessionalInfo(data) {
  return request({
    url: '/recognitionperson/add',
    method: 'post',
    data
  })
}

// 专业人士修改
export function editProfessionalInfo(data) {
  return request({
    url: '/recognitionperson/update',
    method: 'post',
    data
  })
}

// 专业人士删除
export function deleteProfessionalInfo(data) {
  return request({
    url: `/recognitionperson/delete?securityCode=${data}`,
    method: 'post'
  })
}

// 专业人士头像上传
export function uploadImage(data) {
  return request({
    url: '/uploadImage',
    method: 'post',
    data
  })
}

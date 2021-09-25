import request from '@/api/request'

// 美容头查询
export function queryBeautyHeadInfo(data) {
  return request({
    url: `/securitycode/query?currentPage=${data.currentPage}&pageSize=${data.pageSize}`,
    method: 'post',
    data
  })
}

// 美容头新增
export function addBeautyHead(data) {
  return request({
    url: '/securitycode/add',
    method: 'post',
    data
  })
}

// 美容头编辑
export function editBeautyHead(data) {
  return request({
    url: '/securitycode/update',
    method: 'post',
    data
  })
}

// 美容头删除
export function deleteBeautyHead(data) {
  return request({
    url: `/securitycode/delete?securityCode=${data}`,
    method: 'post'
  })
}

// 模板下载
export function downloadTemplate(data) {
  return request({
    url: '/securitycode/downloadTemplate',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}

// 模板导入
export function importTemplate(data) {
  return request({
    url: '/securitycode/excelimport',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

// 文件/图片上传(支持多文件上传)
export function uploadFiles(query) {
  return window.location.origin + '/vn/oss/store/upload'
}

// 或取操作日志
export function getOperationLog(query) {
  return request({
    url: '/f4/api/oms/oms/query/partner/operate/log/by/mobile',
    method: 'post',
    data: query
  })
}


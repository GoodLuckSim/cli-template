// 定义一个获取表单自定义数据的基础类
export function getFormWatches(FormOriginalData, formName) {
  const watches = {}
  const all = funGetWatches(FormOriginalData, [], 'watch')
  all.map((item) => {
    for (const key in item.watch) {
      watches[formName + key] = item.watch[key]
    }
  })
  return watches
}
export function getFormData(FormOriginalData) {
  const obj = {}
  const all = funGetWatches(FormOriginalData, [], 'param')
  all.map((item) => {
    if (item.param) {
      obj[item.param] = item.default === null || item.default === undefined ? '' : item.default
    }
  })
  console.log(obj)
  return obj
}
function funGetWatches(list, arr, type) {
  list.map((item) => {
    if (item.children) {
      return funGetWatches(item.children.column || item.children, arr, type)
    } else {
      if (item[type]) {
        arr.push(item)
      }
    }
  })
  return arr
}

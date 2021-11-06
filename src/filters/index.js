// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'
import store from '@/store'
import { codeMap } from '@/utils/codeMap'
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * 默认 => "dd/mm/yyyy"
 * @param {time} 接受时间戳，日期
 */

export function formatDateId(time, cFormat) {
  const timeZone = store.getters && store.getters.timeZone ? store.getters.timeZone : 7
  const offset_GMT = new Date().getTimezoneOffset()

  if (arguments.length === 0) {
    return null
  }
  if (!time) return '-'

  const format = cFormat || '{d}/{m}/{y}'
  let date

  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (time.toString().length === 10) && (/^[0-9]+$/.test(time))) {
      time = parseInt(time) * 1000
    }
    if ((typeof time === 'string') && (time.toString().length === 13) && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    if ((typeof time === 'string') && time.indexOf('-') > -1) {
      date = new Date(time)
    } else {
      date = new Date(time + offset_GMT * 60 * 1000 + timeZone * 60 * 60 * 1000)
    }
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }

  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][value] }
    return value.toString().padStart(2, '0')
  })
  return CHECKIFVALUEISUNDEFINED(time_str) || ''
}

/**
 * 默认 => "dd/mm/yyyy"
 * @param {num} 格式化币种
 */
/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num, local) {
  return FunCurrency(num, local)
}

export function formatCurrencyNum(num, local) {
  return FunCurrency(num, local)
}
/**
 * 判断是否是数字
 * 如果是脱敏数据直接返回，如***
 * @param {number} num
 */
export function isNum(num, fixedSize) {
  if (num == '***') {
    return num
  }
  if (typeof num !== 'number') {
    num = Number(num)
  }
  return CHECKIFVALUEISNAN(num) ? '-' : num.toFixed(fixedSize || 4)
}
/**
 * 根据字典决定状态对应显示的字段内容
 * @param {type,key} 状态类弄，状态值（比如:policyType,101）
 */

export function dictionaryMatch(key, type, option, defaultData) {
  if (key == '***') {
    return key
  }
  if (!key && defaultData) {
    return defaultData
  }
  if (option) {
    return option[key] ? CHECKIFVALUEISUNDEFINED(option[key]) : '-'
  }
  const dictionaries = codeMap()
  return dictionaries[type] && dictionaries[type][key] ? CHECKIFVALUEISUNDEFINED(dictionaries[type][key]) : '-'
}
export function funGetTime(date, type) {
  return date ? new Date(date).getTime() : ''
}

// 统一货币格式化
function FunCurrency(num, local) {
  const currency = store.getters && store.getters.currency ? store.getters.currency : 'id'
  if ((!num || num == null) && num !== 0) {
    return '-'
  }
  if (num == '***') {
    return num
  }
  if (typeof num !== 'number') {
    num = Number(num)
  }
  const site = {
    'id': 'id-ID',
    'en': 'en-US',
    'zh': 'zh-HK'
  }
  const name = site[currency] || 'en-US'
  return CHECKIFVALUEISNAN(num) ? '-' : num.toLocaleString(name)
}
// 判断键值是否不为NaN
function CHECKIFVALUEISNAN(value) {
  return isNaN(value) || value === undefined
}
// 判断键值是否不为undefined
function CHECKIFVALUEISUNDEFINED(value) {
  return value === undefined ? '-' : value
}

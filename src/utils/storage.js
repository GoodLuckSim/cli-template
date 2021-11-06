/**
 * 本地缓存相关方法
 */

// cookies 操作的相关封装
// 文档可到此查看 https://github.com/js-cookie/js-cookie
const Cookies = {
  converter: function converter() { },
  extend: function extend() {
    let i = 0
    const result = {}
    for (; i < arguments.length; i++) {
      const attributes = arguments[i]
      for (const key in attributes) {
        result[key] = attributes[key]
      }
    }
    return result
  },
  decode: function decode(s) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
  },
  set: function set(key, value, attributes) {
    const self = this
    if (typeof document === 'undefined') {
      return
    }

    // eslint-disable-next-line no-param-reassign
    attributes = self.extend(
      {
        path: '/'
      },
      {},
      attributes
    )

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Number(new Date()) + attributes.expires * 864e5)
    }

    // We're using "expires" because "max-age" is not supported by IE
    attributes.expires = attributes.expires ? attributes.expires.toUTCString() : ''

    try {
      const result = JSON.stringify(value)
      if (/^[\{\[]/.test(result)) {
        // eslint-disable-next-line no-param-reassign
        value = result
      }
    } catch (e) {
      console.log(e)
    }

    // eslint-disable-next-line no-param-reassign
    value = self.converter.write
      ? self.converter.write(value, key)
      : encodeURIComponent(String(value)).replace(
        /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
        decodeURIComponent
      )

    // eslint-disable-next-line no-param-reassign
    key = encodeURIComponent(String(key))
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
      .replace(/[\(\)]/g, escape)

    let stringifiedAttributes = ''
    for (const attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }
      stringifiedAttributes += '; ' + attributeName
      if (attributes[attributeName] === true) {
        continue
      }
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
    }

    // eslint-disable-next-line no-return-assign
    return document.cookie = key + '=' + value + stringifiedAttributes
  },
  _get: function _get(key, json) {
    const self = this
    if (typeof document === 'undefined') {
      return
    }

    const jar = {}
    const cookies = document.cookie ? document.cookie.split('; ') : []
    let i = 0

    for (; i < cookies.length; i++) {
      const parts = cookies[i].split('=')
      let cookie = parts.slice(1).join('=')

      if (!json && cookie.charAt(0) === '"') {
        cookie = cookie.slice(1, -1)
      }
      try {
        const name = self.decode(parts[0])
        cookie = (self.converter.read || self.converter)(cookie, name) || self.decode(cookie)

        if (json) {
          try {
            cookie = JSON.parse(cookie)
          } catch (e) {
            console.log(e)
          }
        }

        jar[name] = cookie

        if (key === name) {
          break
        }
      } catch (e) {
        console.log(e)
      }
    }

    return key ? jar[key] : jar
  },
  get: function get(key) {
    const self = this
    return self._get(key, false /* read as raw */)
  },
  getJSON: function getJSON(key) {
    const self = this
    return self._get(key, true /* read as json */)
  },
  remove: function remove(key, attributes) {
    const self = this
    self.set(
      key,
      '',
      self.extend(attributes, {
        expires: -1
      })
    )
  }
}

// localStorage 封装
const Local = {
  set: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get: function (key) {
    const _key = localStorage.getItem(key) ? localStorage.getItem(key) : 'null'
    return JSON.parse(_key)
  },
  remove: function (key) {
    localStorage.removeItem(key)
  }
}

// sessionStorage 封装
const Session = {
  set: function (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  get: function (key) {
    const _key = Boolean(sessionStorage.getItem(key)) && sessionStorage.getItem(key) !== 'undefined' ? sessionStorage.getItem(key) : 'null'
    return JSON.parse(_key)
  },
  remove: function (key) {
    sessionStorage.removeItem(key)
  },
  clear: function () {
    sessionStorage.clear()
  }
}

export {
  Cookies,
  Local,
  Session
}

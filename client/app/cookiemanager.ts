'use client'
export default class CookieManager {
  static setCookie(name: string, value: string, options: any = {}): void {
    let cookieString = `${name}=${value};`

    if (options.expires) {
      cookieString += `expires=${options.expires.toUTCString()};`
    }

    if (options.path) {
      cookieString += `path=${options.path};`
    }

    document.cookie = cookieString
  }

  static getCookie(name: string): string | undefined {
    const nameEQ = `${name}=`
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return undefined
  }

  static deleteCookie(name: string, options: any = {}): void {
    const cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${
      options.path || '/'
    };`
    document.cookie = cookieString
  }
}

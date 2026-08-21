/** 公共工具函数 */

/**
 * 时间格式化
 * @param input 时间戳 / Date / 可被 Date 解析的字符串
 * @param pattern 格式，默认 YYYY-MM-DD HH:mm:ss
 */
export function formatTime(input?: string | number | Date, pattern = 'YYYY-MM-DD HH:mm:ss'): string {
  if (input === null || input === undefined || input === '') return '-'
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return String(input)
  const pad = (n: number) => String(n).padStart(2, '0')
  const map: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  }
  return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => map[key])
}

const toThailandISOString = (dateStr: string) => {
  const date = new Date(dateStr)

  const fixed = new Date(date.getTime() - date.getTimezoneOffset() * 60000)

  return fixed.toISOString().slice(0, 19)
}

export { toThailandISOString }

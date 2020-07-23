const BASE_URL = process.env.BASE_URL

export const appendBaseURL = (path: string, appendHtmlExtension: boolean) => {
  if (BASE_URL && BASE_URL.length) {
    const { href } = new URL(
      appendHtmlExtension ? `${path}.html` : path,
      BASE_URL
    )
    return href
  }
  return path
}

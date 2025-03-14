import * as HttpUtils from '@/lib/http-utils'

export const searchForFlights = async () => {
    const url = HttpUtils.UrlParamsReplace('/protected')
    return HttpUtils.getWithAuth(url)
}
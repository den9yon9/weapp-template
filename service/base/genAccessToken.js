import regeneratorRuntime from '../../lib/runtime.js'
import wxLogin from './wxLogin'
import ajax from'./ajax'
import env from '../../env.js'

export default async function genAccessToken() {
  let code = await wxLogin()
  let res = await ajax({
    url: `${env.domain}/auth`,
    method: 'POST',
    data: {
      code,
      prog_name: "default"
    }
  })
  return res.data.access_token
}
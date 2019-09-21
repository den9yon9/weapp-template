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
  if(res.status!=='ok')throw new Error(res.message)
  return res.data.access_token
}
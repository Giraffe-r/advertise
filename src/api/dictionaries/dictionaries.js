import request from '@/utils/request'

const api_name = '/template/dictionaries'

export default {

  getAllDict() {
    return request({
      url: `${api_name}/getAllDict`,
      method: 'get'
    })
  },
  getSchema() {
    return request({
      url: `${api_name}/getSchema`,
      method: 'get'
    })
  },
  updateSchema(schema) {
    return request({
      url: `${api_name}/updateSchema/${schema}`,
      method: 'post'
    })
  },
}

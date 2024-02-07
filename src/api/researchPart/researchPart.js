import request from '@/utils/request'

const api_name = '/template/researchPart'

export default {

  getList() {
    return request({
      url: `${api_name}/all`,
      method: 'get'
    })
  },
}

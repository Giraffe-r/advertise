import request from '@/utils/request'

const api_name = '/template/personnel'

export default {

  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/getPersonnelById/${id}`,
      method: 'get'
    })
  },

  save(user) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: user
    })
  },

  updateById(user) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: user
    })
  },
  getAssign(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },
  saveAssign(userId, roleId) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: { userId, roleId }
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  removeRows(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  },
  onWall(multipleSelection) {
    return request({
      url: `${api_name}/onWall`,
      method: 'post',
      data: multipleSelection
    })
  },
  offWall(multipleSelection) {
    return request({
      url: `${api_name}/offWall`,
      method: 'post',
      data: multipleSelection
    })
  },
  onWallOne(id) {
    return request({
      url: `${api_name}/onWallOne/${id}`,
      method: 'post',
    })
  },
  offWallOne(id) {
    return request({
      url: `${api_name}/offWallOne/${id}`,
      method: 'post',
    })
  },
  offWallAll() {
    return request({
      url: `${api_name}/offWallAll`,
      method: 'post'
    })
  },
  updateFixedMode(id) {
    return request({
      url: `${api_name}/updateFixedMode/${id}`,
      method: 'post',
    })
  },
  getFullRoration(page, limit) {
    return request({
      url: `${api_name}/getFullRoration/${page}/${limit}`,
      method: 'get'
    })
  },
  getOnWall(page, limit) {
    return request({
      url: `${api_name}/getOnWall/${page}/${limit}`,
      method: 'get'
    })
  },
  upPlayVideo(id) {
    return request({
      url: `${api_name}/upPlayVideo/${id}`,
      method: 'post',
    })
  },
  downPlayVideo(id) {
    return request({
      url: `${api_name}/downPlayVideo/${id}`,
      method: 'post',
    })
  },
  playVideoOne(id) {
    return request({
      url: `${api_name}/playVideoOne/${id}`,
      method: 'post',
    })
  },
  cancelPlayVideoOne(id) {
    return request({
      url: `${api_name}/cancelPlayVideoOne/${id}`,
      method: 'post',
    })
  },
  cancelPlayVideoAll() {
    return request({
      url: `${api_name}/cancelPlayVideoAll`,
      method: 'post'
    })
  },
  getPlayVideoAcademician(page, limit) {
    return request({
      url: `${api_name}/getPlayVideoAcademician/${page}/${limit}`,
      method: 'get'
    })
  },
}

import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/restaurant/get',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/restaurant/add',
    method: 'post',
    data
  })
}

export function upd(data) {
  return request({
    url: '/restaurant/upd',
    method: 'post',
    data
  })
}

export function addScore(data) {
  return request({
    url: '/scoring/add',
    method: 'post',
    data
  })
}
export function getScore() {
  return request({
    url: '/scoring/get',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: `/restaurant/del/${id}`,
    method: 'delete'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

const api_name = '/api/socket'

export default {

    displayVideo(id) {
        return request({
            url: `${api_name}/displayVideo/${id}`,
            method: 'get',
            // params:{academicianId}
        })
    },
    changeSchema(schema){
        
        return request({
            url: `${api_name}/changeSchema/${schema}`,
            method: 'get',
        })
    }
}

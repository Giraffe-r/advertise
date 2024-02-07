<template>
    <div class="app-container">
        <el-row>
            <!-- 一键上墙 -->
            <el-col :span="2" style="text-align: right; padding-right: 2%;">
                <el-button disabled>模式选择</el-button>
                <!-- <p style="font-size: 30;">展示方式</p> -->
            </el-col>
            <!--查询表单-->
            <el-col :span="14">
                <el-button type="primary" :plain="btn1" @click="btn1Click">人员展示</el-button>
                <el-button type="primary" :plain="btn2" @click="btn2Click">图片展示</el-button>
                <el-button type="primary" :plain="btn3" @click="btn3Click">视频展示</el-button>
            </el-col>
            <el-col :span="3">
                <div style="text-align: right;">
                    <!-- <el-button type="success" @click="addAcademician()" v-if="hasPerm('academician.add')">添加院士</el-button> -->
                </div>
            </el-col>

        </el-row>
        
        <el-divider content-position="center"></el-divider>
        <el-row>
            <el-button disabled>上屏内容</el-button>
        </el-row>
        <el-table v-loading="listLoading" :data="list" stripe style="width: 100%">

            <el-table-column label="序号" width="70" align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column v-if="schema === '1'" prop="name" label="姓名" width="150" />
            <el-table-column v-if="schema === '2'" prop="name" label="图片名称" width="150" />
            <el-table-column v-if="schema === '3'" prop="name" label="视频名称" width="150" />

            <el-table-column v-if="schema === '1'" prop="research" label="部门" />
            <el-table-column label="简介">
                <template slot-scope="scope">
                    <span v-if="scope.row.description && scope.row.description.length <= 100">
                        {{ scope.row.description }}
                    </span>
                    <span v-if="scope.row.description && scope.row.description.length > 100">
                        {{ scope.row.description.substr(0, 100) + "..." }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column v-if="schema === '1'" label="头像">
                <template slot-scope="scope">
                    <img :src="BASE_API+'/img/' + scope.row.imgSrc + '.jpg'" shape="square" height="100" />
                </template>
            </el-table-column>


            <el-table-column v-if="schema === '2'" label="图片">
                <template slot-scope="scope">
                    <img :src="BASE_API+'/img/' + scope.row.imgSrc + '.jpg'" shape="square" height="100" />
                </template>
            </el-table-column>
            
            <el-table-column v-if="schema === '3'"  label="视频">
                <template slot-scope="scope">
                    <!-- <img :src="BASE_API + '/img/' + scope.row.imgSrc + '.jpg'" shape="square" height="100" /> -->
                    <video width="320" height="240" controls>
                        <!-- <source :src="BASE_API + '/video/video.mp4'" type="video/mp4"> -->
                        <source :src="'http://localhost:8001/template/video/video/'+scope.row.videoSrc"  type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <!-- <video :="" -->
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="cancelPlayVideoOne(scope.row.id)">移除</el-button>
                </template>
            </el-table-column> -->
        </el-table>

        <el-pagination :current-page="page" :total="total" :page-size="limit" :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            style="padding: 30px 0; text-align: center;" layout="sizes, prev, pager, next, jumper, ->, total, slot"
            @current-change="fetchData" @size-change="changeSize" />
    </div>
</template>
  
<script>
import academician from '@/api/academician/academician'
import personnelApi from '@/api/personnel/personnel'
import pictureApi from '@/api/picture/picture'
import videoApi from '@/api/video/video'
import messageApi from '@/api/websocket/message'
import researchPartApi from '@/api/researchPart/researchPart'
import dictionariesApi from '@/api/dictionaries/dictionaries'

export default {
    data() {
        return {
            BASE_API: null,
            listLoading: true, // 数据是否正在加载
            list: null, // 所有院士列表
            total: 0, // 数据库中的总记录数
            page: 1, // 默认页码
            limit: 5, // 每页记录数
            searchObj: {}, // 查询表单对象
            multipleSelection: [], // 批量选择中选择的记录列表
            centerDialogVisible: false,
            academicianForUpdate: {},
            researchPart: {},//研究部门

            btn1: false,//全部轮播按钮是否为朴素按钮
            btn2: false,//部分轮播（图片）按钮是否为朴素按钮
            btn3: false,//部分轮播（视频）按钮是否为朴素按钮

            schema: 1,//模式选择

        }
    },

    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
        this.BASE_API = process.env.BASE_API
        //   console.log('list created......')
        this.getSchema()
        this.fetchData()
        this.listLoading = false
        console.log(this.searchObj)
    },

    // 生命周期函数：内存准备完毕，页面渲染成功
    mounted() {
        console.log('list mounted......')
    },

    methods: {
        
        changeSize(size) {
            console.log(size)
            this.limit = size   
            this.fetchData()
        },
        getSchema(){
            dictionariesApi.getSchema().then(response =>{
                this.schema = response.data.schema
                console.log(this.schema)
                if(this.schema === "1"){
                    this.btn1 = false
                    this.btn2 = true
                    this.btn3 = true
                }else if(this.schema === "2"){
                    this.btn1 = true
                    this.btn2 = false
                    this.btn3 = true
                }else if(this.schema === "3"){
                    this.btn1 = true
                    this.btn2 = true
                    this.btn3 = false
                }
                this.fetchData();
            })
        },
        fetchData(page = 1){
            this.page = page
            switch(this.schema){
                case "1": this.fetchData1(page);break;
                case "2": this.fetchData2(page);break;
                case "3": this.fetchData3(page);break;
            }
        },
        
        //获取人员展示数据
        fetchData1(page = 1) {
            console.log('翻页。。。' + page)
            // 异步获取远程数据（ajax）
            this.page = page
            personnelApi.getOnWall(this.page, this.limit).then(response =>{
                
                this.list = response.data.items
                    this.total = response.data.total
                    // 数据加载并绑定成功
                    this.listLoading = false
            })
        },

        //获取图片展示数据
        fetchData2(page = 1) {
            console.log('翻页。。。' + page)
            // 异步获取远程数据（ajax）
            this.page = page
            pictureApi.getOnWall(this.page, this.limit).then(
                response => {
                    this.list = response.data.items
                    this.total = response.data.total

                    // 数据加载并绑定成功
                    this.listLoading = false
                }
            )
        },
        
        //获取视频展示数据
        fetchData3(page = 1) {
            console.log('翻页。。。' + page)
            // 异步获取远程数据（ajax）
            this.page = page
            videoApi.getOnWall(this.page, this.limit).then(
                response => {
                    this.list = response.data.items
                    this.total = response.data.total

                    // 数据加载并绑定成功
                    this.listLoading = false
                }
            )
        },

        //按钮一事件
        btn1Click(){
            this.btn1 = false;
            this.btn2 = true;
            this.btn3 = true;
            this.schema = "1";
            //切换模式
            dictionariesApi.updateSchema(this.schema).then(response =>{
                this.fetchData()
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '模式切换成功!'
                    })
                }
            })
            //发通知
            this.sendMessage()
        },

        //按钮二事件
        btn2Click(){
            this.btn1 = true;
            this.btn2 = false;
            this.btn3 = true;
            this.schema = "2";
            dictionariesApi.updateSchema(this.schema).then(response =>{
                this.fetchData()
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '模式切换成功!'
                    })
                }
            })  
            this.sendMessage()
        },

        //按钮三事件
        btn3Click(){
            this.btn1 = true;
            this.btn2 = true;
            this.btn3 = false;
            this.schema = "3";
            dictionariesApi.updateSchema(this.schema).then(response =>{
                this.fetchData()
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '模式切换成功!'
                    })
                }
            })
            this.sendMessage()
        },

        //发通知
        sendMessage(){
            messageApi.changeSchema(this.schema).then(response => {
                console.log(response.data)
            }).catch(response => {
                console.log(response)
            })

        }

    }
}
</script>

  
  
<template>
    <div class="app-container" style="background-color:#F0F1F6;">
        <div style="text-align: center;background-color: white;">

            <el-row>
                <el-col style="text-align: left;padding-top: 0.5%;padding-left: 0.5%;">
                    <i class="el-icon-tickets" style="font-size: medium;">院士选择</i>

                </el-col>
            </el-row>
            <el-row>
                <!-- 一键上墙 -->
                <el-col :span="4">
                    <!-- <el-button type="primary" @click="onWall()">一键上墙</el-button>
                <el-button type="primary" @click="offWall()">取消上墙</el-button> -->
                </el-col>
                <!--查询表单-->
                <el-col :span="22">
                    <div style="text-align: center;">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item style="align: right;">
                                <el-input v-model="searchObj.name" placeholder="院士名" />
                            </el-form-item>
                            <el-form-item>
                                <el-date-picker v-model="searchObj.selectionDate" type="year" value-format="yyyy-MM-dd"
                                    placeholder="选择年">
                                </el-date-picker>
                                <!-- <el-input v-model="searchObj.selectionDate" placeholder="年份" /> -->
                            </el-form-item>
                            <el-form-item>
                                <!-- <el-input v-model="searchObj.research" placeholder="学部" /> -->
                                <el-select v-model="searchObj.research" placeholder="学部">
                                    <el-option v-for="item in researchPart" :key="item.name" :label="item.name"
                                        :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-button type="primary" icon="el-icon-search" @click="fetchDataTable1()">查询</el-button>
                            <el-button type="default" @click="resetData()">清空</el-button>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div style="text-align: right;">
                        <!-- <el-button type="success" @click="addAcademician()" v-if="hasPerm('academician.add')">添加院士</el-button> -->
                    </div>
                </el-col>

            </el-row>
            <!-- 工具条 -->
            <!-- <div>
            <el-button type="danger" size="mini" @click="addacademician()" v-if="hasPerm('academician.add')">添加</el-button>
            <el-button type="danger" size="mini" @click="removeRows()" v-if="hasPerm('academician.remove')">批量删除</el-button>
        </div> -->

            <!-- 院士列表 -->
            <!-- <el-table v-loading="listLoading" :data="list" stripe style="width: 100%" > -->
            <el-table v-loading="listLoading" :data="list" style="width: 100%" @selection-change="handleSelectionChange">


                <el-table-column label="序号" width="70" align="center">
                    <template slot-scope="scope">
                        {{ (page - 1) * limit + scope.$index + 1 }}
                    </template>
                </el-table-column>

                <el-table-column label="状态" width="70" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.playVideo === 1 ? "已轮播" : "未轮播" }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="院士名" width="150" />

                <!-- <el-table-column prop="type" label="院士类型" /> -->
                <el-table-column label="院士类型">
                    <template slot-scope="scope">
                        {{ scope.row.type === 1 ? "中国工程院院士" : "中国科学院院士" }}
                    </template>
                </el-table-column>
                <el-table-column prop="research" label="研究方向" />
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
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <!-- <img :src="'192.168.31.124:8001/img/'+scope.row.imgSrc" shape="square" :size="100" /> -->
                        <img :src="BASE_API+'/img/' + scope.row.imgSrc + '.jpg'" shape="square" height="100" />
                        <!-- <img :src="require(`@/assets/jpg0171136533855.jpg`)" shape="square" height="100" /> -->
                    </template>
                </el-table-column>


                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="playVideoOne(scope.row.id)">添加</el-button>
                        <!-- <el-button type="success" size="mini" @click="displayVideo(scope.row.id)">播放视频</el-button>
                    <el-button type="primary" size="mini" @click="showUpdateDialog(scope.row.id)">编辑简介</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete"
                        @click="removeDataById(scope.row.id)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="修改简介" :visible.sync="centerDialogVisible" width="30%" center>
                <span>
                    <el-input type="textarea" :rows="10" placeholder="请输入简介" v-model="academicianForUpdate.description">
                    </el-input>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateAcademician()">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分页组件 -->
            <el-pagination :current-page="page" :total="total" :page-size="limit" :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                style="padding: 30px 0; text-align: center;" layout=" prev, pager, next, jumper, ->, total, slot"
                @current-change="fetchDataTable1" @size-change="changeSize" />

        </div>

        <el-divider></el-divider>

        <div style="text-align: center;background-color: white; padding-top: 1%;">

            <el-row>

                <el-col :span="4" style="text-align: left;padding-top: 0.5%;padding-left: 0.5%;">
                    <i class="el-icon-document-checked" style="font-size: medium;">已选择</i>

                </el-col>
                <el-col :span="18" style="text-align: right;">
                    <!-- <el-button type="primary" @click="onWall()">一键上墙</el-button> -->
                    <el-button type="danger" @click="cancelPlayVideoAll()">全部清空</el-button>
                </el-col>
                <el-col :span="4"></el-col>
            </el-row>
            <el-table v-loading="listLoading2" :data="list2" stripe style="width: 100%">

                <el-table-column label="序号" width="70" align="center">
                    <template slot-scope="scope">
                        {{ (page - 1) * limit + scope.$index + 1 }}
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="院士名" width="150" />

                <!-- <el-table-column prop="type" label="院士类型" /> -->
                <el-table-column label="院士类型">
                    <template slot-scope="scope">
                        {{ scope.row.type === 1 ? "中国工程院院士" : "中国科学院院士" }}
                    </template>
                </el-table-column>
                <el-table-column prop="research" label="研究方向" />
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
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <!-- <img :src="'192.168.31.124:8001/img/'+scope.row.imgSrc" shape="square" :size="100" /> -->
                        <img :src="BASE_API+'/img/' + scope.row.imgSrc + '.jpg'" shape="square" height="100" />
                        <!-- <img :src="require(`@/assets/jpg0171136533855.jpg`)" shape="square" height="100" /> -->
                    </template>
                </el-table-column>


                <el-table-column label="操作" width="300" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="upPlayVideo(scope.row.id)">上移</el-button>
                        <el-button type="primary" size="mini" @click="downPlayVideo(scope.row.id)">下移</el-button>
                        <el-button type="danger" size="mini" @click="cancelPlayVideoOne(scope.row.id)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination :current-page="page2" :total="total2" :page-size="limit2"
                :page-sizes="[5, 10, 20, 30, 40, 50, 100]" style="padding: 30px 0; text-align: center;"
                layout=" prev, pager, next, jumper, ->, total, slot" @current-change="fetchDataPlayVideoTable"
                @size-change="changeSize2" />
        </div>
    </div>
</template>
  
<script>
import academician from '@/api/academician/academician'
import messageApi from '@/api/websocket/message'
import researchPartApi from '@/api/researchPart/researchPart'

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

            listLoading2: true, // 数据是否正在加载
            list2: null, // 轮播视频院士列表
            total2: 0, // 数据库中的总记录数
            page2: 1, // 默认页码
            limit2: 5, // 每页记录数
        }
    },

    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
        //   console.log('list created......')
        this.BASE_API = process.env.BASE_API
        this.fetchData()
        this.fetchDataPlayVideoTable()
        this.listLoading = false
        console.log(this.searchObj)
    },

    // 生命周期函数：内存准备完毕，页面渲染成功
    mounted() {
        console.log('list mounted......')
    },

    methods: {

        // 当页码发生改变的时候
        changeSize(size) {
            console.log(size)
            this.limit = size
            this.fetchDataTable1(1)
        },
        changeSize2(size) {
            console.log(size)
            this.limit = size
            this.fetchDataPlayVideoTable(1)
        },

        //添加院士
        addAcademician() {
            this.$router.push({ path: '/academician/academician/add' })
        },

        //播放视频
        displayVideo(id) {
            console.log(id)
            // this.academician.
            messageApi.displayVideo(id).then(response => {
                console.log(response.data)
            }).catch(response => {
                console.log(response)
            })
        },
        
        //上移视频
        upPlayVideo(id) {
            academician.upPlayVideo(id).then(response => {
                console.log(response.data)
                this.fetchDataPlayVideoTable(this.page2)
            }).catch(response => {
                console.log(response)
            })
        },

        //下移视频
        downPlayVideo(id) {
            academician.downPlayVideo(id).then(response => {
                console.log(response.data)
                this.fetchDataPlayVideoTable(this.page2)
            }).catch(response => {
                console.log(response)
            })
        },

        //弹出提示框
        showUpdateDialog(id) {
            this.centerDialogVisible = true;
            academician.getById(id).then(response => {
                this.academicianForUpdate = response.data.academician;
            })
        },

        fetchDataTable1(page = 1) {
            console.log('翻页。。。' + page)
            // 异步获取远程数据（ajax）
            this.page = page

            academician.getPageList(this.page, this.limit, this.searchObj).then(
                response => {
                    this.list = response.data.items
                    this.total = response.data.total

                    // 数据加载并绑定成功
                    this.listLoading = false
                }
            )
        },
        fetchDataPlayVideoTable(page = 1) {
            console.log('翻页。。。' + page)
            // 异步获取远程数据（ajax）
            this.page2 = page
            academician.getPlayVideoAcademician(this.page2, this.limit2).then(
                response => {
                    this.list2 = response.data.items
                    this.total2 = response.data.total

                    // 数据加载并绑定成功
                    this.listLoading2 = false
                }
            )
        },
        // 加载讲师列表数据
        fetchData(page = 1) {
            console.log('翻页。。。' + page)
            // 异步获取远程数据（ajax）
            // this.page = page

            // academician.getPageList(this.page, this.limit, this.searchObj).then(
            //     response => {
            //         this.list = response.data.items
            //         this.total = response.data.total

            //         // 数据加载并绑定成功
            //         this.listLoading = false
            //     }
            // )

            //获取研究部门
            researchPartApi.getList().then(response => {
                this.researchPart = response.data.list;
                console.log(this.researchPart)
            })
        },

        // 重置查询表单
        resetData() {
            console.log('重置查询表单')
            this.searchObj = {}
            this.fetchData()
        },

        // 根据id删除数据
        removeDataById(id) {
            // debugger
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // promise
                // 点击确定，远程调用ajax
                return academician.removeById(id)
            }).then((response) => {
                this.fetchData(this.page)
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },

        // 当表格复选框选项发生变化的时候触发
        handleSelectionChange(selection) {
            console.log('handleSelectionChange......')
            console.log(selection)
            this.multipleSelection = selection
        },

        //一键上墙
        onWall() {
            if (this.multipleSelection.length > 0) {
                academician.onWall(this.multipleSelection).then(response => {
                    this.fetchData(this.page)
                    if (response.success) {
                        this.$message({
                            type: 'success',
                            message: '上墙成功!'
                        })
                    }
                })
            } else {
                this.$message({
                    type: 'info',
                    message: '请勾选要上墙的院士'
                })
            }
        },

        //取消上墙
        offWall() {
            if (this.multipleSelection.length > 0) {
                academician.offWall(this.multipleSelection).then(response => {

                    this.fetchData(this.page)
                    if (response.success) {
                        this.$message({
                            type: 'success',
                            message: '取消上墙成功!'
                        })
                    }
                })
            } else {
                this.$message({
                    type: 'info',
                    message: '请勾选要取消上墙的院士'
                })
            }

        },



        //添加轮播视频
        playVideoOne(id) {
            academician.playVideoOne(id).then(response => {
                this.fetchDataPlayVideoTable(this.page2)
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '添加轮播视频成功!'
                    })
                }
            })
        },

        //取消上墙一位
        cancelPlayVideoOne(id) {
            academician.cancelPlayVideoOne(id).then(response => {

                this.fetchDataPlayVideoTable(this.page2)
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '取消轮播视频成功!'
                    })
                }
            })

        },
        //全部取消轮播
        cancelPlayVideoAll() {
            academician.cancelPlayVideoAll().then(response => {
                this.fetchDataPlayVideoTable(this.page)
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '全部取消轮播视频成功!'
                    })
                }
            })

        },
        // 批量删除
        removeRows() {
            console.log('removeRows......')

            if (this.multipleSelection.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择要删除的记录!'
                })
                return
            }

            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // promise
                // 点击确定，远程调用ajax
                // 遍历selection，将id取出放入id列表
                var idList = []
                this.multipleSelection.forEach(item => {
                    idList.push(item.id)
                    // console.log(idList)
                })
                // 调用api
                return academician.removeRows(idList)
            }).then((response) => {
                this.fetchData(this.page)
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },

        // 执行搜索
        // queryString：文本框中输入的值
        // cb：一个函数
        querySearch(queryString, cb) {
            console.log(queryString)
            console.log(cb)

            // teacher.selectNameByKey(queryString).then(response => {
            //   // 调用 callback 返回建议列表的数据
            //   cb(response.data.items)
            // })
        }
    }
}
</script>

  
  
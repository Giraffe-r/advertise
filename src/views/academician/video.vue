<template>
    <div class="app-container">
        <!-- 查询表单 -->
        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input v-model="searchObj.name" placeholder="院士名" />
            </el-form-item>

            <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>

        <!-- 工具条 -->
        <div>
            <el-button type="danger" size="mini" @click="addacademician()" v-if="hasPerm('academician.add')">添加</el-button>
            <el-button type="danger" size="mini" @click="removeRows()" v-if="hasPerm('academician.remove')">批量删除</el-button>
        </div>

        <!-- 院士列表 -->
        <el-table v-loading="listLoading" :data="list" stripe style="width: 100%" >
        <!-- <el-table v-loading="listLoading" :data="list" stripe style="width: 100%" @selection-change="handleSelectionChange"> -->

            <!-- <el-table-column type="selection" width="55" /> -->

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
            <el-table-column prop="description" label="简介" />
            <el-table-column label="头像" >
                <template slot-scope="scope">
                    <!-- <img :src="'192.168.31.124:8001/img/'+scope.row.imgSrc" shape="square" :size="100" /> -->
                    <img :src="BASE_API+'/img/'+scope.row.imgSrc" shape="square" height="100" />
                </template>
            </el-table-column>


            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                        @click="showUpdateDialog(scope.row.id)">修改</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete"
                        @click="removeDataById(scope.row.id)">删除</el-button>
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
            style="padding: 30px 0; text-align: center;" layout="sizes, prev, pager, next, jumper, ->, total, slot"
            @current-change="fetchData" @size-change="changeSize" />
    </div>
</template>
  
<script>
import academician from '@/api/academician/academician'

export default {
    data() {
        return {
            BASE_API: null,
            listLoading: true, // 数据是否正在加载
            list: null, // 讲师列表
            total: 0, // 数据库中的总记录数
            page: 1, // 默认页码
            limit: 10, // 每页记录数
            searchObj: {}, // 查询表单对象
            multipleSelection: [], // 批量选择中选择的记录列表
            centerDialogVisible: false,
            academicianForUpdate: {},
        }
    },

    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
        //   console.log('list created......')
        this.BASE_API = process.env.BASE_API
        this.fetchData()
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
            this.fetchData(1)
        },

        addacademician() {
            this.$router.push({ path: '/template/academician/add' })
        },

        //弹出提示框
        showUpdateDialog(id) {
            this.centerDialogVisible = true;
            academician.getById(id).then(response => {
                this.academicianForUpdate = response.data.academician;
            })
        },

        //修改简介
        updateAcademician() {
            academician.updateById(this.academicianForUpdate).then((response) => {
                this.fetchData(this.page)
                if (response.success) {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '修改失败'
                })
            })
            this.centerDialogVisible = false
        },


        // 加载讲师列表数据
        fetchData(page = 1) {
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
  
  
  
<template>
  <div class="beauty-head">
    <div class="main-content">
      <div class="header-filter">
        <div class="filter-item">
          <div class="label">防伪码</div>
          <el-input v-model="filter.code" placeholder="请输入" class="common-input" clearable />
        </div>
        <div class="filter-item">
          <div class="label">启用状态</div>
          <el-select v-model="filter.deleteFlag" placeholder="请选择" class="common-select" clearable>
            <el-option label="已启用" :value="0" />
            <el-option label="已禁用" :value="1" />
          </el-select>
        </div>
        <div class="filter-item">
          <el-button type="primary" class="common-primary-btn search-btn" @click="handleSearch">查询</el-button>
        </div>
      </div>
      <div class="table-content">
        <div class="operate-box">
          <el-button size="mini" icon="el-icon-circle-plus" type="primary" @click="handleAddDialogOpen">新增美容头</el-button>
          <el-button size="mini" icon="el-icon-upload" type="success" @click="handleImportDialogOpen">批量导入</el-button>
          <el-button size="mini" icon="el-icon-download" type="text" class="download-btn" @click="downloadTemplate">下载模板</el-button>
        </div>
        <div class="table-box">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            height="100%"
            stripe
            border
            class="common-table"
          >
            <el-table-column
              type="index"
              label="#"
              width="50"
              class-name="index-col"
            />
            <el-table-column
              prop="code"
              label="防伪码"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              prop="queryCount"
              label="查询次数"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              prop="deleteFlag"
              label="启用状态"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.deleteFlag === 0 ? '已启用': '已禁用' }}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="140"
              class-name="operate-col"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.deleteFlag === 0"
                  type="text"
                  icon="el-icon-circle-close"
                  @click="handleDisabled(scope.row)"
                >
                  禁用
                </el-button>
                <el-button
                  v-if="scope.row.deleteFlag === 1"
                  type="text"
                  icon="el-icon-circle-check"
                  @click="handleDisabled(scope.row)"
                >
                  启用
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-box">
          <el-pagination
            :current-page.sync="currentPage"
            :page-size.sync="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      title="新增美容头"
      :visible.sync="addDialogVisible"
      :before-close="handleAddDialogClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="common-dialog"
      width="660px"
    >
      <div class="dialog-item" :class="{'error-item': errorItem === 'code'}">
        <div class="label">
          <i>*</i>
          防伪码
        </div>
        <el-input v-model="addObj.code" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item">
        <div class="label">
          <i>*</i>
          启用状态
        </div>
        <el-switch v-model="addObj.deleteFlag" :active-value="0" :inactive-value="1" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialogClose">取 消</el-button>
        <el-button :loading="addLoading" type="primary" @click="handleAddDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量导入弹窗 -->
    <el-dialog
      title="批量导入"
      :visible.sync="importDialogVisible"
      :before-close="handleImportDialogClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="common-dialog"
      width="660px"
    >
      <div class="dialog-item" style="padding-bottom: 20px">
        <div class="label">
          <i>*</i>
          选择文件
        </div>
        <el-upload
          class="import-input"
          action=""
          :auto-upload="false"
          :multiple="false"
          :show-file-list="false"
          :on-change="handleImportChange"
          accept=".xls, .xlsx"
        >
          <el-input v-model="fileName" placeholder="请选择文件" class="common-input dialog-input" :title="fileName" readonly />
          <div slot="tip" class="el-upload__tip">请上传xls、xlsx格式的文件, 且文件大小不超过5M！</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleImportDialogClose">取 消</el-button>
        <el-button :loading="importLoading" type="primary" @click="handleImportDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryBeautyHeadInfo, addBeautyHead, editBeautyHead, deleteBeautyHead, downloadTemplate, importTemplate } from '@/api/beautyHead'
export default {
  name: 'BeautyHead',
  data() {
    return {
      filter: {
        code: '',
        deleteFlag: ''
      },
      tableLoading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      tableData: [],
      addDialogVisible: false, // 新增美容头弹窗显隐
      addObj: {
        code: '', // 防伪码
        deleteFlag: 1 // 启用状态
      },
      addLoading: false, // 新增确认按钮的loading
      errorItem: '', // 验证失败的参数
      importDialogVisible: false, // 批量导入弹窗显隐
      fileName: '', // 导入文件名
      flie: null, // 导入文件
      importLoading: false // 导入确认按钮的loading
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    // 每页条数改变
    handleSizeChange() {
      this.getTableData()
    },
    // 当前页改变
    handleCurrentChange() {
      this.getTableData()
    },
    // 查询按钮点击
    handleSearch() {
      this.currentPage = 1
      this.getTableData()
    },
    // 获取表格数据
    getTableData() {
      this.tableLoading = true
      const { code, deleteFlag } = this.filter
      const params = {
        code,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      if (deleteFlag !== '') {
        params.deleteFlag = deleteFlag
      }
      queryBeautyHeadInfo(params).then(res => {
        if (res.data.errorType === '00000000') {
          const data = res.data.content || {}
          this.tableData = data.list || []
          this.total = data.total || 0
        } else {
          this.tableData = []
          this.total = 0
        }
        this.tableLoading = false
        this.$forceUpdate()
      }).catch(() => {
        this.tableData = []
        this.total = 0
        this.tableLoading = false
      })
    },
    // 打开新增弹窗
    handleAddDialogOpen() {
      this.addDialogVisible = true
      this.addObj = {
        code: '',
        deleteFlag: 1
      }
    },
    // 关闭新增弹窗
    handleAddDialogClose() {
      this.addDialogVisible = false
      this.errorItem = ''
    },
    // 新增确认
    handleAddDialogConfirm() {
      this.validateField(this.addObj)
      if (!this.errorItem) {
        this.addLoading = true
        const { code, deleteFlag } = this.addObj
        const params = { code, deleteFlag }
        addBeautyHead(params).then(res => {
          if (res.data.errorType === '00000000' && res.data.success) {
            this.$message({
              type: 'success',
              message: res.data.content || '新增美容头成功！'
            })
            this.getTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.content || '新增美容头失败，请稍后重试！'
            })
          }
          this.addDialogVisible = false
          this.addLoading = false
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '新增美容头失败，请稍后重试！'
          })
          this.addDialogVisible = false
          this.addLoading = false
        })
      }
    },
    // 新增的效验
    validateField(obj) {
      const { code } = obj
      this.errorItem = ''
      if (!code) {
        this.$message({
          type: 'error',
          message: '防伪码不能为空！'
        })
        this.errorItem = 'code'
        return false
      }
    },
    // 是否启用或禁用
    handleDisabled(item) {
      const { code, deleteFlag } = JSON.parse(JSON.stringify(item))
      if (deleteFlag === 1) { // 启用美容头
        this.$confirm('确认启用该美容头？', '提示', {
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          const params = { code, deleteFlag: 0 }
          this.tableLoading = true
          editBeautyHead(params).then(res => {
            if (res.data.errorType === '00000000' && res.data.success) {
              this.$message({
                type: 'success',
                message: '启用美容头成功！'
              })
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: '启用美容头失败，请稍后重试！'
              })
              this.tableLoading = false
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '启用美容头失败，请稍后重试！'
            })
            this.tableLoading = false
          })
        })
      } else { // 禁用美容头
        this.$confirm('确认禁用该美容头？', '提示', {
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          const params = { code, deleteFlag: 1 }
          this.tableLoading = true
          editBeautyHead(params).then(res => {
            if (res.data.errorType === '00000000' && res.data.success) {
              this.$message({
                type: 'success',
                message: '禁用美容头成功！'
              })
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: '禁用美容头失败，请稍后重试！'
              })
              this.tableLoading = false
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '禁用美容头失败，请稍后重试！'
            })
            this.tableLoading = false
          })
        })
      }
    },
    // 删除美容头
    handleDelete(item) {
      const { code } = JSON.parse(JSON.stringify(item))
      this.$confirm('确认删除该美容头？', '提示', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteBeautyHead(code).then(res => {
          if (res.data.errorType === '00000000' && res.data.success) {
            this.$message({
              type: 'success',
              message: res.data.content || '删除美容头成功！'
            })
            this.getTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.content || '删除美容头失败，请稍后重试！'
            })
            this.tableLoading = false
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除美容头失败，请稍后重试！'
          })
          this.tableLoading = false
        })
      })
    },
    // 打开导入弹窗
    handleImportDialogOpen() {
      this.importDialogVisible = true
      this.fileName = ''
      this.file = null
    },
    // 关闭导入弹窗
    handleImportDialogClose() {
      this.importDialogVisible = false
    },
    // 导入确认
    handleImportDialogConfirm() {
      const formData = new FormData()
      formData.append('file', this.file)
      this.importLoading = true
      importTemplate(formData).then(res => {
        if (res.data.errorType === '00000000') {
          this.$message({
            type: 'success',
            message: res.data.content || '导入成功！'
          })
          this.getTableData()
        } else {
          this.$message({
            type: 'error',
            message: res.data.content || '导入失败！'
          })
        }
        this.importDialogVisible = false
        this.importLoading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '导入失败！'
        })
        this.importDialogVisible = false
        this.importLoading = false
      })
    },
    // 导入选择
    handleImportChange(file) {
      if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
        this.$message({
          type: 'error',
          message: '文件类型错误！'
        })
        return
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$message({
          type: 'error',
          message: '请上传5M以内的文件！'
        })
        return
      }
      this.fileName = file.name
      this.file = file.raw
    },
    // 下载模板
    downloadTemplate() {
      downloadTemplate().then(res => {
        if (res.status === 200) {
          if (res.headers['content-disposition']) {
            let fileName = res.headers['content-disposition'].substring(res.headers['content-disposition'].indexOf('=') + 1)
            fileName = decodeURI(fileName)
            this.downloadFile(res.data, fileName)
          }
        }
      })
    },
    downloadFile(res, fileName) {
      const tempBlob = new Blob([res], { type: 'application/json' })
      const reader = new FileReader()
      reader.readAsText(tempBlob)
      reader.onload = e => {
        const textRes = e.target.result
        try {
          const json = JSON.parse(textRes)
          if (json) {
            return
          }
        } catch (err) {
          console.log(err)
        }
        const blob = new Blob([res], { type: 'application/ms-excel' })
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          const url = window.URL || window.webkitURL || window.moxURL
          const downloadHref = url.createObjectURL(blob)
          const downloadLink = document.createElement('a')
          downloadLink.style.display = 'none'
          downloadLink.href = downloadHref
          downloadLink.download = fileName
          document.body.appendChild(downloadLink)
          downloadLink.click()
          url.revokeObjectURL(downloadLink.href)
          document.body.removeChild(downloadLink)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.beauty-head{
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  padding: 24px;
  .main-content{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-filter{
      padding: 4px 24px 24px 0;
      background-color: #fff;
      border-radius: 4px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .filter-item{
        display: flex;
        align-items: center;
        padding-top: 20px;
        .label{
          padding:  0 12px 0 24px;
          font-size: 14px;
          color: #333;
        }
        .search-btn{
          margin-left: 24px;
        }
      }
    }
    .table-content{
      flex: 1;
      background-color: #fff;
      border-radius: 4px;
      .operate-box{
        padding: 20px 24px;
      }
      .table-box{
        padding: 0 24px;
        height: calc(100% - 70px - 72px);
      }
      .pagination-box{
        height: 72px;
        padding: 20px 24px;
        .el-pagination{
          float: right;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.beauty-head {
  .main-content{
    .download-btn{
      &.el-button [class*=el-icon-]+span{
        margin-left: 0;
      }
    }
  }
}
</style>

<template>
  <div class="equipment">
    <div class="main-content">
      <div class="header-filter">
        <div class="filter-item">
          <div class="label">授权编号</div>
          <el-input v-model="filter.code" placeholder="请输入" class="common-input" clearable />
        </div>
        <div class="filter-item">
          <div class="label">产品名称</div>
          <el-input v-model="filter.mandateProduct" placeholder="请输入" class="common-input" clearable />
        </div>
        <div class="filter-item">
          <div class="label">启用状态</div>
          <el-select v-model="filter.deleteFlag" placeholder="请选择" class="common-select" clearable>
            <el-option label="已启用" :value="0" />
            <el-option label="已禁用" :value="1" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="label">签发日期</div>
          <el-date-picker
            v-model="filter.signTerm"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="common-date-range"
            value-format="yyyy-MM-dd"
          />
        </div>
        <div class="filter-item">
          <el-button type="primary" class="common-primary-btn search-btn" @click="handleSearch">查询</el-button>
        </div>
      </div>
      <div class="table-content">
        <div class="operate-box">
          <el-button size="mini" icon="el-icon-circle-plus" type="primary" @click="handleAddDialogOpen">新增设备</el-button>
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
              label="授权编号"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              prop="organization"
              label="所属机构"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              prop="mandateInfo"
              label="授权所有"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              prop="proxyCompany"
              label="代理机构"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              prop="mandateProduct"
              label="产品名称"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              label="授权期限"
              show-overflow-tooltip
              width="200"
            >
              <template slot-scope="scope">
                {{ scope.row.startTime + ' 至 ' + scope.row.endTime }}
              </template>
            </el-table-column>
            <el-table-column
              prop="signTime"
              label="签发日期"
              show-overflow-tooltip
              width="100"
            />
            <el-table-column
              prop="info"
              label="验证成功信息"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              prop="deleteFlag"
              label="启用状态"
              show-overflow-tooltip
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.deleteFlag === 0 ? '已启用': '已禁用' }}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
              class-name="operate-col"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="handleEditDialogOpen(scope.row)"
                >
                  编辑
                </el-button>
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
      title="新增设备"
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
          授权编号
        </div>
        <el-input v-model="addObj.code" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'organization'}">
        <div class="label">
          <i>*</i>
          所属机构
        </div>
        <el-input v-model="addObj.organization" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'mandateInfo'}">
        <div class="label">
          <i>*</i>
          授权所有
        </div>
        <el-input v-model="addObj.mandateInfo" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'proxyCompany'}">
        <div class="label">
          <i>*</i>
          代理机构
        </div>
        <el-input v-model="addObj.proxyCompany" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'mandateProduct'}">
        <div class="label">
          <i>*</i>
          产品名称
        </div>
        <el-input v-model="addObj.mandateProduct" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'authorizeTerm'}">
        <div class="label">
          <i>*</i>
          授权期限
        </div>
        <el-date-picker
          key="addTimeRange"
          v-model="addObj.authorizeTerm"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          class="common-date-range"
          :clearable="false"
          @input="$forceUpdate()"
        />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'signTime'}">
        <div class="label">
          <i>*</i>
          签发日期
        </div>
        <el-date-picker
          key="addTimePicker"
          v-model="addObj.signTime"
          type="date"
          placeholder="选择日期"
          class="common-date-picker"
          value-format="yyyy-MM-dd"
          :clearable="false"
        />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'info'}">
        <div class="label">
          <i>*</i>
          验证成功信息
        </div>
        <el-input v-model="addObj.info" placeholder="请输入" class="common-input dialog-input" />
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
    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑设备"
      :visible.sync="editDialogVisible"
      :before-close="handleEditDialogClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="common-dialog"
      width="660px"
    >
      <div class="dialog-item" :class="{'error-item': errorItem === 'code'}">
        <div class="label">
          <i>*</i>
          授权编号
        </div>
        <el-input v-model="editObj.code" placeholder="请输入" class="common-input dialog-input" disabled />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'organization'}">
        <div class="label">
          <i>*</i>
          所属机构
        </div>
        <el-input v-model="editObj.organization" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'mandateInfo'}">
        <div class="label">
          <i>*</i>
          授权所有
        </div>
        <el-input v-model="editObj.mandateInfo" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'proxyCompany'}">
        <div class="label">
          <i>*</i>
          代理机构
        </div>
        <el-input v-model="editObj.proxyCompany" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'mandateProduct'}">
        <div class="label">
          <i>*</i>
          产品名称
        </div>
        <el-input v-model="editObj.mandateProduct" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'authorizeTerm'}">
        <div class="label">
          <i>*</i>
          授权期限
        </div>
        <el-date-picker
          key="editTimeRange"
          v-model="editObj.authorizeTerm"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          class="common-date-range"
          :clearable="false"
          @input="$forceUpdate()"
        />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'signTime'}">
        <div class="label">
          <i>*</i>
          签发日期
        </div>
        <el-date-picker
          key="editTimePicker"
          v-model="editObj.signTime"
          type="date"
          placeholder="选择日期"
          class="common-date-picker"
          value-format="yyyy-MM-dd"
          :clearable="false"
        />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'info'}">
        <div class="label">
          <i>*</i>
          验证成功信息
        </div>
        <el-input v-model="editObj.info" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item">
        <div class="label">
          <i>*</i>
          启用状态
        </div>
        <el-switch v-model="editObj.deleteFlag" :active-value="0" :inactive-value="1" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取 消</el-button>
        <el-button :loading="editLoading" type="primary" @click="handleEditDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryEquipmentInfo, addEquipmentInfo, editEquipmentInfo, deleteEquipmentInfo } from '@/api/equipment'
export default {
  name: 'Equipment',
  data() {
    return {
      filter: {
        code: '',
        mandateProduct: '',
        deleteFlag: '',
        signTerm: []
      },
      tableData: [],
      tableLoading: false,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      addDialogVisible: false, // 新增设备弹窗显隐
      addObj: {
        code: '', // 授权编号
        organization: '', // 所属机构
        mandateInfo: '', // 授权所有
        proxyCompany: '', // 代理机构
        mandateProduct: '', // 产品名称
        authorizeTerm: [], // 授权期限
        signTime: '', // 签发日期
        info: '', // 验证成功信息
        deleteFlag: 1 // 启用状态
      },
      addLoading: false, // 新增确认按钮的loading
      editDialogVisible: false, // 编辑设备弹窗显隐
      editObj: {},
      editLoading: false, // 编辑确认按钮的loading
      errorItem: '' // 验证失败的参数

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
      const { code, mandateProduct, deleteFlag } = this.filter
      const signTerm = this.filter.signTerm || []
      const params = {
        code,
        mandateProduct,
        signStartTime: signTerm[0],
        signEndTime: signTerm[1],
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      if (deleteFlag !== '') {
        params.deleteFlag = deleteFlag
      }
      queryEquipmentInfo(params).then(res => {
        if (res.data.errorType === '00000000') {
          const data = res.data.content || {}
          this.tableData = data.list || []
          this.total = data.total || 0
        } else {
          this.tableData = []
          this.total = 0
        }
        this.tableLoading = false
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
        organization: '',
        mandateInfo: '',
        proxyCompany: '',
        mandateProduct: '',
        authorizeTerm: [],
        signTime: '',
        info: '',
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
      this.addObj.authorizeTerm = this.addObj.authorizeTerm || []
      this.validateField(this.addObj)
      if (!this.errorItem) {
        this.addLoading = true
        const { code, organization, mandateInfo, proxyCompany, mandateProduct, authorizeTerm, signTime, info, deleteFlag } = this.addObj
        const params = {
          code, organization, mandateInfo, proxyCompany, mandateProduct, signTime, info, deleteFlag,
          startTime: authorizeTerm[0],
          endTime: authorizeTerm[1]
        }
        addEquipmentInfo(params).then(res => {
          if (res.data.errorType === '00000000' && res.data.success) {
            this.$message({
              type: 'success',
              message: res.data.content || '新增设备成功！'
            })
            this.getTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.content || '新增设备失败，请稍后重试！'
            })
          }
          this.addDialogVisible = false
          this.addLoading = false
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '新增设备失败，请稍后重试！'
          })
          this.addDialogVisible = false
          this.addLoading = false
        })
      }
    },
    // 编辑弹窗打开
    handleEditDialogOpen(item) {
      this.editDialogVisible = true
      this.editObj = JSON.parse(JSON.stringify(item))
      this.editObj.authorizeTerm = [new Date(this.editObj.startTime), new Date(this.editObj.endTime)]
    },
    // 关闭编辑弹窗
    handleEditDialogClose() {
      this.editDialogVisible = false
      this.errorItem = ''
    },
    // 编辑确认
    handleEditDialogConfirm() {
      this.editObj.authorizeTerm = this.editObj.authorizeTerm || []
      this.validateField(this.editObj)
      if (!this.errorItem) {
        this.editLoading = true
        const { code, organization, mandateInfo, proxyCompany, mandateProduct, authorizeTerm, signTime, info, deleteFlag } = this.editObj
        const params = {
          code, organization, mandateInfo, proxyCompany, mandateProduct, signTime, info, deleteFlag,
          startTime: authorizeTerm[0],
          endTime: authorizeTerm[1]
        }
        editEquipmentInfo(params).then(res => {
          if (res.data.errorType === '00000000' && res.data.success) {
            this.$message({
              type: 'success',
              message: res.data.content || '编辑设备成功！'
            })
            this.getTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.content || '编辑设备失败，请稍后重试！'
            })
          }
          this.editDialogVisible = false
          this.editLoading = false
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '编辑设备失败，请稍后重试！'
          })
          this.editDialogVisible = false
          this.editLoading = false
        })
      }
    },
    // 新增、编辑的效验
    validateField(obj) {
      const { code, organization, mandateInfo, proxyCompany, mandateProduct, authorizeTerm, signTime, info } = obj
      this.errorItem = ''
      if (!code) {
        this.$message({
          type: 'error',
          message: '授权编号不能为空！'
        })
        this.errorItem = 'code'
        return false
      }
      if (!organization) {
        this.$message({
          type: 'error',
          message: '所属机构不能为空！'
        })
        this.errorItem = 'organization'
        return false
      }
      if (!mandateInfo) {
        this.$message({
          type: 'error',
          message: '授权所有不能为空！'
        })
        this.errorItem = 'mandateInfo'
        return false
      }
      if (!proxyCompany) {
        this.$message({
          type: 'error',
          message: '代理机构不能为空！'
        })
        this.errorItem = 'proxyCompany'
        return false
      }
      if (!mandateProduct) {
        this.$message({
          type: 'error',
          message: '产品名称不能为空！'
        })
        this.errorItem = 'mandateProduct'
        return false
      }
      if (!authorizeTerm.length) {
        this.$message({
          type: 'error',
          message: '授权期限不能为空！'
        })
        this.errorItem = 'authorizeTerm'
        return false
      }
      if (!signTime) {
        this.$message({
          type: 'error',
          message: '签发日期不能为空！'
        })
        this.errorItem = 'signTime'
        return false
      }
      if (!info) {
        this.$message({
          type: 'error',
          message: '验证成功信息不能为空！'
        })
        this.errorItem = 'info'
        return false
      }
    },
    // 是否启用或禁用
    handleDisabled(item) {
      const { code, deleteFlag } = JSON.parse(JSON.stringify(item))
      if (deleteFlag === 1) { // 启用设备
        this.$confirm('确认启用该设备？', '提示', {
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          const params = { code, deleteFlag: 0 }
          this.tableLoading = true
          editEquipmentInfo(params).then(res => {
            if (res.data.errorType === '00000000' && res.data.success) {
              this.$message({
                type: 'success',
                message: '启用设备成功！'
              })
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: '启用设备失败，请稍后重试！'
              })
              this.tableLoading = false
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '启用设备失败，请稍后重试！'
            })
            this.tableLoading = false
          })
        })
      } else { // 禁用设备
        this.$confirm('确认禁用该设备？', '提示', {
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          const params = { code, deleteFlag: 1 }
          this.tableLoading = true
          editEquipmentInfo(params).then(res => {
            if (res.data.errorType === '00000000' && res.data.success) {
              this.$message({
                type: 'success',
                message: '禁用设备成功！'
              })
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: '禁用设备失败，请稍后重试！'
              })
              this.tableLoading = false
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '禁用设备失败，请稍后重试！'
            })
            this.tableLoading = false
          })
        })
      }
    },
    // 删除设备
    handleDelete(item) {
      const { code } = JSON.parse(JSON.stringify(item))
      this.$confirm('确认删除该设备？', '提示', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteEquipmentInfo(code).then(res => {
          if (res.data.errorType === '00000000' && res.data.success) {
            this.$message({
              type: 'success',
              message: res.data.content || '删除设备成功！'
            })
            this.getTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.content || '删除设备失败，请稍后重试！'
            })
            this.tableLoading = false
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除设备失败，请稍后重试！'
          })
          this.tableLoading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.equipment{
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

<template>
  <div class="professional">
    <div class="main-content">
      <div class="header-filter">
        <div class="filter-item">
          <div class="label">授权编码</div>
          <el-input v-model="filter.authenticationCode" placeholder="请输入" class="common-input" clearable />
        </div>
        <div class="filter-item">
          <div class="label">姓名</div>
          <el-input v-model="filter.name" placeholder="请输入" class="common-input" clearable />
        </div>
        <div class="filter-item">
          <div class="label">地区</div>
          <el-input v-model="filter.region" placeholder="请输入" class="common-input" clearable />
        </div>
        <div class="filter-item">
          <div class="label">职称</div>
          <el-input v-model="filter.professional" placeholder="请输入" class="common-input" clearable />
        </div>
        <div class="filter-item">
          <div class="label">启用状态</div>
          <el-select v-model="filter.deleteFlag" placeholder="请选择" class="common-select" clearable>
            <el-option label="已启用" :value="0" />
            <el-option label="已禁用" :value="1" />
          </el-select>
        </div>
        <div class="filter-item">
          <div class="label">认证日期</div>
          <el-date-picker
            v-model="filter.authenticationTerm"
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
          <el-button size="mini" icon="el-icon-circle-plus" type="primary" @click="handleAddDialogOpen">新增认证人士</el-button>
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
              prop="authenticationCode"
              label="授权编码"
              show-overflow-tooltip
              min-width="150"
            />
            <el-table-column
              prop="name"
              label="姓名"
              show-overflow-tooltip
              min-width="120"
            />
            <el-table-column
              prop="picpath"
              label="头像"
              width="120"
            >
              <template slot-scope="scope">
                <img :src="'/' + scope.row.picpath" class="professional-img">
              </template>
            </el-table-column>
            <el-table-column
              prop="region"
              label="地区"
              show-overflow-tooltip
              min-width="200"
            />
            <el-table-column
              prop="professional"
              label="职称"
              show-overflow-tooltip
              min-width="150"
            />
            <el-table-column
              label="认证期限"
              show-overflow-tooltip
              width="200"
            >
              <template slot-scope="scope">
                {{ scope.row.authenticationStartTime + ' 至 ' + scope.row.authenticationEndTime }}
              </template>
            </el-table-column>
            <el-table-column
              prop="authenticationTime"
              label="认证日期"
              show-overflow-tooltip
              width="100"
            />
            <el-table-column
              prop="authenticationProduct"
              label="验证成功信息"
              show-overflow-tooltip
              min-width="250"
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
            :page-sizes="[10, 20, 50, 100]"
            :page-size.sync="pageSize"
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
      title="新增专业人士"
      :visible.sync="addDialogVisible"
      :before-close="handleAddDialogClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="common-dialog"
      width="660px"
    >
      <div class="dialog-item" :class="{'error-item': errorItem === 'authenticationCode'}">
        <div class="label">
          <i>*</i>
          授权编码
        </div>
        <el-input v-model="addObj.authenticationCode" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'name'}">
        <div class="label">
          <i>*</i>
          姓名
        </div>
        <el-input v-model="addObj.name" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'picpath'}">
        <div class="label">
          <i>*</i>
          头像
        </div>
        <el-upload
          v-show="!addImgLoading"
          class="img-upload"
          action=""
          :auto-upload="false"
          :multiple="false"
          :show-file-list="false"
          :on-change="handleAddPicChange"
          accept=".png, .jpg, .gif, .jpeg"
          list-type="picture"
        >
          <div class="upload-box">
            <img v-if="addObj.picpath" :src="addObj.picpath" class="upload-img">
            <div class="cover">
              <i class="el-icon-plus" />
            </div>
          </div>
          <div slot="tip" class="el-upload__tip">请上传png、jpg、gif、jpeg格式的文件, 且文件大小不超过5M！</div>
        </el-upload>
        <div v-if="addImgLoading" class="img-upload">
          <div v-loading="true" class="upload-box">
            <div class="cover" />
          </div>
          <div class="el-upload__tip">请上传png、jpg、gif、jpeg格式的文件, 且文件大小不超过5M！</div>
        </div>
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'region'}">
        <div class="label">
          <i>*</i>
          地区
        </div>
        <el-input v-model="addObj.region" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'professional'}">
        <div class="label">
          <i>*</i>
          职称
        </div>
        <el-input v-model="addObj.professional" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'authorizeTerm'}">
        <div class="label">
          <i>*</i>
          认证期限
        </div>
        <el-date-picker
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
      <div class="dialog-item" :class="{'error-item': errorItem === 'authenticationTime'}">
        <div class="label">
          <i>*</i>
          认证日期
        </div>
        <el-date-picker
          v-model="addObj.authenticationTime"
          type="date"
          placeholder="选择日期"
          class="common-date-picker"
          value-format="yyyy-MM-dd"
          :clearable="false"
        />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'authenticationProduct'}">
        <div class="label">
          <i>*</i>
          认证成功信息
        </div>
        <el-input v-model="addObj.authenticationProduct" placeholder="请输入" class="common-input dialog-input" />
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
      title="新增专业人士"
      :visible.sync="editDialogVisible"
      :before-close="handleEditDialogClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="common-dialog"
      width="660px"
    >
      <div class="dialog-item" :class="{'error-item': errorItem === 'authenticationCode'}">
        <div class="label">
          <i>*</i>
          授权编码
        </div>
        <el-input v-model="editObj.authenticationCode" placeholder="请输入" class="common-input dialog-input" disabled />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'name'}">
        <div class="label">
          <i>*</i>
          姓名
        </div>
        <el-input v-model="editObj.name" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'picpath'}">
        <div class="label">
          <i>*</i>
          头像
        </div>
        <el-upload
          v-show="!editImgLoading"
          class="img-upload"
          action=""
          :auto-upload="false"
          :multiple="false"
          :show-file-list="false"
          :on-change="handleEditPicChange"
          accept=".png, .jpg, .gif, .jpeg"
          list-type="picture"
        >
          <div class="upload-box">
            <img v-if="editObj.picpath" :src="editObj.picpath" class="upload-img">
            <div class="cover">
              <i class="el-icon-plus" />
            </div>
          </div>
          <div slot="tip" class="el-upload__tip">请上传png、jpg、gif、jpeg格式的文件, 且文件大小不超过5M！</div>
        </el-upload>
        <div v-if="editImgLoading" class="img-upload">
          <div v-loading="true" class="upload-box">
            <div class="cover" />
          </div>
          <div class="el-upload__tip">请上传png、jpg、gif、jpeg格式的文件, 且文件大小不超过5M！</div>
        </div>
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'region'}">
        <div class="label">
          <i>*</i>
          地区
        </div>
        <el-input v-model="editObj.region" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'professional'}">
        <div class="label">
          <i>*</i>
          职称
        </div>
        <el-input v-model="editObj.professional" placeholder="请输入" class="common-input dialog-input" />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'authorizeTerm'}">
        <div class="label">
          <i>*</i>
          认证期限
        </div>
        <el-date-picker
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
      <div class="dialog-item" :class="{'error-item': errorItem === 'authenticationTime'}">
        <div class="label">
          <i>*</i>
          认证日期
        </div>
        <el-date-picker
          v-model="editObj.authenticationTime"
          type="date"
          placeholder="选择日期"
          class="common-date-picker"
          value-format="yyyy-MM-dd"
          :clearable="false"
        />
      </div>
      <div class="dialog-item" :class="{'error-item': errorItem === 'authenticationProduct'}">
        <div class="label">
          <i>*</i>
          认证成功信息
        </div>
        <el-input v-model="editObj.authenticationProduct" placeholder="请输入" class="common-input dialog-input" />
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
import { queryProfessionalInfo, addProfessionalInfo, editProfessionalInfo, deleteProfessionalInfo, uploadImage } from '@/api/professional'
export default {
  name: 'Professional',
  data() {
    return {
      filter: {
        authenticationCode: '', // 授权编码
        name: '', // 姓名
        region: '', // 地区
        professional: '', // 职称
        deleteFlag: '', // 是否启用
        authenticationTerm: [] // 认证日期
      },
      tableLoading: false,
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      addDialogVisible: false, // 新增专业人士弹窗显隐
      addObj: {
        authenticationCode: '', // 授权编码
        name: '', // 姓名
        picpath: '', // 头像
        fileName: '', // 头像文件名
        region: '', // 地区
        professional: '', // 职称
        authorizeTerm: [], // 认证期限
        authenticationTime: '', // 认证日期
        authenticationProduct: '', // 认证成功信息
        deleteFlag: 1
      },
      addImgLoading: false, // 新增上传头像的loading
      addLoading: false, // 新增确认按钮的loading
      editDialogVisible: false, // 编辑专业人士弹窗显隐
      editObj: {},
      editImgLoading: false, // 编辑上传头像的loading
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
      const { authenticationCode, name, region, professional, deleteFlag } = this.filter
      const authenticationTerm = this.filter.authenticationTerm || []
      const params = {
        authenticationCode,
        name,
        region,
        professional,
        authenticationStartTime: authenticationTerm[0],
        authenticationEndTime: authenticationTerm[1],
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      if (deleteFlag !== '') {
        params.deleteFlag = deleteFlag
      }
      queryProfessionalInfo(params).then(res => {
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
        authenticationCode: '',
        name: '',
        picpath: '',
        fileName: '',
        region: '',
        professional: '',
        authorizeTerm: [],
        authenticationTime: '',
        authenticationProduct: '',
        deleteFlag: 1
      }
    },
    // 关闭新增弹窗
    handleAddDialogClose() {
      this.addDialogVisible = false
      this.errorItem = ''
    },
    // 新增头像改变
    handleAddPicChange(file) {
      if (!file.name.endsWith('.png') && !file.name.endsWith('.jpg') && !file.name.endsWith('.jpeg') && !file.name.endsWith('.gif')) {
        this.$message({
          type: 'error',
          message: '图片类型错误！'
        })
        return
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$message({
          type: 'error',
          message: '请上传5M以内的图片！'
        })
        return
      }
      this.addImgLoading = true
      this.addObj.picpath = ''
      this.addObj.fileName = ''
      const formData = new FormData()
      formData.append('imageFile', file.raw)
      uploadImage(formData).then(res => {
        if (res.data.errorType === '00000000' && res.data.success) {
          this.$message({
            type: 'success',
            message: '头像上传成功！'
          })
          this.addObj.picpath = file.url
          this.addObj.fileName = res.data.content
        } else {
          this.$message({
            type: 'error',
            message: '头像上传失败，请稍后重试！'
          })
        }
        this.addImgLoading = false
        this.$forceUpdate()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '头像上传失败，请稍后重试！'
        })
        this.addImgLoading = false
      })
    },
    // 新增确认
    handleAddDialogConfirm() {
      this.addObj.authorizeTerm = this.addObj.authorizeTerm || []
      this.validateField(this.addObj)
      if (!this.errorItem) {
        this.addLoading = true
        const { authenticationCode, name, fileName, region, professional, authorizeTerm, authenticationTime, authenticationProduct, deleteFlag } = this.addObj
        const params = {
          authenticationCode, name, region, professional, authenticationTime, authenticationProduct, deleteFlag,
          picpath: 'image/' + fileName,
          authenticationStartTime: authorizeTerm[0],
          authenticationEndTime: authorizeTerm[1]
        }
        addProfessionalInfo(params).then(res => {
          if (res.data.errorType === '00000000' && res.data.success) {
            this.$message({
              type: 'success',
              message: res.data.content || '新增专业人士成功！'
            })
            this.getTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.content || '新增专业人士失败，请稍后重试！'
            })
          }
          this.addDialogVisible = false
          this.addLoading = false
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '新增专业人士失败，请稍后重试！'
          })
          this.addDialogVisible = false
          this.addLoading = false
        })
      }
    },
    // 编辑弹窗打开
    handleEditDialogOpen(item) {
      this.editObj = JSON.parse(JSON.stringify(item))
      this.editObj.picpath = '/' + this.editObj.picpath
      this.editObj.authorizeTerm = [this.editObj.authenticationStartTime, this.editObj.authenticationEndTime]
      this.editDialogVisible = true
    },
    // 关闭编辑弹窗
    handleEditDialogClose() {
      this.editDialogVisible = false
      this.errorItem = ''
    },
    // 编辑头像改变
    handleEditPicChange(file) {
      if (!file.name.endsWith('.png') && !file.name.endsWith('.jpg') && !file.name.endsWith('.jpeg') && !file.name.endsWith('.gif')) {
        this.$message({
          type: 'error',
          message: '图片类型错误！'
        })
        return
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$message({
          type: 'error',
          message: '请上传5M以内的图片！'
        })
        return
      }
      this.editImgLoading = true
      const formData = new FormData()
      formData.append('imageFile', file.raw)
      uploadImage(formData).then(res => {
        if (res.data.errorType === '00000000' && res.data.success) {
          this.$message({
            type: 'success',
            message: '头像上传成功！'
          })
          this.editObj.picpath = file.url
          this.editObj.fileName = res.data.content
        } else {
          this.$message({
            type: 'error',
            message: '头像上传失败，请稍后重试！'
          })
        }
        this.editImgLoading = false
        this.$forceUpdate()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '头像上传失败，请稍后重试！'
        })
        this.editImgLoading = false
      })
    },
    // 编辑确认
    handleEditDialogConfirm() {
      this.editObj.authorizeTerm = this.editObj.authorizeTerm || []
      this.validateField(this.editObj)
      if (!this.errorItem) {
        this.editLoading = true
        const { authenticationCode, name, fileName, region, professional, authorizeTerm, authenticationTime, authenticationProduct, deleteFlag } = this.editObj
        const params = {
          authenticationCode, name, region, professional, authenticationTime, authenticationProduct, deleteFlag,
          picpath: 'image/' + fileName,
          authenticationStartTime: authorizeTerm[0],
          authenticationEndTime: authorizeTerm[1]
        }
        editProfessionalInfo(params).then(res => {
          if (res.data.errorType === '00000000' && res.data.success) {
            this.$message({
              type: 'success',
              message: res.data.content || '编辑专业人士成功！'
            })
            this.getTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.content || '编辑专业人士失败，请稍后重试！'
            })
          }
          this.editDialogVisible = false
          this.editLoading = false
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '编辑专业人士失败，请稍后重试！'
          })
          this.editDialogVisible = false
          this.editLoading = false
        })
      }
    },
    // 新增、编辑的效验
    validateField(obj) {
      const { authenticationCode, name, picpath, region, professional, authorizeTerm, authenticationTime, authenticationProduct } = obj
      this.errorItem = ''
      if (!authenticationCode) {
        this.$message({
          type: 'error',
          message: '授权编号不能为空！'
        })
        this.errorItem = 'authenticationCode'
        return false
      }
      if (!name) {
        this.$message({
          type: 'error',
          message: '姓名不能为空！'
        })
        this.errorItem = 'name'
        return false
      }
      if (!picpath) {
        this.$message({
          type: 'error',
          message: '头像不能为空！'
        })
        this.errorItem = 'picpath'
        return false
      }
      if (!region) {
        this.$message({
          type: 'error',
          message: '地区不能为空！'
        })
        this.errorItem = 'region'
        return false
      }
      if (!professional) {
        this.$message({
          type: 'error',
          message: '职称不能为空！'
        })
        this.errorItem = 'professional'
        return false
      }
      if (!authorizeTerm.length) {
        this.$message({
          type: 'error',
          message: '认证期限不能为空！'
        })
        this.errorItem = 'authorizeTerm'
        return false
      }
      if (!authenticationTime) {
        this.$message({
          type: 'error',
          message: '认证日期不能为空！'
        })
        this.errorItem = 'authenticationTime'
        return false
      }
      if (!authenticationProduct) {
        this.$message({
          type: 'error',
          message: '认证成功信息不能为空！'
        })
        this.errorItem = 'authenticationProduct'
        return false
      }
    },
    // 是否启用或禁用
    handleDisabled(item) {
      const { authenticationCode, deleteFlag } = JSON.parse(JSON.stringify(item))
      if (deleteFlag === 1) { // 启用专业人士
        this.$confirm('确认启用该专业人士？', '提示', {
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          const params = { authenticationCode, deleteFlag: 0 }
          this.tableLoading = true
          editProfessionalInfo(params).then(res => {
            if (res.data.errorType === '00000000' && res.data.success) {
              this.$message({
                type: 'success',
                message: '启用专业人士成功！'
              })
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: '启用专业人士失败，请稍后重试！'
              })
              this.tableLoading = false
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '启用专业人士失败，请稍后重试！'
            })
            this.tableLoading = false
          })
        })
      } else { // 禁用专业人士
        this.$confirm('确认禁用该专业人士？', '提示', {
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          const params = { authenticationCode, deleteFlag: 1 }
          this.tableLoading = true
          editProfessionalInfo(params).then(res => {
            if (res.data.errorType === '00000000' && res.data.success) {
              this.$message({
                type: 'success',
                message: '禁用专业人士成功！'
              })
              this.getTableData()
            } else {
              this.$message({
                type: 'error',
                message: '禁用专业人士失败，请稍后重试！'
              })
              this.tableLoading = false
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '禁用专业人士失败，请稍后重试！'
            })
            this.tableLoading = false
          })
        })
      }
    },
    // 删除专业人士
    handleDelete(item) {
      const { authenticationCode } = JSON.parse(JSON.stringify(item))
      this.$confirm('确认删除该专业人士？', '提示', {
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        deleteProfessionalInfo(authenticationCode).then(res => {
          if (res.data.errorType === '00000000' && res.data.success) {
            this.$message({
              type: 'success',
              message: res.data.content || '删除专业人士成功！'
            })
            this.getTableData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.content || '删除专业人士失败，请稍后重试！'
            })
            this.tableLoading = false
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除专业人士失败，请稍后重试！'
          })
          this.tableLoading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.professional{
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
        .professional-img{
          display: block;
          width: 100px;
          height: 100px;
          background-color: #ccc;
        }
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

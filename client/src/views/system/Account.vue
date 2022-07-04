<script lang="ts" setup>
import 'element-plus/es/components/message-box/style/css'
import {
  ComponentInternalInstance,
  getCurrentInstance,
  onMounted,
  reactive,
  ref
} from 'vue'
import {
  getAllSysUsers,
  register,
  deleteUser,
  editUser,
  editPassword
} from '@/api/userApi'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/form-item/style/css'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const test = () => {
  proxy?.$Alert('测试全局变量')
}
// 初始化
onMounted(() => {
  getUsers()
})
// 获取用户数据
const state = reactive({
  users: [],
  currentPage: 1, //当前页
  pageSize: 10, //默认每页显示 10 条
  // 新增用户表单数据
  userFormData: {
    username: '',
    password: '',
    role: ''
  }
})
// 获取所有用户的信息
const getUsers = () => {
  getAllSysUsers().then((result) => {
    // console.log(result.data)
    state.users = result.data as any
  })
}

// 改变页码数
const handelCurrentChange = (val: number) => {
  state.currentPage = val
}
const handelSizeChange = (val: number) => {
  state.pageSize = val
}

// 新增用户
// 控制新增用户表单是否显示
const userFormDialogVisible = ref<boolean>(false)
// 控制表单 title
const formTitle = ref<string>('')
const toAddUser = () => {
  formTitle.value = '新增用户'
  userFormDialogVisible.value = true
  state.userFormData = {
    username: '',
    password: '',
    role: ''
  }
}
// 表单校验规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名！', trigger: 'blur' },
    { min: 6, max: 50, message: '用户名长度至少为 6 位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码！', trigger: 'blur' },
    { min: 6, max: 50, message: '密码长度至少为 6 位', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色！', trigger: 'blur' }]
})
// 角色选项
const options = [
  {
    value: 'teacher',
    label: '教师'
  },
  {
    value: 'student',
    label: '学生'
  }
]
// 提交表单
/**
 * 根据弹出窗的 title 来判断调用新增还是更新 api
 */
const handelConfirm = async () => {
  // 当新增用户时，提交时执行以下
  if (formTitle.value == '新增用户') {
    register(state.userFormData).then((res) => {
      // console.log(res)
      if (res.code == 200) {
        ElMessage({
          message: '添加成功！',
          type: 'success',
          center: true
        })
        // 重新获取所有用户信息
        getUsers()
        // 关掉弹窗
        userFormDialogVisible.value = false
      }
    })
    // 当编辑用户时，执行以下
  } else if (formTitle.value == '编辑用户') {
    // 获取用户 id
    const selectUserId = userId.value
    // 准备更新后的用户信息
    const editUserData = {
      username: state.userFormData.username,
      role: state.userFormData.role
    }
    // 调用更新接口
    try {
      const res = await editUser(selectUserId, editUserData)
      if (res.code == 200) {
        ElMessage({
          message: '修改成功！',
          type: 'success',
          center: true
        })
        // 重新获取所有用户信息
        getUsers()
        // 关掉弹窗
        userFormDialogVisible.value = false
      }
    } catch (error) {
      const res = JSON.parse(JSON.stringify(error))
      if (res.status == 401) {
        ElMessage({
          message: '用户名已存在！',
          type: 'error',
          center: true
        })
      }
      console.log(res)
    }
  }
}
// 重置表单
const userForm = ref<FormInstance>()
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
// 删除用户
const handleDelete = async (userId: string) => {
  const res = await deleteUser(userId)
  if (res.code == 200) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
      center: true
    })
    // 重新获取所有用户信息
    getUsers()
  }
}
// 编辑用户信息
const userId = ref<string>('')
const toEditUser = (selectUser: any) => {
  formTitle.value = '编辑用户'
  userFormDialogVisible.value = true
  userId.value = selectUser._id
  // console.log(userId.value)
  const res = JSON.parse(JSON.stringify(selectUser))
  state.userFormData.username = res.username
  state.userFormData.role = res.role
  // console.log(state.userFormData)

  // console.log(selectUser)
}
// 改变用户状态
const toChangeStatus = (userInfo: any) => {
  const res = JSON.parse(JSON.stringify(userInfo))
  const userId = res._id
  const userStatus = {
    status: res.status
  }
  // 调用更新接口
  editUser(userId, userStatus).then((res) => {
    // console.log(res)
    if (res.code == 200) {
      ElMessage({
        message: '修改成功！',
        type: 'success',
        center: true
      })
      // 重新获取所有用户信息
      getUsers()
    }
  })
}
// 角色授权
const roleDialogVisible = ref(false)
const roleForm = ref<FormInstance>()
const toChangeRole = (selectUser: any) => {
  roleDialogVisible.value = true
  userId.value = selectUser._id
  // console.log(userId.value)
  const res = JSON.parse(JSON.stringify(selectUser))
  state.userFormData.role = res.role
}
const handleChangeRole = () => {
  // 获取用户 id
  const selectUserId = userId.value
  // 准备更新后的用户信息
  const editUserData = {
    role: state.userFormData.role
  }
  // 调用更新接口
  editUser(selectUserId, editUserData).then((res) => {
    // console.log(res)
    if (res.code == 200) {
      ElMessage({
        message: '修改成功！',
        type: 'success',
        center: true
      })
      // 重新获取所有用户信息
      getUsers()
      // 关掉弹窗
      roleDialogVisible.value = false
    }
  })
}
// 修改密码
const passwordFormDialogVisible = ref(false)
const passwordForm = ref<FormInstance>()
const newPassword = ref('')
const toChangePassword = (selectUser: any) => {
  passwordFormDialogVisible.value = true
  userId.value = selectUser._id
  // console.log(userId.value)
  const res = JSON.parse(JSON.stringify(selectUser))
  state.userFormData.password = res.password
}
const handleChangePassword = () => {
  // 获取用户 id
  const selectUserId = userId.value
  // 准备更新后的用户信息
  const editUserData = {
    password: newPassword.value
  }
  // 调用更新接口
  editPassword(selectUserId, editUserData).then((res) => {
    console.log(res)
    if (res.code == 200) {
      ElMessage({
        message: '修改成功！',
        type: 'success',
        center: true
      })
      // 重新获取所有用户信息
      getUsers()
      // 关掉弹窗
      passwordFormDialogVisible.value = false
    }
  })
}
const resetPasswordForm = () => {
  newPassword.value = ''
}
</script>

<template>
  <div class="">
    <!-- <button @click="test">测试全局变量</button> -->
    <!-- 新增用户 -->
    <div style="text-align: left; margin: 5px 10px">
      <el-button type="primary" size="default" @click="toAddUser"
        >新增系统用户</el-button
      >
    </div>
    <!-- 新增用户 form 表单 -->
    <el-dialog :title="formTitle" v-model="userFormDialogVisible">
      <el-form
        ref="userForm"
        :model="state.userFormData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="state.userFormData.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          v-show="formTitle == '新增用户' ? true : false"
        >
          <el-input
            v-model="state.userFormData.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色"
          prop="role"
          v-show="formTitle == '新增用户' ? true : false"
        >
          <el-select
            v-model="state.userFormData.role"
            class="m-2"
            placeholder="选择角色"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="resetForm(userForm)"
            >重置</el-button
          >
          <el-button type="primary" @click="handelConfirm">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 用户授权 form 表单 -->
    <el-dialog title="用户授权" v-model="roleDialogVisible">
      <el-form
        ref="roleForm"
        :model="state.userFormData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色" prop="role">
          <el-select
            v-model="state.userFormData.role"
            class="m-2"
            placeholder="选择角色"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="resetForm(roleForm)"
            >重置</el-button
          >
          <el-button type="primary" @click="handleChangeRole">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改密码 form 表单 -->
    <el-dialog title="修改密码" v-model="passwordFormDialogVisible">
      <el-form
        ref="passwordForm"
        :model="state.userFormData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="密码" prop="password">
          <el-input v-model="newPassword" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="resetPasswordForm">重置</el-button>
          <el-button type="primary" @click="handleChangePassword"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 系统用户表格 -->
    <div style="margin: 0px 10px; text-algin: left">
      <el-table
        :data="
          state.users.slice(
            (state.currentPage - 1) * state.pageSize,
            state.currentPage * state.pageSize
          )
        "
        stripe
        style="width: 100%"
      >
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="toChangeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="toChangeRole(scope.row)"
              >授权</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="toChangePassword(scope.row)"
              >修改密码</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              @click="toEditUser(scope.row)"
              >编辑</el-button
            >
            <!-- 在删除按钮外加一层弹出确认框 -->
            <el-popconfirm
              title="确认删除"
              confirm-button-text="删除"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row._id)"
            >
              <template #reference>
                <el-button link type="primary" size="small"
                  >删除</el-button
                ></template
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-row style="float: right; margin-top: 10px">
        <el-pagination
          layout="total, sizes,prev, pager, next,jumper"
          :total="state.users.length"
          :current-page="state.currentPage"
          @current-change="handelCurrentChange"
          :page-sizes="[5, 10, 20, 30, 50, 100]"
          @size-change="handelSizeChange"
        />
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

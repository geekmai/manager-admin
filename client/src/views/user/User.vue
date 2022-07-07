<script lang="ts" setup>
import { onMounted, reactive, ref, toRaw, nextTick } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { getAllSysUsers, deleteUser, getRolesList, getDeptsList, userSubmit } from '@/api/userApi'
import type { FormInstance, FormRules } from 'element-plus'
import { formaDate } from '@/utils'

/**
 * 表格区域
 */
// 定义表格表头字段
interface TableColumns {
  label: string
  prop: string
  width?: string
  formatter?: any
}

const columns: TableColumns[] = [
  {
    label: '用户ID',
    prop: 'userId',
    width: '100'
  },
  {
    label: '用户名',
    prop: 'userName'
  },
  {
    label: '用户邮箱',
    prop: 'userEmail'
  },
  {
    label: '用户角色',
    prop: 'role',
    width: '100',
    formatter(row: any, column: any, value: number): string | undefined {
      // console.log(value)
      return {
        0: '管理员',
        1: '普通用户'
      }[value]
    }
  },
  {
    label: '用户状态',
    prop: 'state',
    width: '100',
    formatter(row: any, column: any, value: number): string | undefined {
      // console.log(value)
      return {
        1: '在职',
        2: '离职',
        3: '试用期'
      }[value]
    }
  },
  {
    label: '注册时间',
    prop: 'createTime',
    width: '170',
    formatter: (row: any, column: any, value: any) => {
      return formaDate(new Date(value), 'yyyy-MM-dd')
    }
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime',
    width: '170',
    formatter: (row: any, column: any, value: any) => {
      return formaDate(new Date(value), 'yyyy-MM-dd')
    }
  }
]

// 初始化表格数据
const userList = ref()
// 初始化分页数据
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 获取用户列表
const getUserList = async () => {
  let params = { ...user, ...pager }
  // console.log(params)
  try {
    const res = await getAllSysUsers(params)
    const { list, page } = res.data
    userList.value = list
    pager.total = page.total
  } catch (error) {
    throw error
  }
}
// 页面加载时发起请求获取数据
onMounted(() => {
  getUserList()
})

/**
 * 查询功能
 */
// 初始化查询数据
const user = reactive({
  userId: '',
  userName: '',
  state: 1
})
// 查询功能
const handleQuery = () => {
  getUserList()
}
// 重置功能

const queryForm = ref<FormInstance>()
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getUserList()
}

/**
 * 分页功能
 */
// 跳转到第几页
const handleCurrentChange = (val: number) => {
  pager.pageNum = val
  console.log(val)
  getUserList()
}
// 修改每页展示多少条
const handleSizeChange = (val: number) => {
  pager.pageSize = val
  getUserList()
}

/**
 * 删除功能
 */
// 单条删除功能
const handelDel = async (row: any) => {
  try {
    // console.log(row.userId)
    const res: any = await deleteUser({
      userIds: [row.userId]
    })
    // console.log(res)
    if (res.nModified > 0) {
      ElMessage.success('删除成功')
      getUserList()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    throw error
  }
}
// 批量删除功能
// 选中用户列表的数据
const checkUserIds = ref<number[]>([])
// 表格多选
const handleSelectionChange = (list: any) => {
  let arr: Array<number> = []
  list.map((item: any) => {
    arr.push(item.userId)
  })
  checkUserIds.value = arr
  // console.log(checkUserIds.value)
}
// 处理删除
const handelPatchDel = async () => {
  if (checkUserIds.value.length == 0) {
    ElMessage.error('请选择要删除的用户')
    return
  }
  // console.log(checkUserIds.value)
  try {
    await deleteUser({
      userIds: checkUserIds.value
    })

    ElMessage.success('删除成功')
    getUserList()
  } catch (error) {
    throw error
  }
}

/**
 * 新增用户功能
 */
// 初始化级联选择器选项内容
const options: any = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Disciplines',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          },
          {
            value: 'efficiency',
            label: 'Efficiency'
          },
          {
            value: 'controllability',
            label: 'Controllability'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side nav',
            label: 'Side Navigation'
          },
          {
            value: 'top nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  }
]

// 控制弹出窗是否显示
const dialogFormVisible = ref(false)

// 打开弹窗并拉取部门和角色列表数据
const addUser = () => {
  dialogFormVisible.value = true //显示弹窗
  action.value = 'add' //用户名可以编辑
  userForm.action = 'add'
  getDeptList() //获取部门列表数据
  getRoleList() //获取角色列表数据
}

// 初始化新增用户对象
const userForm = reactive({
  userName: '',
  userEmail: '',
  roleList: [],
  state: 3,
  deptId: '',
  mobile: '',
  job: '',
  action: 'add'
})

// 表单校验规则
const rules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  userEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ]
})

// 获取表单 DOM
const addUserForm = ref<FormInstance>()

// 处理表单取消功能
const handelAddUserCancel = (formEl: FormInstance | undefined) => {
  // 关闭弹窗
  dialogFormVisible.value = false
  // 清空表单
  if (!formEl) return
  formEl.resetFields()
}

// 获取部门列表
// interface IDeptInfo {
//   parentId: Array<string>
//   updateTime: string
//   createTime: string
//   _id: string
//   deptName: string
//   userId: string
//   userName: string
//   userEmail: string
//   __v: number
// }
// interface IDeptList extends IDeptInfo {
//   children?: Array<IDeptInfo>
// }
// const deptList = ref<IDeptList>()
// const getDeptList = async () => {
//   let res: any = await getDeptsList()
//   const list: IDeptList = res.data
//   // console.log(list)
//   deptList.value = list
// }
const deptList = ref([])
const getDeptList = async () => {
  let res: any = await getDeptsList()
  const list = res.data
  // console.log(list)
  deptList.value = list
}

// 获取角色列表
interface IRoleList {
  _id: string
  roleName: string
}

const roleList = ref<IRoleList[]>()

const getRoleList = async () => {
  const res: any = await getRolesList()
  const list: Array<IRoleList> = res.data
  roleList.value = list
}
// 初始化 action 的值，用来判断是新增还是编辑
const action = ref('add')
// 新增用户提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let params = toRaw(userForm)
      params.userEmail += '@wanwei.com' //拼接邮箱后缀
      // params.action = action.value
      // console.log(params)
      await userSubmit(params)
      // 关闭弹窗
      dialogFormVisible.value = false
      // 清空表单
      formEl.resetFields()
      ElMessage.success('创建成功！')
      console.log('提交')
      getUserList()
    }
  })
}
/**
 * 编辑用户
 */
const handelEdit = (row: any) => {
  dialogFormVisible.value = true
  action.value = 'edit'
  userForm.action = action.value
  // 等 dom 渲染完再执行数据回填
  nextTick(() => {
    // 通过继承的方式，浅拷贝，将 row 的值赋给 userForm
    Object.assign(userForm, row)
  })

  console.log(userForm)
  // console.log(row)
}
</script>
<template>
  <div class="user-container">
    <!-- 表单查询 -->
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="queryForm">
        <el-form-item prop="userId" label="用户 ID">
          <el-input v-model="user.userId" placeholder="请输入用户 ID" />
        </el-form-item>
        <el-form-item prop="userName" label="用户名称">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select placeholder="状态" v-model="user.state">
            <el-option label="所有" :value="0"></el-option>
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset(queryForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单展示 -->
    <div class="base-table">
      <!-- 增加、批量删除按钮 -->
      <div class="action">
        <el-button type="primary" size="default" @click="addUser">新增</el-button>
        <el-button type="danger" size="default" @click="handelPatchDel">批量删除</el-button>
      </div>
      <!-- 表单 -->
      <el-table
        ref="multipleTableRef"
        :data="userList"
        style="width: 100%"
        stripe
        class="form-table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :property="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handelEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="确认删除？" @confirm="handelDel(scope.row)">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页展示 -->
      <el-row style="float: right; padding: 10px">
        <el-pagination
          class="page-show"
          background
          v-model:currentPage="pager.pageNum"
          v-model:page-size="pager.pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pager.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </div>
    <!-- 新增用户 -->
    <el-dialog v-model="dialogFormVisible" title="新增用户" width="30%">
      <el-form :model="userForm" ref="addUserForm" label-width="80px" :inline="false" size="default" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" :disabled="action == 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="请输入邮箱" :disabled="action == 'edit'">
            <template #append> @wanwei.com </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="userForm.roleList" placeholder="请选择用户角色" multiple style="width: 100%">
            <el-option v-for="item in roleList" :key="item._id" :label="item.roleName" :value="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            placeholder="请选择所属部门"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handelAddUserCancel(addUserForm)">取消</el-button>
          <el-button type="primary" @click="submitForm(addUserForm)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>

<script lang="ts" setup>
import { onMounted, reactive, ref, toRaw, nextTick } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { getMenuList } from '@/api/userApi'
import type { FormInstance, FormRules } from 'element-plus'
import { formaDate } from '@/utils'

// 页面加载时发起请求获取数据
const getMenuLists = async () => {
  try {
    let list: any = await getMenuList(menuForm)
    menuList.value = list.data
  } catch (error) {
    console.log(error)
  }
}
onMounted(() => {
  getMenuLists()
})

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
const menuList = ref([])

const columns: TableColumns[] = [
  {
    label: '菜单名称',
    prop: 'menuName',
    width: '200'
  },
  {
    label: '图标',
    prop: 'icon'
  },
  {
    label: '菜单类型',
    prop: 'menuType',
    width: '90',
    formatter(row: any, column: any) {
      return row.menuState == 1 ? '菜单' : '按钮'
    }
  },
  {
    label: '权限标识',
    prop: 'menuCode'
  },
  {
    label: '路由地址',
    prop: 'path'
  },
  {
    label: '组件路径',
    prop: 'component'
  },
  {
    label: '菜单状态',
    prop: 'menuState',
    width: '90',
    formatter(row: any, column: any) {
      return row.menuState == 1 ? '正常' : '停用'
    }
  },
  {
    label: '创建时间',
    prop: 'createTime',
    width: '120',
    formatter(row: any, column: any, value: any) {
      return formaDate(new Date(value), 'yyyy-MM-dd')
    }
  }
]

/**
 * 查询功能
 */
// 初始化查询数据
const menuForm = reactive({
  menuName: '',
  menuState: '',
  state: 1
})
// 查询功能
const handleQuery = () => {}
// 重置功能

const queryForm = ref<FormInstance>()
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

/**
 * 新增用户功能
 */

// 控制弹出窗是否显示
const dialogFormVisible = ref(false)

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

/**
 * 新增菜单快捷
 */
const handleAdd = () => {}
const menuAdd = () => {}
/**
 * 编辑菜单
 */
const handleEdit = () => {}
/**
 * 删除菜单
 */
const handleDel = () => {}
</script>
<template>
  <div class="user-manage">
    <!-- 表单查询 -->
    <div class="query-form">
      <el-form :inline="true" :model="menuForm" ref="queryForm">
        <el-form-item prop="menuName" label="菜单名称">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item prop="menuState" label="菜单状态">
          <el-select v-model="menuForm.menuState">
            <el-option label="正常" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
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
        <el-button type="primary" size="default" @click="menuAdd">新增</el-button>
      </div>
      <!-- 表单 -->
      <el-table
        ref="multipleTableRef"
        :data="menuList"
        style="width: 100%"
        stripe
        class="form-table"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :property="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
            <el-button size="small" type="primary" @click="handleEdit">编辑</el-button>
            <el-popconfirm title="确认删除？" @confirm="handleDel">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增用户 -->
    <!-- 
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
     -->
  </div>
</template>

<style lang="scss" scoped>
.user-manage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .form-table {
    padding-left: 10px;
  }
}
</style>

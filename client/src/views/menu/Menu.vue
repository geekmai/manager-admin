<script lang="ts" setup>
import { onMounted, reactive, ref, toRaw, nextTick } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { getMenuList, menuSubmit } from '@/api/userApi'
import type { FormInstance, FormRules } from 'element-plus'
import { formaDate } from '@/utils'

const menuList = ref([])
// 页面加载时发起请求获取数据
const getMenuLists = async () => {
  try {
    let list: any = await getMenuList(menuForm)
    menuList.value = list.data
    console.log(menuList.value)
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

// 处理表单取消功能
const handelAddMenuCancel = (formEl: FormInstance | undefined) => {
  // 关闭弹窗
  dialogFormVisible.value = false
  // 清空表单
  if (!formEl) return
  formEl.resetFields()
}

/**
 * 新增菜单功能
 */

// 控制弹出窗是否显示
const dialogFormVisible = ref(false)
// 获取表单 DOM
const addMenuForm = ref<FormInstance>()

// 初始化新增菜单对象
const newMenuForm = reactive({
  parentId: [''],
  menuType: 1,
  menuName: '',
  icon: 'orange',
  path: '',
  menuCode: '',
  component: '',
  menuState: 1
})

// 表单校验规则
const rules = reactive<FormRules>({
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 6, message: '菜单长度应该在 2～4 个字', trigger: 'blur' }
  ]
})

// 控制是新增、编辑、还是删除
const action = ref('')
// 新增
interface IMenuForm {
  parentId: Array<string>
  menuType: number
  menuName: string
  icon: string
  path: string
  menuCode: string
  component: string
  state: number
  _id: string
}
// 处理新增
const handleAdd = (type: number, row?: IMenuForm) => {
  // num=1,代表是左上方的新增按钮，num=2，代表每行右侧的新增按钮
  dialogFormVisible.value = true
  action.value = 'add'
  if (type == 2) {
    // 拼接父级路由的 ID
    newMenuForm.parentId = [...(row as IMenuForm).parentId, (row as IMenuForm)._id].filter((item) => item)
  }
}
// 处理提交
const handleSubmit = (formEl: FormInstance | undefined) => {
  addMenuForm.value?.validate(async (valid) => {
    if (valid) {
      const actionValue = action.value
      // 将 proxy 格式转成普通数组
      const parentIdValue = toRaw(newMenuForm.parentId)
      let params = { ...newMenuForm, parentId: parentIdValue, action: actionValue }
      console.log(params)
      try {
        await menuSubmit(params)
        dialogFormVisible.value = false
        ElMessage.success('操作成功')
        // 重置表单
        handleReset(addMenuForm.value)
        // 重新加载
        getMenuLists()
      } catch (error) {
        console.log(error)
      }
    }
  })
}
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
          <el-button type="primary" @click="getMenuLists">查询</el-button>
          <el-button @click="handleReset(queryForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单展示 -->
    <div class="base-table">
      <!-- 增加、批量删除按钮 -->
      <div class="action">
        <el-button type="primary" size="default" @click="handleAdd(1)">新增</el-button>
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
            <el-button size="small" type="primary" @click="handleAdd(2, scope.row)">新增</el-button>
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
    <!-- 新增菜单 -->
    <el-dialog v-model="dialogFormVisible" title="新增菜单" width="30%">
      <el-form :model="newMenuForm" ref="addMenuForm" label-width="80px" :inline="false" size="default" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
            v-model="newMenuForm.parentId"
          />
          <span>不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="newMenuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="newMenuForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="newMenuForm.menuType == 1">
          <el-input v-model="newMenuForm.icon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="newMenuForm.menuType == 1">
          <el-input v-model="newMenuForm.path" placeholder="请输入路由地址"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="newMenuForm.menuType == 1">
          <el-input v-model="newMenuForm.component" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="newMenuForm.menuType == 2">
          <el-input v-model="newMenuForm.menuCode" placeholder="请输入权限标识"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="newMenuForm.menuType == 1">
          <el-radio-group v-model="newMenuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handelAddMenuCancel(addMenuForm)">取消</el-button>
          <el-button type="primary" @click="handleSubmit(addMenuForm)">确认</el-button>
        </span>
      </template>
    </el-dialog>
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

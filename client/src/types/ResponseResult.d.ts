// 后端返回数据的类型声明，根据后端数据结构进行修改
export interface ResponseResult<T> {
  // success: boolean
  code: number
  msg: string
  data: T
  //data 的数据类型是不确定的可变的，这里使用了泛型
}

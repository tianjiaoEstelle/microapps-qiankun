import { defineStore } from 'pinia'

export interface UITYpe {
  id: string
  itemLabel: string
  itemKey: string
}
export interface userType {
  userId?: string
  uid?: string
  did?: string
  companyId?: string
  jobsId?: string
  templateId?: string //模板id
  templateName?: string //模板名称
  isDefault?: string //1 默认字段  0非默认字段
  pageType?: string //页面类型 'detail' 'companyDetail' 'edit' 'preview'
  pageSource?: string
  UITypeMap?: Array<UITYpe>
}
const UITYPES = [
  'string',
  'number',
  'radio',
  'select',
  'checkbox',
  'date',
  'datePeriod',
  'year',
  'textarea',
  'img',
  'file',
  'switch',
]
// as userType
export const useUserstore = defineStore({
  id: 'user', // id必填，且需要唯一
  state: () => {
    return {
      userId: '',
      uid: '',
      did: '',
      companyId: '',
      jobsId: '',
      templateId: '', //模板id
      templateName: '', //模板名称
      isDefault: '0', //1 默认字段  0非默认字段
      pageType: '', //页面类型 'detail' 'companyDetail' 'edit' 'preview'
      pageSource: '', //'jobApply' 岗位申请来的
      UITypeMap: [],
    } as userType
  },
  actions: {
    updateUserData(data: userType) {
      for (const key in data) {
        this[key] = data[key]
      }
      // console.log(data, { ...this })
    },
    //页面来源
    updatePageSource(str: string) {
      this.pageSource = str
    },
    //下拉选项字典集
    updateUIType(data: any) {
      //过滤，去除没做的字段
      const fileterData = data.filter((item: UITYpe) =>
        UITYPES.includes(item.itemKey)
      )
      // console.log(fileterData)
      this.UITypeMap = fileterData
    },
    //页面类型
    updatePageType(val: string) {
      this.pageType = val
    },
  },
})

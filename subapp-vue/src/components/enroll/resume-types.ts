//模板类型
export interface templateList {
  moduleIcon: string
  moduleId: string
  moduleKey: string
  moduleTips: string
  moduleType: string
  moduleValue: string
  fieldsList: templateItem[]
}

export interface templateItem {
  id: string
  isEmpty: boolean
  key: string
  placeholder: string
  remark: string
  tips: string
  uiType: string
  value: string
}
export interface formListType {
  id: string
  moduleValue: string
  moduleKey: string
  fieldsList: string
}

export interface formType<T> {
  [key: string]: T
}

export interface formItem<T> {
  [key: string]: T
}
//每个控制框字段类型
export interface itemType {
  uiType: string
  id: string
  key: string
  isEmpty: boolean
  placeholder: string
  remark: string
  tips: string
  value: string
}
//多选数据每个字段类型
export interface fieldUiTpye {
  dictKey: string
  dictLabel: string
  id: string
  isShow: string
  itemKey: string
  itemLabel: string
  pid: string
  resumeFieldsId: string
  sort: number
}

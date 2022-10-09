import { get, post, del, exportFile } from '@/utils/request'
import { AnyColumns } from 'element-plus/es/components/table-v2/src/types'
export const api = {
  //根据控件类型配置字典项
  getDictKey: (param: any) => {
    return get('/dict/key', param)
  },
  //根据字段id获取字典项列表
  getDictFieldsByIds: (param: any) => {
    return get('/dict/fields', param)
  },
  //根据id获取简历展示字段
  getEnrollFieldsById: (param: any) => {
    return get('/enroll/fields', param)
  },
  //查询简历模块列表
  getEnrollModuleList: (param: any) => {
    return get('/resume/module/list', param)
  },
  //增加、修改简历模块(表单)
  updateEnrollModuleList: (param: any) => {
    return post('/resume/module', param)
  },
  //删除简历模块(模块id)
  deleteEnrollModuleList: (param: any) => {
    return get('/resume/module/delete', param)
  },
  //根据模块id 分页查询对应字段
  getEnrollModuleFieldsList: (param: any) => {
    return get('/resume/fields/page', param)
  },
  //增加、修改简历字段
  updateEnrollModuleFieldsList: (param: any) => {
    return post('/resume/fields', param)
  },
  //删除简历字段
  deleteEnrollModuleFieldsList: (param: any) => {
    return get('/resume/fields/delete', param)
  },
  //查询简历模板列表
  getResumeTemplateList: (param: any) => {
    return get('/resume/template/page', param)
  },
  //增加、修改简历模板列表
  updateResumeTemplateList: (param: any) => {
    return post('/resume/template', param)
  },
  //删除简历模板列表
  delResumeTemplateList: (param: any) => {
    return get('/resume/template/delete', param)
  },
  //字段模板及字段列表
  getFieldsTree: (param: any) => {
    return get('/resume/module/field/tree', param)
  },
  //配置简历模板模块和字段
  updateTemplateFielsd: (param: any) => {
    return post('/resume/template/config', param)
  },
  //查询配置的简历模板模块和字段
  getTemplateFieldsById: (param: any) => {
    return get('/resume/template', param)
  },
  //查询默认配置的简历模板模块和字段
  getDefaultTemplateFields: (param: any) => {
    return get('/resume/template/default', param)
  },
  //根据id查询岗位申请对应简历模板
  getResumeByDid: (param: any) => {
    return get('/resume/template/apply', param)
  },
  //暂存个人简历
  saveResume: (param: any) => {
    return post('/resume', param)
  },
  //查询个人简历
  getResume: (param: any) => {
    return get('/resume', param)
  },
  //查询默认个人简历
  getDefaultResume: (param: any) => {
    return get('/resume/default', param)
  },
  //岗位申请
  applyResume: (param: any) => {
    return post('/resume/apply', param)
  },
  //根据id查询岗位申请对应简历数据
  getResumeDataByDid: (param: any) => {
    return get('/resume/apply', param)
  },
  //导出报名表
  exportResume: (param: any) => {
    return get('/resume/template/form/export', param)
  },
  //上传报名表
  uploadEntryForm: (param: any) => {
    return post('/resume/template/form/upload', param)
  },
  //复制简历模板
  copyResume: (param: any) => {
    return post('/resume/template/copy', param)
  },
  //导出报名表字段
  exportFields: (param: any) => {
    return exportFile('/resume/template/form/exportFields', param)
  },
  //导出报名表字段
  resumeUpload: (param: any) => {
    return post('resume/upload', param)
  }
}

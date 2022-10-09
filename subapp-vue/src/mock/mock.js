import Mock from 'mockjs'

//根据id获取简历展示字段
Mock.mock('/enroll/fields', 'get', {
  retCode: '0',
  retMsg: '查询成功',
  info: {
    token: '@name'
  },
  list: {
    totalSize: 100,
    fieldsList: [
      {
        id: '1',
        name_en: 'jbzl',
        name_cn: '基本资料',
        icon: 'Avatar',
        children: [
          [
            {
              id: '101',
              name_en: 'xingming',
              name_cn: '姓名',
              type: 'text',
              type_cn: '文本框',
              category: '1',
              placeholder: '请输入姓名',
              instru: '',
              comment: ''
            },
            {
              id: '102',
              name_en: 'csrq',
              name_cn: '出生日期',
              type: 'date',
              type_cn: '日期框',
              category: '1',
              placeholder: '请选择出生日期',
              instru: '',
              comment: ''
            },
            {
              id: '103',
              name_en: 'mz',
              name_cn: '民族',
              type: 'select',
              type_cn: '下拉框',
              category: '2',
              placeholder: '请选择民族',
              instru: '',
              comment: ''
            },
            {
              id: '104',
              name_en: 'jzd',
              name_cn: '居住地',
              type: 'cascader',
              type_cn: '省市级联框',
              category: '2',
              placeholder: '请选择出生居住地',
              instru: '',
              comment: ''
            }
          ]
        ]
      },
      {
        id: '1',
        department_code: '0000',
        department_name: '财务部',
        time: '2019-03-26',
        branch_name: '总公司',
        type: '车间',
        charge_person: '赵敏',
        status: '启用',
        creator_name: '王宏',
        create_time: '2019-03-26 19:22:01',
        modifier_name: '大禹',
        modify_time: '2019-03-26 19:22:01'
      }
    ]
  }
})

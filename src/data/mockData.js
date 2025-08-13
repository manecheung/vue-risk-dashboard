// --- 模拟数据 (Mock Data) ---
export const MOCK_DASHBOARD_DATA = {
  keyMetrics: [{ title: '涵盖行业数', value: 1067, icon: 'M13 10V3L4 14h7v7l9-11h-7z' }, { title: '涵盖企业数', value: 59071, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.983' }, { title: '涵盖产品数', value: 12833, icon: 'M21 16V8a2 2 0 00-1-1.732l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.732l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' }],
  riskDistribution: [{ value: 18, name: '高风险企业' }, { value: 45, name: '中风险企业' }, { value: 120, name: '低风险企业' }],
  riskAnalysis: [
    { name: '哈尔滨电气集团有限公司', level: '高', levelClass: 'risk-high', reason: '营收数据缺失' },
    { name: '东方电气集团东方电机有限公司', level: '低', levelClass: 'risk-low', reason: '注册资本变更' },
    { name: '南京汽轮电机(集团)有限责任公司', level: '中', levelClass: 'risk-medium', reason: '财务数据缺失' },
    { name: '上海电气集团股份有限公司', level: '低', levelClass: 'risk-low', reason: '法人代表变更' },
    { name: '特变电工股份有限公司', level: '高', levelClass: 'risk-high', reason: '存在多起法律诉讼' },
    { name: '新疆金风科技股份有限公司', level: '中', levelClass: 'risk-medium', reason: '主要股东减持股份' },
    { name: '明阳智慧能源集团股份公司', level: '低', levelClass: 'risk-low', reason: '新增对外投资' },
    { name: '中国长江三峡集团有限公司', level: '低', levelClass: 'risk-low', reason: '经营范围变更' },
    { name: '中国核工业集团有限公司', level: '高', levelClass: 'risk-high', reason: '子公司涉及重大安全事故' },
    { name: '国家电力投资集团有限公司', level: '中', levelClass: 'risk-medium', reason: '海外项目投资收益未达预期' },
    { name: '华能国际电力开发公司', level: '低', levelClass: 'risk-low', reason: '发布年度社会责任报告' },
    { name: '国电电力发展股份有限公司', level: '中', levelClass: 'risk-medium', reason: '煤炭价格波动影响成本' },
    { name: '中国大唐集团有限公司', level: '高', levelClass: 'risk-high', reason: '负债率超过行业预警线' },
    { name: '国家能源投资集团有限责任公司', level: '低', levelClass: 'risk-low', reason: '完成多项技术创新' },
    { name: '深圳市能源集团股份有限公司', level: '中', levelClass: 'risk-medium', reason: '核心技术人员流失' }
  ],
  industryHealth: { categories: ['通信设备', '集成电路', '医疗器械', '新能源汽车', '风电产业链', '航空航天', '电子信息产业', '化学原料制品', '高端装备制造', '生物医药', '人工智能', '云计算与大数据', '现代物流', '新材料'], values: [10, 40, 15, 20, 70, 25, 60, 30, 55, 65, 80, 75, 45, 50] },
  supplyChainRisk: { indicator: [{ name: '技术风险', max: 100 }, { name: '信用风险', max: 100 }, { name: '法律风险', max: 100 }, { name: '财务风险', max: 100 }, { name: '产业链风险', max: 100 }, { name: '舆情风险', max: 100 }], data: [{ value: [85, 90, 60, 75, 95, 70], name: '风电行业产业链' }, { value: [70, 65, 80, 60, 80, 88], name: '集成电路产业链' }, { value: [50, 75, 70, 85, 60, 80], name: '新能源产业' }] },
  knowledgeGraph: {
    "nodes": [
      {
        "id": "2",
        "label": "崇德碳技术（苏州）有限公司",
        "size": 20
      },
      {
        "id": "7",
        "label": "大连沐铭机电设备有限公司",
        "size": 20
      },
      {
        "id": "15",
        "label": "丹麦展团-ENABL",
        "size": 20
      },
      {
        "id": "17",
        "label": "丹麦展团-Hoyer Motors",
        "size": 20
      },
      {
        "id": "21",
        "label": "丹麦展团-Resolux & Gexpo Service",
        "size": 20
      },
      {
        "id": "27",
        "label": "丹麦展团-科比电气系统（天津）有限公司",
        "size": 20
      },
      {
        "id": "28",
        "label": "丹麦展团-苏州莫迪温空气控制技术有限公司",
        "size": 20
      },
      {
        "id": "32",
        "label": "德蒂尔斯(北京)自动化设备贸易有限公司",
        "size": 20
      },
      {
        "id": "35",
        "label": "德国倍福自动化有限公司",
        "size": 20
      },
      {
        "id": "37",
        "label": "德国展团-艾查工业自动化产品（上海）有限公司",
        "size": 20
      },
      {
        "id": "58",
        "label": "德州恒力电机有限责任公司",
        "size": 20
      },
      {
        "id": "60",
        "label": "东方电气风电股份有限公司",
        "size": 20
      },
      {
        "id": "66",
        "label": "飞竞电机（深圳）有限公司",
        "size": 20
      },
      {
        "id": "75",
        "label": "福氏新能源技术（上海）有限公司",
        "size": 20
      },
      {
        "id": "76",
        "label": "福斯润滑油（中国）有限公司",
        "size": 20
      },
      {
        "id": "84",
        "label": "格恩诺智能科技（沈阳）有限公司",
        "size": 20
      },
      {
        "id": "90",
        "label": "广东河谷流体科技有限公司",
        "size": 20
      },
      {
        "id": "91",
        "label": "广东华蕴海上风电科技有限公司",
        "size": 20
      },
      {
        "id": "98",
        "label": "江西江特电机有限公司",
        "size": 20
      },
      {
        "id": "99",
        "label": "江西铭沣智能科技有限公司",
        "size": 20
      },
      {
        "id": "100",
        "label": "江西清华实业有限公司",
        "size": 20
      },
      {
        "id": "108",
        "label": "金风科技股份有限公司",
        "size": 20
      },
      {
        "id": "109",
        "label": "金雷科技股份公司",
        "size": 20
      },
      {
        "id": "110",
        "label": "金马新能源有限公司",
        "size": 20
      },
      {
        "id": "146",
        "label": "麦伽碳制品（上海）有限公司",
        "size": 20
      },
      {
        "id": "155",
        "label": "明阳智慧能源集团股份公司",
        "size": 20
      },
      {
        "id": "156",
        "label": "摩根新材料（上海）有限公司",
        "size": 20
      },
      {
        "id": "161",
        "label": "南京贝奇尔机械有限公司",
        "size": 20
      },
      {
        "id": "189",
        "label": "宁波欣格流体控制有限公司",
        "size": 20
      },
      {
        "id": "193",
        "label": "Carbex AB",
        "size": 20
      },
      {
        "id": "196",
        "label": "Des-Case",
        "size": 20
      },
      {
        "id": "202",
        "label": "SGL CARBON GmbH",
        "size": 20
      },
      {
        "id": "206",
        "label": "阿特拉斯·科普柯（上海）贸易有限公司",
        "size": 20
      },
      {
        "id": "208",
        "label": "艾尔姆（中国）投资有限公司",
        "size": 20
      },
      {
        "id": "209",
        "label": "艾郎科技股份有限公司",
        "size": 20
      },
      {
        "id": "210",
        "label": "艾迈特技术服务（上海）有限公司",
        "size": 20
      },
      {
        "id": "217",
        "label": "安徽成威消防科技有限公司",
        "size": 20
      },
      {
        "id": "218",
        "label": "安徽瀚程机械制造有限公司",
        "size": 20
      },
      {
        "id": "231",
        "label": "包头金山磁材有限公司",
        "size": 20
      },
      {
        "id": "240",
        "label": "北京爱信德科技有限公司",
        "size": 20
      },
      {
        "id": "246",
        "label": "北京东方乾海润滑设备有限公司",
        "size": 20
      },
      {
        "id": "281",
        "label": "北京煜安丰泰安全防范技术有限公司",
        "size": 20
      },
      {
        "id": "303",
        "label": "成都风发科技有限公司",
        "size": 20
      },
      {
        "id": "333",
        "label": "无锡风电设计研究院有限公司",
        "size": 20
      },
      {
        "id": "354",
        "label": "西安辰安电气有限公司",
        "size": 20
      },
      {
        "id": "355",
        "label": "西安太和机电科技有限公司",
        "size": 20
      },
      {
        "id": "359",
        "label": "西门子（中国）有限公司",
        "size": 20
      },
      {
        "id": "360",
        "label": "西门子能源有限公司",
        "size": 20
      },
      {
        "id": "390",
        "label": "阳光电源股份有限公司",
        "size": 20
      },
      {
        "id": "396",
        "label": "宜兴华永电机有限公司",
        "size": 20
      },
      {
        "id": "402",
        "label": "远大可建科技有限公司",
        "size": 20
      },
      {
        "id": "403",
        "label": "远景科技集团",
        "size": 20
      },
      {
        "id": "427",
        "label": "浙江威盾机械科技有限公司",
        "size": 20
      },
      {
        "id": "430",
        "label": "浙江运达风电股份有限公司",
        "size": 20
      },
      {
        "id": "433",
        "label": "郑州奥特科技有限公司",
        "size": 20
      },
      {
        "id": "437",
        "label": "郑州众城润滑科技有限公司",
        "size": 20
      },
      {
        "id": "440",
        "label": "中材科技风电叶片股份有限公司",
        "size": 20
      },
      {
        "id": "448",
        "label": "中科宇能科技发展有限公司",
        "size": 20
      },
      {
        "id": "456",
        "label": "重庆凯测试验设备股份有限公司",
        "size": 20
      },
      {
        "id": "461",
        "label": "重山贸易（连云港）有限公司",
        "size": 20
      },
      {
        "id": "463",
        "label": "株洲海昌机械制造有限公司",
        "size": 20
      },
      {
        "id": "470",
        "label": "广东旺电机电有限公司",
        "size": 20
      },
      {
        "id": "482",
        "label": "桂林星辰科技股份有限公司",
        "size": 20
      },
      {
        "id": "506",
        "label": "杭州微影智能科技有限公司",
        "size": 20
      },
      {
        "id": "507",
        "label": "杭州先锋电机厂",
        "size": 20
      },
      {
        "id": "525",
        "label": "黑龙江捷迅自动化设备有限公司",
        "size": 20
      },
      {
        "id": "528",
        "label": "恒进感应科技（十堰）股份有限公司",
        "size": 20
      },
      {
        "id": "529",
        "label": "衡水昕龙制动绝缘材料有限公司",
        "size": 20
      },
      {
        "id": "533",
        "label": "湖北宏重重型机械有限公司",
        "size": 20
      },
      {
        "id": "534",
        "label": "湖北汇富纳米材料股份有限公司",
        "size": 20
      },
      {
        "id": "542",
        "label": "湖南伊索尔复合材料有限公司",
        "size": 20
      },
      {
        "id": "544",
        "label": "湖南中普技术股份有限公司",
        "size": 20
      },
      {
        "id": "557",
        "label": "健安诚（内蒙古）新能源科技有限公司",
        "size": 20
      },
      {
        "id": "575",
        "label": "挪威展团-WindSim",
        "size": 20
      },
      {
        "id": "612",
        "label": "瑞欧威尔（上海）智能科技有限公司",
        "size": 20
      },
      {
        "id": "628",
        "label": "山东双一科技股份有限公司",
        "size": 20
      },
      {
        "id": "656",
        "label": "上海扩博智能技术有限公司",
        "size": 20
      },
      {
        "id": "667",
        "label": "上海申光高强度螺栓有限公司",
        "size": 20
      },
      {
        "id": "668",
        "label": "上海施依洛风机有限公司",
        "size": 20
      },
      {
        "id": "683",
        "label": "上海致远绿色能源股份有限公司",
        "size": 20
      },
      {
        "id": "695",
        "label": "深圳市禾望电气股份有限公司",
        "size": 20
      },
      {
        "id": "696",
        "label": "深圳市汇川技术股份有限公司",
        "size": 20
      },
      {
        "id": "702",
        "label": "深圳市润盈科技有限公司",
        "size": 20
      },
      {
        "id": "714",
        "label": "深圳众城卓越科技有限公司",
        "size": 20
      },
      {
        "id": "717",
        "label": "沈阳汉威机械制造有限公司",
        "size": 20
      },
      {
        "id": "734",
        "label": "四川川润液压润滑设备有限公司",
        "size": 20
      },
      {
        "id": "737",
        "label": "四川易卡朋科技有限公司",
        "size": 20
      },
      {
        "id": "747",
        "label": "苏州格远电气有限公司",
        "size": 20
      },
      {
        "id": "754",
        "label": "苏州新能健电气有限公司",
        "size": 20
      },
      {
        "id": "757",
        "label": "太原重型机械集团有限公司",
        "size": 20
      },
      {
        "id": "763",
        "label": "特变电工新疆新能源股份有限公司",
        "size": 20
      },
      {
        "id": "772",
        "label": "天津瑞源电气有限公司",
        "size": 20
      },
      {
        "id": "812",
        "label": "南方风机股份有限公司",
        "size": 20
      },
      {
        "id": "813",
        "label": "富通集团有限公司",
        "size": 20
      },
      {
        "id": "814",
        "label": "株洲时代新材料科技股份有限公司",
        "size": 20
      },
      {
        "id": "815",
        "label": "LM",
        "size": 20
      },
      {
        "id": "816",
        "label": "TPI Composites Inc/TPI复合材料公司",
        "size": 20
      },
      {
        "id": "817",
        "label": "重庆机电控股集团机电工程技术有限公司",
        "size": 20
      },
      {
        "id": "818",
        "label": "中国航天万源",
        "size": 20
      },
      {
        "id": "819",
        "label": "哈尔滨瑞风新能源有限公司",
        "size": 20
      },
      {
        "id": "820",
        "label": "中国建材集团有限公司",
        "size": 20
      },
      {
        "id": "821",
        "label": "维斯塔斯风力技术（中国）有限公司",
        "size": 20
      },
      {
        "id": "822",
        "label": "VESTAS WIND",
        "size": 20
      },
      {
        "id": "823",
        "label": "国电联合动力技术有限公司",
        "size": 20
      },
      {
        "id": "824",
        "label": "天津明阳风电设备有限公司",
        "size": 20
      },
      {
        "id": "825",
        "label": "Enercon/科隆展览（北京）有限公司",
        "size": 20
      },
      {
        "id": "826",
        "label": "中能风电设备有限公司",
        "size": 20
      },
      {
        "id": "827",
        "label": "中航惠腾风电设备股份有限公司",
        "size": 20
      },
      {
        "id": "828",
        "label": "上海玻璃钢研究院有限公司",
        "size": 20
      },
      {
        "id": "829",
        "label": "连云港中复连众复合材料集团有限公司",
        "size": 20
      },
      {
        "id": "839",
        "label": "大连重工装备集团有限公司",
        "size": 20
      },
      {
        "id": "840",
        "label": "江苏吉鑫风能科技股份有限公司",
        "size": 20
      },
      {
        "id": "841",
        "label": "一汽铸造有限公司",
        "size": 20
      },
      {
        "id": "842",
        "label": "本溪新兴盛机械制造有限公司",
        "size": 20
      },
      {
        "id": "843",
        "label": "重庆齿轮箱有限责任公司",
        "size": 20
      },
      {
        "id": "844",
        "label": "上海华模科技有限公司",
        "size": 20
      },
      {
        "id": "845",
        "label": "上海长京金属制作有限公司",
        "size": 20
      },
      {
        "id": "846",
        "label": "江苏国光重型机械有限公司",
        "size": 20
      },
      {
        "id": "847",
        "label": "许继电气股份有限公司",
        "size": 20
      },
      {
        "id": "848",
        "label": "Mita Tekink艾默生电气（中国）投资有限公司",
        "size": 20
      },
      {
        "id": "849",
        "label": "Ingeteam",
        "size": 20
      },
      {
        "id": "850",
        "label": "杭州和利时自动化有限公司",
        "size": 20
      },
      {
        "id": "851",
        "label": "美国超导",
        "size": 20
      },
      {
        "id": "852",
        "label": "中国航天万源国际（集团）有限公司",
        "size": 20
      },
      {
        "id": "853",
        "label": "国电南瑞南京控制系统有限公司",
        "size": 20
      },
      {
        "id": "854",
        "label": "北京科诺伟业科技股份有限公司",
        "size": 20
      },
      {
        "id": "855",
        "label": "惠亚电子科技（深圳）有限公司",
        "size": 20
      },
      {
        "id": "856",
        "label": "运达能源科技集团股份有限公司",
        "size": 20
      },
      {
        "id": "857",
        "label": "北京金风科创风电设备有限公司",
        "size": 20
      },
      {
        "id": "858",
        "label": "通用电气",
        "size": 20
      },
      {
        "id": "859",
        "label": "Regal Rexnord",
        "size": 20
      },
      {
        "id": "860",
        "label": "东方电气",
        "size": 20
      },
      {
        "id": "861",
        "label": "华电国际电力股份有限公司",
        "size": 20
      },
      {
        "id": "862",
        "label": "华能国际电力股份有限公司",
        "size": 20
      },
      {
        "id": "863",
        "label": "Gamesa",
        "size": 20
      },
      {
        "id": "864",
        "label": "远景能源有限公司",
        "size": 20
      },
      {
        "id": "865",
        "label": "重庆海装风电工程技术有限公司",
        "size": 20
      },
      {
        "id": "885",
        "label": "威伊艾姆电机（中国）有限公司",
        "size": 20
      },
      {
        "id": "886",
        "label": "Enel Chile",
        "size": 20
      },
      {
        "id": "887",
        "label": "Regal Rexnord Corporation",
        "size": 20
      },
      {
        "id": "888",
        "label": "先驱电气",
        "size": 20
      },
      {
        "id": "889",
        "label": "哈尔滨电气集团有限公司",
        "size": 20
      },
      {
        "id": "890",
        "label": "上海电气控股集团有限公司",
        "size": 20
      },
      {
        "id": "891",
        "label": "江西金力永磁科技股份有限公司",
        "size": 20
      },
      {
        "id": "892",
        "label": "VESTAS WI（维斯塔斯风力）",
        "size": 20
      },
      {
        "id": "893",
        "label": "Suzlon Energy Ltd/苏兹隆能源有限公司",
        "size": 20
      },
      {
        "id": "894",
        "label": "大连天元电机有限公司",
        "size": 20
      },
      {
        "id": "895",
        "label": "东方电气集团东风电机有限公司",
        "size": 20
      },
      {
        "id": "896",
        "label": "江苏新誉阿尔斯通牵引系统有限公司",
        "size": 20
      },
      {
        "id": "897",
        "label": "南京汽轮电力工程设计院有限公司",
        "size": 20
      },
      {
        "id": "898",
        "label": "中车株洲电机有限公司",
        "size": 20
      },
      {
        "id": "899",
        "label": "中车永济电机有限公司",
        "size": 20
      },
      {
        "id": "900",
        "label": "淄博牵引电机集团股份有限公司",
        "size": 20
      },
      {
        "id": "901",
        "label": "兰州电机股份有限公司",
        "size": 20
      },
      {
        "id": "902",
        "label": "上海泰胜风能装备股份有限公司",
        "size": 20
      },
      {
        "id": "903",
        "label": "大金重工股份有限公司",
        "size": 20
      },
      {
        "id": "904",
        "label": "甘肃酒钢集团宏兴钢铁股份有限公司",
        "size": 20
      },
      {
        "id": "905",
        "label": "内蒙古第一机械集团股份有限公司",
        "size": 20
      },
      {
        "id": "906",
        "label": "火焰山锅炉",
        "size": 20
      },
      {
        "id": "907",
        "label": "苏州安德利斯机电设备有限公司",
        "size": 20
      },
      {
        "id": "908",
        "label": "吉林天能电力工程机械有限公司",
        "size": 20
      },
      {
        "id": "909",
        "label": "北京世纪聚合风电技术有限公司",
        "size": 20
      },
      {
        "id": "910",
        "label": "青岛华亚钢结构有限公司",
        "size": 20
      },
      {
        "id": "911",
        "label": "河南省协和钢结构工程有限公司",
        "size": 20
      }
    ],
    "edges": [
      {
        "source": "889",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "894",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "354",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "825",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "842",
        "target": "860",
        "label": "合作(风电机组轮毂)",
        "type": "partner"
      },
      {
        "source": "98",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "763",
        "target": "860",
        "label": "合作(风电机组变流器系统)",
        "type": "partner"
      },
      {
        "source": "37",
        "target": "860",
        "label": "合作(风电机组机舱)",
        "type": "partner"
      },
      {
        "source": "2",
        "target": "895",
        "label": "合作(碳刷)",
        "type": "partner"
      },
      {
        "source": "15",
        "target": "60",
        "label": "合作(风电机组设计与仿真)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "903",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "852",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "60",
        "target": "333",
        "label": "合作(风电机组设计与仿真)",
        "type": "partner"
      },
      {
        "source": "359",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "757",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "155",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "821",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "846",
        "target": "860",
        "label": "合作(风电机组轮毂)",
        "type": "partner"
      },
      {
        "source": "668",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "7",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "403",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "859",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "847",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "84",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "217",
        "target": "860",
        "label": "合作(风电机组消防系统)",
        "type": "partner"
      },
      {
        "source": "507",
        "target": "860",
        "label": "合作(风电机组电气系统)",
        "type": "partner"
      },
      {
        "source": "84",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "910",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "189",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "897",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "696",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "894",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "355",
        "target": "860",
        "label": "合作(风电机组消防系统)",
        "type": "partner"
      },
      {
        "source": "628",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "895",
        "target": "899",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "865",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "898",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "430",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "862",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "403",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "240",
        "target": "860",
        "label": "合作(风电机组气象系统)",
        "type": "partner"
      },
      {
        "source": "895",
        "target": "898",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "202",
        "target": "895",
        "label": "合作(碳刷)",
        "type": "partner"
      },
      {
        "source": "66",
        "target": "860",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "146",
        "target": "895",
        "label": "合作(碳刷)",
        "type": "partner"
      },
      {
        "source": "820",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "58",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "857",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "440",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "856",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "109",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "430",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "193",
        "target": "895",
        "label": "合作(碳刷)",
        "type": "partner"
      },
      {
        "source": "60",
        "target": "575",
        "label": "合作(风电机组设计与仿真)",
        "type": "partner"
      },
      {
        "source": "863",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "817",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "100",
        "target": "860",
        "label": "合作(风电机组消防系统)",
        "type": "partner"
      },
      {
        "source": "58",
        "target": "860",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "893",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "841",
        "target": "860",
        "label": "合作(风电机组轮毂)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "909",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "28",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "542",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "60",
        "target": "683",
        "label": "合作(风电机组设计与仿真)",
        "type": "partner"
      },
      {
        "source": "461",
        "target": "860",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "893",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "911",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "857",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "848",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "828",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "888",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "907",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "815",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "890",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "772",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "437",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "858",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "396",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "856",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "533",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "861",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "812",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "76",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "281",
        "target": "860",
        "label": "合作(风电机组消防系统)",
        "type": "partner"
      },
      {
        "source": "862",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "895",
        "target": "901",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "891",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "390",
        "target": "860",
        "label": "合作(风电机组变流器系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "892",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "851",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "525",
        "target": "860",
        "label": "合作(风电机组电气系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "890",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "17",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "360",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "822",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "747",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "908",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "891",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "859",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "628",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "895",
        "target": "900",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "892",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "534",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "90",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "218",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "823",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "849",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "902",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "155",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "482",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "899",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "359",
        "target": "860",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "818",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "206",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "529",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "108",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "889",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "21",
        "target": "860",
        "label": "合作(风电机组机舱)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "904",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "886",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "854",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "75",
        "target": "860",
        "label": "合作(风电机组变流器系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "863",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "896",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "98",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "737",
        "target": "895",
        "label": "合作(碳刷)",
        "type": "partner"
      },
      {
        "source": "161",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "844",
        "target": "860",
        "label": "合作(风电机组轮毂)",
        "type": "partner"
      },
      {
        "source": "433",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "528",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "855",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "906",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "66",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "359",
        "target": "860",
        "label": "合作(风电机组变流器系统)",
        "type": "partner"
      },
      {
        "source": "865",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "887",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "717",
        "target": "860",
        "label": "合作(风电机组传动轴系)",
        "type": "partner"
      },
      {
        "source": "231",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "814",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "886",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "402",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "864",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "208",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "845",
        "target": "860",
        "label": "合作(风电机组轮毂)",
        "type": "partner"
      },
      {
        "source": "839",
        "target": "860",
        "label": "合作(风电机组轮毂)",
        "type": "partner"
      },
      {
        "source": "60",
        "target": "851",
        "label": "竞争(风电机组设计)",
        "type": "supplier"
      },
      {
        "source": "354",
        "target": "860",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "60",
        "target": "612",
        "label": "竞争(风电机组设计)",
        "type": "supplier"
      },
      {
        "source": "895",
        "target": "897",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "702",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "156",
        "target": "895",
        "label": "合作(碳刷)",
        "type": "partner"
      },
      {
        "source": "827",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "463",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "824",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "463",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "110",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "843",
        "target": "860",
        "label": "合作(风电机组轮毂)",
        "type": "partner"
      },
      {
        "source": "667",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "427",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "246",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "885",
        "target": "895",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "7",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "714",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "895",
        "target": "896",
        "label": "竞争(风电机组发电机)",
        "type": "supplier"
      },
      {
        "source": "754",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "819",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "231",
        "target": "860",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "108",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "60",
        "target": "91",
        "label": "竞争(风电机组设计)",
        "type": "supplier"
      },
      {
        "source": "860",
        "target": "885",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "448",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "206",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "557",
        "target": "860",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "668",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "209",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "303",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "826",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "506",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "864",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "544",
        "target": "860",
        "label": "合作(风电机组通信系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "888",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "887",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "667",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "35",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "109",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "32",
        "target": "860",
        "label": "合作(风电机组传动轴系)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "905",
        "label": "合作(风电机组塔筒)",
        "type": "partner"
      },
      {
        "source": "27",
        "target": "860",
        "label": "合作(风电机组电气系统)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "900",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "99",
        "target": "860",
        "label": "合作(风电机组消防系统)",
        "type": "partner"
      },
      {
        "source": "757",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "734",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "402",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "656",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "829",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "196",
        "target": "860",
        "label": "合作(风电机组润滑系统)",
        "type": "partner"
      },
      {
        "source": "813",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "396",
        "target": "860",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "901",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "189",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "17",
        "target": "860",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "858",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "210",
        "target": "860",
        "label": "合作(风电机组传动轴系)",
        "type": "partner"
      },
      {
        "source": "360",
        "target": "895",
        "label": "合作(风电机组发电机)",
        "type": "partner"
      },
      {
        "source": "456",
        "target": "860",
        "label": "合作(风电机组电气系统)",
        "type": "partner"
      },
      {
        "source": "110",
        "target": "860",
        "label": "竞争(风电机组)",
        "type": "supplier"
      },
      {
        "source": "840",
        "target": "860",
        "label": "合作(风电机组轮毂)",
        "type": "partner"
      },
      {
        "source": "470",
        "target": "860",
        "label": "合作(风电机组电气系统)",
        "type": "partner"
      },
      {
        "source": "695",
        "target": "860",
        "label": "合作(风电机组变桨系统)",
        "type": "partner"
      },
      {
        "source": "853",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "850",
        "target": "860",
        "label": "合作(风电机组主控系统)",
        "type": "partner"
      },
      {
        "source": "816",
        "target": "860",
        "label": "合作(风电机组叶片)",
        "type": "partner"
      },
      {
        "source": "860",
        "target": "861",
        "label": "竞争(风电机组)",
        "type": "supplier"
      }
    ]
  },
  mapData: [{ name: '东方电气', value: [104.065735, 30.659462, 100], risk: '低' }, { name: '新疆金风科技', value: [87.617733, 43.792818, 80], risk: '中' }, { name: '上海电气', value: [121.473701, 31.230416, 60], risk: '低' }, { name: '哈尔滨电气', value: [126.635446, 45.755053, 50], risk: '高' }, { name: '明阳智能', value: [113.383331, 23.133333, 40], risk: '中' }, { name: '中国中车', value: [116.407428, 39.904214, 90], risk: '低' }, { name: '特变电工', value: [87.584491, 43.825633, 75], risk: '高' }]
};
export const MOCK_MONITORING_DATA = {
  topNews: [
    { id: 1, type: 'news', title: '这是一个非常非常长的标题，用于专门测试当标题内容超出容器宽度时，是否能够正确地显示横向滚动条而不是简单地截断文本或者破坏布局。', author: '北极星风力发电网', date: '2024.11.12', image: '/风电.svg', tags: ['运维', '人才'], content: '<h4>Part 1. 行业风电行业快速发展</h4><p>根据国家能源局公开数据显示，截至2023年底，全国发电装机总量291965万千瓦。其中风电累计装机容量为44134万千瓦，占全国发电总装机量的15.11%。2023年全年，风电装机新增7590万千瓦，创历史新高。</p><p>随着全球能源转型的加速推进，风电作为重要清洁能源之一，其在全球能源结构中的占比将进一步提升。预计未来几年，全球风电新增装机容量仍将保持平稳增长态势。</p><h4>Part 2. 运维风电场的稳定运行</h4><p>风电场的稳定运行，是风电行业快速发展的重要保障。随着风电技术的不断进步和智能化趋势的加强，使得风电运维工作更加复杂和专业化。因此，进行实操培训以提升运维人员的技术能力和应对复杂情况的能力显得尤为重要。</p>' },
    { id: 2, type: 'news', title: '风电“抢装潮”退潮！华东勘测设计院发布5份行政处罚决定书', author: '北极星风力发电网', date: '2024.11.12', image: '/法规.svg', tags: ['法规', '处罚决定书'], content: '<h4>处罚详情</h4><p>经调查，华东勘测设计院在部分风电项目中存在未按工程设计图纸和施工技术标准施工的问题，违反了《建设工程质量管理条例》的相关规定。据此，相关监管部门依法对其作出了行政处罚决定，要求其立即停止违法行为，并处以相应罚款。</p><p>此次事件再次为行业敲响警钟，工程质量与安全管理是风电项目建设的生命线，任何环节都不能掉以轻心。</p>' },
    { id: 3, type: 'news', title: '新能源汽车下乡政策再加码，充电桩建设成关键', author: '第一财经', date: '2024.11.11', image: '/法规.svg', tags: ['政策', '汽车'], content: '<h4>政策推动</h4><p>为进一步推动新能源汽车在农村地区的普及，国家多部委联合发布新一轮“新能源汽车下乡”活动通知。本次活动将在全国多地开展，并提供更多优惠政策，包括购车补贴、充电优惠等。</p><p>专家指出，要让新能源汽车在农村“开得走、停得下、充得好”，必须加强农村地区充电基础设施的建设，解决消费者的“里程焦虑”和“充电焦虑”。</p>' },
    { id: 7, type: 'news', title: '光伏产业迎来新一轮技术迭代，N型电池成市场主流', author: '光伏资讯', date: '2024.11.08', image: '/法规.svg', tags: ['技术', '光伏'], content: '<h4>技术变革</h4><p>随着P型电池效率逐渐接近理论极限，光伏行业正加速向N型电池技术转型。TOPCon、HJT等N型技术路线凭借更高的转换效率和更低的衰减率，正迅速占领市场。多家头部企业已宣布大规模扩产N型电池产能，预计未来市场渗透率将持续攀升。</p>' },
    { id: 8, type: 'news', title: '“东数西算”工程全面启动，数据中心建设提速', author: '人民邮电报', date: '2024.11.07', image: '/法规.svg', tags: ['新基建', '数据中心'], content: '<h4>国家战略</h4><p>“东数西算”工程旨在通过构建新型算力网络体系，将东部密集的算力需求有序引导到西部可再生能源丰富的地区进行处理。目前，全国一体化算力网络国家枢纽节点已全部开工，这将极大优化我国数据中心布局，促进东西部协调发展。</p>' },
  ],
  riskNews: [
    { id: 4, type: 'risk', title: '漳州帆船配舾工程有限公司员工坠亡', author: '北极星风力发电网', date: '2024.11.12', image: '/风险.svg', tags: ['事故', '安全'], riskSource: '人员坠落, 抢救无效死亡', notice: '《通知》显示，2024年9月4日3时10分许，在漳浦县六鳌镇某船厂一新能源装备制造有限公司风电装备车间，漳州帆船配舾工程有限公司的1名员工在管桩机上进行绕管焊接作业准备中发生坠落，经抢救无效死亡。事故具体原因仍在调查中。', relatedCompany: '漳州帆船配舾工程有限公司', relatedProduct: '船舵总筒' },
    { id: 5, type: 'risk', title: '某上市公司财务造假被证监会立案调查，股价连续跌停引发市场恐慌，这是一个为了测试而设置的非常长的风险新闻标题', author: '证券时报', date: '2024.11.10', image: '/风险.svg', tags: ['财务风险', '调查'], riskSource: '涉嫌信息披露违法违规', notice: '公告显示，该公司因涉嫌信息披露违法违规，根据《中华人民共和国证券法》《中华人民共和国行政处罚法》等法律法规，中国证监会决定对公司立案。公司将全面配合中国证监会的相关工作，同时深刻反思，及时履行信息披露义务。', relatedCompany: '某科技股份有限公司', relatedProduct: '半导体芯片' },
    { id: 6, type: 'risk', title: '供应链中断，某手机厂商新款发布或将延迟', author: '供应链前沿', date: '2024.11.09', image: '/风险.svg', tags: ['供应链', '中断'], riskSource: '核心零部件供应不足', notice: '据行业消息人士透露，由于东南亚某关键零部件供应商工厂受洪水影响停产，某知名手机厂商即将发布的新款旗舰机型可能面临生产延迟。该零部件是手机摄像模组的核心元件，短期内难以找到替代供应商。', relatedCompany: '未来手机有限公司', relatedProduct: '旗舰智能手机' },
    { id: 9, type: 'risk', title: '数据安全漏洞曝光，知名社交平台用户隐私面临威胁', author: '网络安全观察', date: '2024.11.06', image: '/风险.svg', tags: ['数据安全', '隐私泄露'], riskSource: '数据库配置不当', notice: '安全研究人员发现，某知名社交平台的数据库因配置错误而暴露在公网，导致超过5000万用户的个人敏感信息（包括用户名、联系方式和地理位置）可被无密码访问。平台方已紧急修复漏洞并向监管机构报告。', relatedCompany: '无限连接社交网络公司', relatedProduct: '社交APP' },
    { id: 10, type: 'risk', title: '环保审查趋严，某化工企业因排污超标被责令停产整顿', author: '环保在线', date: '2024.11.05', image: '/风险.svg', tags: ['环保', '监管'], riskSource: '废水排放不符合国家标准', notice: '生态环境部门在一次突击检查中发现，某大型化工企业的废水排放口化学需氧量（COD）和氨氮浓度严重超标。执法部门已当场下达《责令停产整治决定书》，要求其立即停产，并处以高额罚款，后续还将追究相关负责人责任。', relatedCompany: '创新化学材料有限公司', relatedProduct: '特种聚合物' },
  ]
};
export const MOCK_SUPPLYCHAIN_DATA = {
  summary: { networkRisk: '中', highRiskCount: 101, mediumRiskCount: 564, lowRiskCount: 322 },
  companies: [
    { id: 1, name: '哈尔滨电气集团有限公司（这是一个为了测试表格横向滚动而故意设置的超长公司名称）', industry: '制造-装备产业', tech: '低', finance: '高', law: '中', credit: '低', reason: '营收数据缺失，且连续三个季度下滑，现金流紧张，存在短期偿债风险' },
    { id: 2, name: '东方电气集团东方电机有限公司', industry: '制造-装备产业', tech: '低', finance: '低', law: '中', credit: '中', reason: '注册资本变更' },
    { id: 3, name: '南京汽轮电机(集团)有限责任公司', industry: '制造-装备产业', tech: '低', finance: '中', law: '中', credit: '高', reason: '财务数据缺失' },
    { id: 4, name: '上海电气集团股份有限公司', industry: '制造-装备产业', tech: '中', finance: '低', law: '低', credit: '低', reason: '法人代表变更' },
    { id: 5, name: '新疆金风科技股份有限公司', industry: '新能源产业', tech: '高', finance: '中', law: '高', credit: '中', reason: '涉及多起与供应商的合同纠纷法律诉讼' },
    { id: 6, name: '明阳智慧能源集团股份公司', industry: '新能源产业', tech: '中', finance: '中', law: '低', credit: '低', reason: '研发投入占比下降' },
    { id: 7, name: '中国中车股份有限公司', industry: '制造-装备产业', tech: '高', finance: '低', law: '低', credit: '低', reason: '无明显风险' },
    { id: 8, name: '特变电工股份有限公司', industry: '新能源产业', tech: '高', finance: '高', law: '中', credit: '中', reason: '短期偿债压力较大' },
    { id: 9, name: '宁德时代新能源科技股份有限公司', industry: '新能源产业', tech: '高', finance: '低', law: '低', credit: '低', reason: '无明显风险' },
    { id: 10, name: '比亚迪股份有限公司', industry: '新能源产业', tech: '高', finance: '中', law: '低', credit: '中', reason: '资产负债率偏高' },
    { id: 11, name: '隆基绿能科技股份有限公司', industry: '新能源产业', tech: '中', finance: '低', law: '低', credit: '低', reason: '无明显风险' },
    { id: 12, name: '三一重工股份有限公司', industry: '制造-装备产业', tech: '中', finance: '中', law: '中', credit: '低', reason: '海外市场销售额不及预期' },
    { id: 13, name: '中联重科股份有限公司', industry: '制造-装备产业', tech: '中', finance: '中', law: '低', credit: '中', reason: '应收账款周转率下降' },
    { id: 14, name: '徐工集团工程机械有限公司', industry: '制造-装备产业', tech: '中', finance: '低', law: '低', credit: '低', reason: '无明显风险' },
    { id: 15, name: '华为技术有限公司', industry: '电子信息产业', tech: '高', finance: '低', law: '高', credit: '低', reason: '受到国际贸易政策影响，供应链存在不确定性' },
    { id: 16, name: '中兴通讯股份有限公司', industry: '电子信息产业', tech: '高', finance: '中', law: '中', credit: '中', reason: '5G基站核心芯片依赖进口' },
    { id: 17, name: '京东方科技集团股份有限公司', industry: '电子信息产业', tech: '高', finance: '中', law: '低', credit: '低', reason: '面板价格周期性波动影响盈利' },
    { id: 18, name: '中芯国际集成电路制造有限公司', industry: '集成电路', tech: '高', finance: '高', law: '高', credit: '中', reason: '先进制程工艺研发投入巨大，且受外部技术限制' },
    { id: 19, name: '立讯精密工业股份有限公司', industry: '电子信息产业', tech: '中', finance: '中', law: '低', credit: '中', reason: '对单一重要客户的依赖度过高' },
    { id: 20, name: '歌尔股份有限公司', industry: '电子信息产业', tech: '中', finance: '高', law: '低', credit: '中', reason: '存货规模较大，存在跌价风险' },
    { id: 21, name: '药明康德新药开发有限公司', industry: '生物医药', tech: '高', finance: '低', law: '中', credit: '低', reason: '临床试验数据涉及的隐私和合规风险' },
    { id: 22, name: '恒瑞医药集团有限公司', industry: '生物医药', tech: '高', finance: '中', law: '低', credit: '低', reason: '新药研发失败风险，投入高昂但产出不确定' },
    { id: 23, name: '迈瑞生物医疗电子股份有限公司', industry: '医疗器械', tech: '高', finance: '低', law: '中', credit: '低', reason: '产品需通过多国医疗器械认证，周期长且标准不一' },
    { id: 24, name: '顺丰控股股份有限公司', industry: '现代物流', tech: '中', finance: '中', law: '低', credit: '低', reason: '燃油成本上升及人力成本持续增加' },
    { id: 25, name: '万华化学集团股份有限公司', industry: '化学原料制品', tech: '高', finance: '中', law: '中', credit: '低', reason: '原材料价格受国际原油价格波动影响大' }
  ]
};
export const MOCK_SYSTEM_DATA = {
  users: [
    { id: 1, username: 'admin', name: '张三', role: '系统管理员', organization: '总部', status: '正常', lastLogin: '2024-11-12 10:30:15' },
    { id: 2, username: 'analyst_li', name: '李四', role: '风险分析师', organization: '风险控制部', status: '正常', lastLogin: '2024-11-12 09:15:22' },
    { id: 3, username: 'viewer_wang', name: '王五', role: '普通用户', organization: '市场部', status: '正常', lastLogin: '2024-11-11 15:48:01' },
    { id: 4, username: 'disabled_zhao', name: '赵六', role: '普通用户', organization: '市场部', status: '已禁用', lastLogin: '2024-10-01 11:20:33' },
  ],
  roles: [
    { id: 1, name: '系统管理员', description: '拥有系统的全部权限，可以管理用户、角色和组织。', permissions: ['用户管理', '角色管理', '组织管理', '风险预警查看', '风险模拟'] },
    { id: 2, name: '风险分析师', description: '可以查看风险数据并进行蔓延模拟。', permissions: ['风险预警查看', '风险模拟'] },
    { id: 3, name: '普通用户', description: '仅能查看首页看板和预警信息。', permissions: ['风险预警查看'] },
  ],
  organizations: [
    { id: 1, name: '总部', parent: '-', manager: '张三', userCount: 5 },
    { id: 2, name: '风险控制部', parent: '总部', manager: '李四', userCount: 12 },
    { id: 3, name: '市场部', parent: '总部', manager: '王五', userCount: 8 },
    { id: 4, name: '研发一部', parent: '总部', manager: '待定', userCount: 25 },
  ],
  allPermissions: [
    '用户管理', '角色管理', '组织管理', '风险预警查看', '风险模拟', '供应链评估', '系统设置', '数据导出'
  ]
};
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
    nodes: [
      { id: 'node0', size: 60, label: '核心企业', style: { fill: '#f59e0b', lineWidth: 3 }, labelCfg: { style: { fill: '#fff' } } },
      { id: 'node1', size: 40, label: '供应商A' }, { id: 'node2', size: 40, label: '供应商B' },
      { id: 'node3', size: 40, label: '客户A' }, { id: 'node4', size: 40, label: '客户B' },
      { id: 'node5', size: 40, label: '合作伙伴A' }, { id: 'node6', size: 40, label: '物流公司C' },
      { id: 'node7', size: 20, label: '原材料供应商D' }
    ],
    edges: [
      { source: 'node1', target: 'node0', label: '供应', type: 'supplier' }, { source: 'node2', target: 'node0', label: '供应', type: 'supplier' },
      { source: 'node0', target: 'node3', label: '销售', type: 'customer' }, { source: 'node0', target: 'node4', label: '销售', type: 'customer' },
      { source: 'node0', target: 'node5', label: '合作', type: 'partner' }, { source: 'node0', target: 'node6', label: '物流', type: 'partner' },
      { source: 'node7', target: 'node1', label: '供应', type: 'supplier' }
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
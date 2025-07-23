### **产业链风险预警系统 API接口文档**

**版本: 1.0**

**最后更新日期: 2025-07-22**

-----

#### **1. 概述**

本文档为产业链风险预警系统的前后端API接口规约，旨在为开发团队提供清晰、完整、无歧义的接口定义。所有接口均需遵循本文档进行设计、开发与测试。

**根路径 (Base URL):** `/api`

**认证方式:** 除登录接口外，所有API请求均需在HTTP Header中携带认证Token。

`Authorization: Bearer <your_jwt_token>`

**统一响应结构:**

  * **成功响应:**
    ```json
    {
      "code": 200,       // 状态码，200表示成功
      "message": "操作成功", // 描述信息
      "data": { ... }    // 或 [ ... ]，实际响应数据
    }
    ```
  * **失败响应:**
    ```json
    {
      "code": 500,       // 业务错误码 (如 400, 401, 403, 404, 500)
      "message": "错误描述", // 详细错误信息
      "data": null
    }
    ```

-----

#### **2. 认证接口 (Authentication)**

##### **2.1 用户登录**

  * **接口名称:** 用户登录
  * **请求方法:** `POST`
  * **请求路径:** `/api/auth/login`
  * **接口描述:** 用户通过用户名和密码进行登录，成功后返回JWT Token。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "username": "admin",
      "password": "password123"
    }
    ```
    **字段说明:**
      * `username` (string, required): 用户在系统中注册的唯一登录名。
      * `password` (string, required): 用户的登录密码 (建议在传输前进行加密处理)。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "登录成功",
      "data": {
        "token": "eyJh...G4s",
        "expiresIn": 7200
      }
    }
    ```
    **字段说明:**
      * `token` (string): JWT认证令牌，后续请求需在HTTP Header的`Authorization`字段中携带。
      * `expiresIn` (number): Token的有效时间，单位为秒。

-----

#### **3. 首页仪表盘模块 (Dashboard)**

##### **3.1 获取关键指标**

  * **接口名称:** 获取关键指标数据
  * **请求方法:** `GET`
  * **请求路径:** `/api/dashboard/key-metrics`
  * **接口描述:** 获取首页顶部的关键统计指标。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": [
        {
          "title": "涵盖行业数",
          "value": 1067,
          "icon": "M13 10V3L4 14h7v7l9-11h-7z"
        },
        {
          "title": "涵盖企业数",
          "value": 59071,
          "icon": "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.983"
        },
        {
          "title": "涵盖产品数",
          "value": 12833,
          "icon": "M21 16V8a2 2 0 00-1-1.732l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.732l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
        }
      ]
    }
    ```
    **字段说明:**
      * `title` (string): 指标的中文名称。
      * `value` (number): 指标的具体数值。
      * `icon` (string): 用于前端展示的SVG图标路径数据。

##### **3.2 获取风险企业分布 (饼图)**

  * **接口名称:** 获取风险企业分布
  * **请求方法:** `GET`
  * **请求路径:** `/api/dashboard/risk-distribution`
  * **接口描述:** 为`RiskPieChart.vue`组件提供数据，展示不同风险等级的企业数量分布。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": [
        { "value": 18, "name": "高风险企业" },
        { "value": 45, "name": "中风险企业" },
        { "value": 120, "name": "低风险企业" }
      ]
    }
    ```
    **字段说明:**
      * `value` (number): 对应风险等级的企业数量。
      * `name` (string): 风险等级的名称，用作饼图的图例和标签。

##### **3.3 获取行业健康度排行 (条形图)**

  * **接口名称:** 获取行业健康度排行
  * **请求方法:** `GET`
  * **请求路径:** `/api/dashboard/industry-health`
  * **接口描述:** 为`HealthBarChart.vue`组件提供数据，展示各行业的健康度评分。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "categories": ["通信设备", "集成电路", "医疗器械", "新能源汽车", "风电产业链", "航空航天", "电子信息产业", "化学原料制品", "高端装备制造", "生物医药", "人工智能", "云计算与大数据", "现代物流", "新材料"],
        "values": [10, 40, 15, 20, 70, 25, 60, 30, 55, 65, 80, 75, 45, 50]
      }
    }
    ```
    **字段说明:**
      * `categories` (array of strings): 条形图的类别轴数据，代表行业名称。
      * `values` (array of numbers): 与`categories`一一对应的数值，代表各行业的健康度评分。

##### **3.4 获取产业链风险分析 (雷达图)**

  * **接口名称:** 获取产业链风险分析
  * **请求方法:** `GET`
  * **请求路径:** `/api/dashboard/supply-chain-risk`
  * **接口描述:** 为`RiskRadarChart.vue`组件提供数据，从多个维度分析各产业链的风险。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "indicator": [
          { "name": "技术风险", "max": 100 },
          { "name": "信用风险", "max": 100 },
          { "name": "法律风险", "max": 100 },
          { "name": "财务风险", "max": 100 },
          { "name": "产业链风险", "max": 100 },
          { "name": "舆情风险", "max": 100 }
        ],
        "data": [
          { "value": [85, 90, 60, 75, 95, 70], "name": "风电行业产业链" },
          { "value": [70, 65, 80, 60, 80, 88], "name": "集成电路产业链" },
          { "value": [50, 75, 70, 85, 60, 80], "name": "新能源产业" }
        ]
      }
    }
    ```
    **字段说明:**
      * `indicator` (array of objects): 雷达图的指示器定义。
          * `name` (string): 风险维度的名称。
          * `max` (number): 该维度的最大值。
      * `data` (array of objects): 每个产业链的风险数据。
          * `value` (array of numbers): 各个风险维度的分值，顺序与`indicator`数组对应。
          * `name` (string): 产业链的名称。

##### **3.5 获取最新风险分析列表**

  * **接口名称:** 获取最新风险分析列表
  * **请求方法:** `GET`
  * **请求路径:** `/api/dashboard/risk-analysis`
  * **接口描述:** 为`RiskAnalysisTable.vue`组件提供数据，以分页的形式获取并展示最新识别出的风险企业列表。
  * **请求参数 (Query):**
      * `page` (number, optional, default: 1): 请求的数据页码。例如，当`pageSize`为10时，`page=1`返回第1-10条记录，`page=2`返回第11-20条记录。
      * `pageSize` (number, optional, default: 10): 每页返回的记录数量。前端可以根据需要调整此参数以实现不同的每页显示数量。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "page": 1,
        "pageSize": 10,
        "totalRecords": 15,
        "totalPages": 2,
        "hasPrevPage": false,
        "hasNextPage": true,
        "records": [
          { "name": "哈尔滨电气集团有限公司", "level": "高", "levelClass": "risk-high", "reason": "营收数据缺失" },
          { "name": "东方电气集团东方电机有限公司", "level": "低", "levelClass": "risk-low", "reason": "注册资本变更" },
          { "name": "南京汽轮电机(集团)有限责任公司", "level": "中", "levelClass": "risk-medium", "reason": "财务数据缺失" },
          { "name": "上海电气集团股份有限公司", "level": "低", "levelClass": "risk-low", "reason": "法人代表变更" },
          { "name": "特变电工股份有限公司", "level": "高", "levelClass": "risk-high", "reason": "存在多起法律诉讼" },
          { "name": "新疆金风科技股份有限公司", "level": "中", "levelClass": "risk-medium", "reason": "主要股东减持股份" },
          { "name": "明阳智慧能源集团股份公司", "level": "低", "levelClass": "risk-low", "reason": "新增对外投资" },
          { "name": "中国长江三峡集团有限公司", "level": "低", "levelClass": "risk-low", "reason": "经营范围变更" },
          { "name": "中国核工业集团有限公司", "level": "高", "levelClass": "risk-high", "reason": "子公司涉及重大安全事故" },
          { "name": "国家电力投资集团有限公司", "level": "中", "levelClass": "risk-medium", "reason": "海外项目投资收益未达预期" }
        ]
      }
    }
    ```
    **响应数据字段说明:**
      * `page` (number): 当前返回的是第几页的数据。
      * `pageSize` (number): 当前分页的每页记录数。
      * `totalRecords` (number): 符合查询条件的总记录数。
      * `totalPages` (number): 根据 `totalRecords` 和 `pageSize` 计算出的总页数。
      * `hasPrevPage` (boolean): 是否存在上一页。`true` 表示存在，`false` 表示不存在（当前是第一页）。
      * `hasNextPage` (boolean): 是否存在下一页。`true` 表示存在，`false` 表示不存在（当前是最后一页）。
      * `records` (array of objects): 当前页的风险企业记录对象数组。
          * `name` (string): 企业的完整法定名称。
          * `level` (string): 风险等级的文本描述，值为 "高"、"中" 或 "低"。
          * `levelClass` (string): 用于前端UI渲染的CSS类名，与风险等级对应，例如 `risk-high`, `risk-medium`, `risk-low`。
          * `reason` (string): 对该企业被识别为风险的具体原因的简要文字说明。

##### **3.6 获取风险企业地图分布**

  * **接口名称:** 获取风险企业地图分布
  * **请求方法:** `GET`
  * **请求路径:** `/api/dashboard/risk-map`
  * **接口描述:** 为`ChinaMap.vue`组件提供数据，展示风险企业在地图上的分布。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": [
        { "name": "东方电气", "value": [104.065735, 30.659462, 100], "risk": "低" },
        { "name": "新疆金风科技", "value": [87.617733, 43.792818, 80], "risk": "中" },
        { "name": "上海电气", "value": [121.473701, 31.230416, 60], "risk": "低" },
        { "name": "哈尔滨电气", "value": [126.635446, 45.755053, 50], "risk": "高" },
        { "name": "明阳智能", "value": [113.383331, 23.133333, 40], "risk": "中" },
        { "name": "中国中车", "value": [116.407428, 39.904214, 90], "risk": "低" },
        { "name": "特变电工", "value": [87.584491, 43.825633, 75], "risk": "高" }
      ]
    }
    ```
    **字段说明:**
      * `name` (string): 企业简称，用于地图tooltip显示。
      * `value` (array): 包含经度、纬度和一个附加值的数组 `[经度, 纬度, 数值]`，数值可用于控制点的大小或颜色。
      * `risk` (string): 风险等级的文本描述 ("高", "中", "低")。

##### **3.7 获取产业链知识图谱数据**

  * **接口名称:** 获取产业链知识图谱数据
  * **请求方法:** `GET`
  * **请求路径:** `/api/chain-risk/graph`
  * **接口描述:** 获取核心企业及其上下游关联企业的节点和边数据，用于`KnowledgeGraph.vue`渲染。
  * **请求参数 (Query):**
      * `companyId` (string, optional): 核心企业的ID。如果为空，返回默认或示例图谱。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "nodes": [
          { "id": "node0", "size": 60, "label": "核心企业", "style": { "fill": "#f59e0b", "lineWidth": 3 }, "labelCfg": { "style": { "fill": "#fff" } } },
          { "id": "node1", "size": 40, "label": "供应商A" },
          { "id": "node2", "size": 40, "label": "供应商B" },
          { "id": "node3", "size": 40, "label": "客户A" },
          { "id": "node4", "size": 40, "label": "客户B" },
          { "id": "node5", "size": 40, "label": "合作伙伴A" },
          { "id": "node6", "size": 40, "label": "物流公司C" },
          { "id": "node7", "size": 20, "label": "原材料供应商D" }
        ],
        "edges": [
          { "source": "node1", "target": "node0", "label": "供应", "type": "supplier" },
          { "source": "node2", "target": "node0", "label": "供应", "type": "supplier" },
          { "source": "node0", "target": "node3", "label": "销售", "type": "customer" },
          { "source": "node0", "target": "node4", "label": "销售", "type": "customer" },
          { "source": "node0", "target": "node5", "label": "合作", "type": "partner" },
          { "source": "node0", "target": "node6", "label": "物流", "type": "partner" },
          { "source": "node7", "target": "node1", "label": "供应", "type": "supplier" }
        ]
      }
    }
    ```
    **字段说明:**
      * `nodes` (array of objects): 图谱的节点列表。
          * `id` (string): 节点的唯一标识符。
          * `size` (number): 节点的显示尺寸。
          * `label` (string): 节点的显示文本。
          * `style` (object, optional): 节点的自定义样式。
          * `labelCfg` (object, optional): 节点标签的配置。
      * `edges` (array of objects): 图谱的边列表，定义节点间的关系。
          * `source` (string): 边的起始节点ID。
          * `target` (string): 边的目标节点ID。
          * `label` (string): 边的关系文本。
          * `type` (string): 边的类型标识。

-----

#### **4. 风险监测模块 (Monitoring)**

##### **4.1 获取监测资讯列表**

  * **接口名称:** 获取监测资讯列表
  * **请求方法:** `GET`
  * **请求路径:** `/api/monitoring/articles`
  * **接口描述:** 分页获取系统监测到的各类资讯，包括行业新闻(news)和风险预警(risk)。支持按资讯类型和关键词进行灵活筛选和搜索。
  * **请求参数 (Query):**
      * `page` (number, optional, default: 1): 请求的数据页码。
      * `pageSize` (number, optional, default: 10): 每页返回的记录数量。
      * `type` (string, optional): 资讯类型。传递 `'news'` 则只返回新闻类资讯，传递 `'risk'` 则只返回风险类资讯。如果此参数为空或不传递，则返回所有类型的资讯。
      * `keyword` (string, optional): 搜索关键词。后端将使用此关键词在资讯的`title`（标题）或`tags`（标签）字段中进行模糊匹配搜索。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "page": 1,
        "pageSize": 10,
        "totalRecords": 10,
        "totalPages": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "records": [
            { "id": 1, "type": "news", "title": "这是一个非常非常长的标题，用于专门测试当标题内容超出容器宽度时，是否能够正确地显示横向滚动条而不是简单地截断文本或者破坏布局。", "author": "北极星风力发电网", "date": "2024.11.12", "image": "/风电.svg", "tags": ["运维", "人才"] },
            { "id": 2, "type": "news", "title": "风电“抢装潮”退潮！华东勘测设计院发布5份行政处罚决定书", "author": "北极星风力发电网", "date": "2024.11.12", "image": "/法规.svg", "tags": ["法规", "处罚决定书"] },
            { "id": 3, "type": "news", "title": "新能源汽车下乡政策再加码，充电桩建设成关键", "author": "第一财经", "date": "2024.11.11", "image": "/法规.svg", "tags": ["政策", "汽车"] },
            { "id": 4, "type": "risk", "title": "漳州帆船配舾工程有限公司员工坠亡", "author": "北极星风力发电网", "date": "2024.11.12", "image": "/风险.svg", "tags": ["事故", "安全"] },
            { "id": 5, "type": "risk", "title": "某上市公司财务造假被证监会立案调查，股价连续跌停引发市场恐慌，这是一个为了测试而设置的非常长的风险新闻标题", "author": "证券时报", "date": "2024.11.10", "image": "/风险.svg", "tags": ["财务风险", "调查"] },
            { "id": 6, "type": "risk", "title": "供应链中断，某手机厂商新款发布或将延迟", "author": "供应链前沿", "date": "2024.11.09", "image": "/风险.svg", "tags": ["供应链", "中断"] },
            { "id": 7, "type": "news", "title": "光伏产业迎来新一轮技术迭代，N型电池成市场主流", "author": "光伏资讯", "date": "2024.11.08", "image": "/法规.svg", "tags": ["技术", "光伏"] },
            { "id": 8, "type": "news", "title": "“东数西算”工程全面启动，数据中心建设提速", "author": "人民邮电报", "date": "2024.11.07", "image": "/法规.svg", "tags": ["新基建", "数据中心"] },
            { "id": 9, "type": "risk", "title": "数据安全漏洞曝光，知名社交平台用户隐私面临威胁", "author": "网络安全观察", "date": "2024.11.06", "image": "/风险.svg", "tags": ["数据安全", "隐私泄露"] },
            { "id": 10, "type": "risk", "title": "环保审查趋严，某化工企业因排污超标被责令停产整顿", "author": "环保在线", "date": "2024.11.05", "image": "/风险.svg", "tags": ["环保", "监管"] }
        ]
      }
    }
    ```
    **响应数据字段说明:**
      * `page` (number): 当前页码。
      * `pageSize` (number): 每页记录数。
      * `totalRecords` (number): 符合查询条件的总记录数。
      * `totalPages` (number): 总页数。
      * `hasPrevPage` (boolean): 是否存在上一页。
      * `hasNextPage` (boolean): 是否存在下一页。
      * `records` (array of objects): 当前页的资讯记录对象数组。
          * `id` (number): 资讯的唯一标识符。
          * `type` (string): 资讯的类型，值为 `'news'` 或 `'risk'`。
          * `title` (string): 资讯的完整标题。
          * `author` (string): 资讯的发布机构或作者名称。
          * `date` (string): 资讯的发布日期，格式为 `YYYY.MM.DD`。
          * `image` (string): 与资讯主题相关的配图的URL或相对路径。
          * `tags` (array of strings): 与资讯内容相关的关键词标签数组。

##### **4.2 获取资讯详情**

  * **接口名称:** 获取资讯详情
  * **请求方法:** `GET`
  * **请求路径:** `/api/monitoring/articles/{id}`
  * **接口描述:** 根据ID获取单篇资讯的详细内容。
  * **请求参数 (Path):**
      * `id` (string, required): 资讯的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "id": 4,
        "type": "risk",
        "title": "漳州帆船配舾工程有限公司员工坠亡",
        "author": "北极星风力发电网",
        "date": "2024.11.12",
        "image": "/风险.svg",
        "tags": ["事故", "安全"],
        "riskSource": "人员坠落, 抢救无效死亡",
        "notice": "《通知》显示，2024年9月4日3时10分许，在漳浦县六鳌镇某船厂一新能源装备制造有限公司风电装备车间，漳州帆船配舾工程有限公司的1名员工在管桩机上进行绕管焊接作业准备中发生坠落，经抢救无效死亡。事故具体原因仍在调查中。",
        "relatedCompany": "漳州帆船配舾工程有限公司",
        "relatedProduct": "船舵总筒",
        "content": "<h4>事故背景</h4><p>近期，安全生产监督管理部门发布了一则关于高处作业安全的紧急通报，通报中披露了此次不幸的事故。据了解，涉事员工在进行高空焊接准备工作时，未按规定佩戴安全防护设备，且现场缺乏有效的安全监护措施，最终导致了悲剧的发生。</p><p>该事件不仅给遇难者家属带来了巨大的悲痛，也为相关企业敲响了安全生产的警钟。监管部门已责令该公司全面停产整顿，并对相关责任人展开调查。</p>"
      }
    }
    ```
    **字段说明:**
      * `id` (number): 资讯的唯一ID。
      * `type` (string): 资讯类型, 'news' 或 'risk'。
      * `title` (string): 资讯标题。
      * `author` (string): 资讯来源或作者。
      * `date` (string): 发布日期。
      * `image` (string): 配图的URL或路径。
      * `tags` (array of strings): 相关的标签数组。
      * `riskSource` (string | null): 风险来源的简要描述，仅风险类资讯提供。
      * `notice` (string | null): 官方通告内容，仅风险类资讯提供。
      * `relatedCompany` (string | null): 关联公司名称，仅风险类资讯提供。
      * `relatedProduct` (string | null): 关联产品名称，仅风险类资讯提供。
      * `content` (string): 资讯的正文内容，通常为HTML格式。

-----

#### **5. 产业链风险预警模块 (Chain Risk)**

##### **5.1 获取风险蔓延模拟列表**

  * **接口名称:** 获取风险蔓延模拟列表
  * **请求方法:** `GET`
  * **请求路径:** `/api/chain-risk/simulations`
  * **接口描述:** 以分页的形式获取已保存的风险蔓延模拟场景列表。支持通过关键词对模拟名称进行搜索。
  * **请求参数 (Query):**
      * `page` (number, optional, default: 1): 请求的数据页码。
      * `pageSize` (number, optional, default: 10): 每页返回的记录数量。
      * `keyword` (string, optional): 搜索关键词，用于在模拟名称 (`name`) 或描述 (`description`) 中进行模糊匹配。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "page": 1,
        "pageSize": 10,
        "totalRecords": 3,
        "totalPages": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "records": [
          { "id": 1, "name": "未来手机供应链洪灾风险模拟", "description": "模拟东南亚洪灾对未来手机供应链中上游材料供应的影响。", "creator": "李四", "createTime": "2025-07-20 14:00:00" },
          { "id": 2, "name": "新能源汽车芯片断供风险模拟", "description": "模拟凤凰芯片因故断供对核心车企造成的冲击。", "creator": "李四", "createTime": "2025-07-21 10:30:00" },
          { "id": 3, "name": "华星屏幕火灾风险模拟", "description": "模拟华星屏幕工厂发生火灾对其下游客户的影响。", "creator": "分析小组", "createTime": "2025-07-22 09:00:00" }
        ]
      }
    }
    ```
    **响应数据字段说明:**
      * `page`, `pageSize`, `totalRecords`, `totalPages`, `hasPrevPage`, `hasNextPage` 为分页信息。
      * `records` (array of objects): 模拟场景记录数组。
          * `id` (number): 模拟场景的唯一标识符。
          * `name` (string): 模拟场景的名称。
          * `description` (string): 对该模拟场景的简要描述。
          * `creator` (string): 创建该模拟的用户或团队名称。
          * `createTime` (string): 创建时间，格式为 `YYYY-MM-DD HH:mm:ss`。

##### **5.2 导入并保存风险蔓延模拟数据**

  * **接口名称:** 导入并保存风险蔓延模拟数据
  * **请求方法:** `POST`
  * **请求路径:** `/api/chain-risk/simulations`
  * **接口描述:** 导入并保存一个新的风险蔓延模拟场景，包括其元数据以及构成图谱的节点、边和可选的风险路径数据。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "name": "已完成的未来手机供应链洪灾风险模拟",
      "description": "保存2025-07-22执行的洪灾模拟结果。",
      "nodes": [
        { "id": "risk-source", "label": "天灾：东南亚洪灾", "isSource": true, "style": { "fill": "var(--risk-high-color)", "stroke": "#fca5a5" } },
        { "id": "t2-material-a", "label": "A材料（二级）" },
        { "id": "t2-material-b", "label": "B材料（二级）" },
        { "id": "t1-chip", "label": "凤凰芯片（一级）" },
        { "id": "t1-battery", "label": "国创电池（一级）" },
        { "id": "core-phone", "label": "未来手机（核心）" },
        { "id": "core-car", "label": "未来汽车（核心）" }
      ],
      "edges": [
        { "source": "risk-source", "target": "t2-material-a" },
        { "source": "t2-material-a", "target": "t1-chip" },
        { "source": "t2-material-b", "target": "t1-chip" },
        { "source": "t2-material-b", "target": "t1-battery" },
        { "source": "t1-chip", "target": "core-phone" },
        { "source": "t1-battery", "target": "core-phone" },
        { "source": "t1-battery", "target": "core-car" }
      ],
      "riskPath": [
        ["t2-material-a"],
        ["t1-chip"],
        ["t1-battery", "core-phone"],
        ["core-car"]
      ]
    }
    ```
    **字段说明:**
      * `name` (string, required): 模拟场景的名称。
      * `description` (string, optional): 模拟场景的描述。
      * `nodes` (array of objects, required): 构成产业链网络的节点列表。
      * `edges` (array of objects, required): 连接节点的关系边列表。
     * `riskPath` (array, optional): 一个二维数组，按时间步长展示受风险影响的节点ID列表。如果提供此字段，则表示保存的是一次完整的模拟结果；如果为空或不提供，则表示仅保存可供模拟的图谱结构。
  * **成功响应 (201 Created):**
    ```json
    {
      "code": 201,
      "message": "创建成功",
      "data": {
        "id": 4
      }
    }
    ```
    **字段说明:**
      * `id` (number): 新创建的模拟场景的唯一ID。

##### **5.3 启动风险蔓延模拟**

  * **接口名称:** 启动风险蔓延模拟
  * **请求方法:** `POST`
  * **请求路径:** `/api/chain-risk/simulations/{id}/run`
  * **接口描述:** 针对一个已保存的特定模拟场景 (`id`)，从指定的风险源头开始，模拟风险在产业链知识图谱中的蔓延路径和影响范围。
  * **请求参数 (Path):**
      * `id` (number, required): 要运行的模拟场景的唯一ID。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "startNodeId": "risk-source"
    }
    ```
    **字段说明:**
      * `startNodeId` (string, required): 模拟开始的风险源节点ID。该ID必须存在于对应模拟场景的节点列表中。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "模拟成功",
      "data": {
        "simulationId": 1,
        "simulationName": "未来手机供应链洪灾风险模拟",
        "nodes": [
          { "id": "risk-source", "label": "天灾：东南亚洪灾", "isSource": true, "style": { "fill": "var(--risk-high-color)", "stroke": "#fca5a5" } },
          { "id": "t2-material-a", "label": "A材料（二级）" },
          { "id": "t2-material-b", "label": "B材料（二级）" },
          { "id": "t1-chip", "label": "凤凰芯片（一级）" },
          { "id": "t1-battery", "label": "国创电池（一级）" },
          { "id": "t1-screen", "label": "华星屏幕（一级）" },
          { "id": "t1-case", "label": "精密外壳（一级）" },
          { "id": "core-phone", "label": "未来手机（核心）" },
          { "id": "core-car", "label": "未来汽车（核心）" },
          { "id": "logistics-a", "label": "远洋物流" },
          { "id": "logistics-b", "label": "顺风速运" },
          { "id": "market-cn", "label": "国内市场" },
          { "id": "market-eu", "label": "欧洲市场" }
        ],
        "edges": [
          { "source": "risk-source", "target": "t2-material-a" },
          { "source": "t2-material-a", "target": "t1-chip" },
          { "source": "t2-material-b", "target": "t1-chip" },
          { "source": "t2-material-b", "target": "t1-battery" },
          { "source": "t1-chip", "target": "core-phone" },
          { "source": "t1-battery", "target": "core-phone" },
          { "source": "t1-screen", "target": "core-phone" },
          { "source": "t1-case", "target": "core-phone" },
          { "source": "t1-battery", "target": "core-car" },
          { "source": "t1-case", "target": "core-car" },
          { "source": "logistics-a", "target": "t2-material-a" },
          { "source": "logistics-a", "target": "t1-screen" },
          { "source": "core-phone", "target": "logistics-b" },
          { "source": "core-car", "target": "logistics-b" },
          { "source": "logistics-b", "target": "market-cn" },
          { "source": "logistics-b", "target": "market-eu" }
        ],
        "riskPath": [
          ["t2-material-a"],
          ["t1-chip"],
          ["t1-battery", "core-phone"],
          ["core-car"],
          ["logistics-b"],
          ["market-cn", "market-eu"]
        ]
      }
    }
    ```
    **响应数据字段说明:**
      * `simulationId` (number): 本次运行的模拟场景ID。
      * `simulationName` (string): 本次运行的模拟场景名称。
      * `nodes` (array): 构成产业链网络的节点（企业、产品、市场等）列表。
      * `edges` (array): 连接节点的关系边列表。
      * `riskPath` (array): 一个二维数组，按时间步长（数组的索引）展示受风险影响的节点ID列表。

##### **5.4 删除风险蔓延模拟场景**

  * **接口名称:** 删除风险蔓延模拟场景
  * **请求方法:** `DELETE`
  * **请求路径:** `/api/chain-risk/simulations/{id}`
  * **接口描述:** 根据ID删除一个已保存的风险蔓延模拟场景。
  * **请求参数 (Path):**
      * `id` (number, required): 要删除的模拟场景的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "删除成功",
      "data": null
    }
    ```

-----

#### **6. 供应链管理模块 (Supply Chain)**

##### **6.1 获取供应链风险概要**

  * **接口名称:** 获取供应链风险概要
  * **请求方法:** `GET`
  * **请求路径:** `/api/supply-chain/summary`
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "networkRisk": "中",
        "highRiskCount": 101,
        "mediumRiskCount": 564,
        "lowRiskCount": 322
      }
    }
    ```
    **字段说明:**
      * `networkRisk` (string): 整个供应链网络的综合风险评级。
      * `highRiskCount` (number): “高风险”企业的数量。
      * `mediumRiskCount` (number): “中风险”企业的数量。
      * `lowRiskCount` (number): “低风险”企业的数量。

##### **6.2 查询供应链企业列表**

  * **接口名称:** 查询供应链企业列表
  * **请求方法:** `GET`
  * **请求路径:** `/api/supply-chain/companies`
  * **接口描述:** 分页查询并获取供应链中的企业列表，支持通过关键词对企业名称或所属行业进行模糊搜索。
  * **请求参数 (Query):**
      * `page` (number, optional, default: 1): 请求的数据页码。
      * `pageSize` (number, optional, default: 10): 每页返回的记录数量。
      * `keyword` (string, optional): 搜索关键词。后端将使用此关键词在企业的`name`（名称）或`industry`（行业）字段中进行模糊匹配搜索。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "page": 1,
        "pageSize": 10,
        "totalRecords": 25,
        "totalPages": 3,
        "hasPrevPage": false,
        "hasNextPage": true,
        "records": [
          { "id": 1, "name": "哈尔滨电气集团有限公司（这是一个为了测试表格横向滚动而故意设置的超长公司名称）", "industry": "制造-装备产业", "tech": "低", "finance": "高", "law": "中", "credit": "低", "reason": "营收数据缺失，且连续三个季度下滑，现金流紧张，存在短期偿债风险" },
          { "id": 2, "name": "东方电气集团东方电机有限公司", "industry": "制造-装备产业", "tech": "低", "finance": "低", "law": "中", "credit": "中", "reason": "注册资本变更" },
          { "id": 3, "name": "南京汽轮电机(集团)有限责任公司", "industry": "制造-装备产业", "tech": "低", "finance": "中", "law": "中", "credit": "高", "reason": "财务数据缺失" },
          { "id": 4, "name": "上海电气集团股份有限公司", "industry": "制造-装备产业", "tech": "中", "finance": "低", "law": "低", "credit": "低", "reason": "法人代表变更" },
          { "id": 5, "name": "新疆金风科技股份有限公司", "industry": "新能源产业", "tech": "高", "finance": "中", "law": "高", "credit": "中", "reason": "涉及多起与供应商的合同纠纷法律诉讼" },
          { "id": 6, "name": "明阳智慧能源集团股份公司", "industry": "新能源产业", "tech": "中", "finance": "中", "law": "低", "credit": "低", "reason": "研发投入占比下降" },
          { "id": 7, "name": "中国中车股份有限公司", "industry": "制造-装备产业", "tech": "高", "finance": "低", "law": "低", "credit": "低", "reason": "无明显风险" },
          { "id": 8, "name": "特变电工股份有限公司", "industry": "新能源产业", "tech": "高", "finance": "高", "law": "中", "credit": "中", "reason": "短期偿债压力较大" },
          { "id": 9, "name": "宁德时代新能源科技股份有限公司", "industry": "新能源产业", "tech": "高", "finance": "低", "law": "低", "credit": "低", "reason": "无明显风险" },
          { "id": 10, "name": "比亚迪股份有限公司", "industry": "新能源产业", "tech": "高", "finance": "中", "law": "低", "credit": "中", "reason": "资产负债率偏高" }
        ]
      }
    }
    ```
    **响应数据字段说明:**
      * `page` (number): 当前页码。
      * `pageSize` (number): 每页记录数。
      * `totalRecords` (number): 符合查询条件的总记录数。
      * `totalPages` (number): 总页数。
      * `hasPrevPage` (boolean): 是否存在上一页。
      * `hasNextPage` (boolean): 是否存在下一页。
      * `records` (array of objects): 当前页的企业信息对象数组。
          * `id` (number): 企业的唯一标识符。
          * `name` (string): 企业的完整法定名称。
          * `industry` (string): 企业所属的主要行业类别。
          * `tech` (string): 企业在“技术”维度的风险评级，值为 "高"、"中" 或 "低"。
          * `finance` (string): 企业在“财务”维度的风险评级，值为 "高"、"中" 或 "低"。
          * `law` (string): 企业在“法律”维度的风险评级，值为 "高"、"中" 或 "低"。
          * `credit` (string): 企业在“信用”维度的风险评级，值为 "高"、"中" 或 "低"。
          * `reason` (string): 对该企业当前风险状况的综合性描述，或列举出的最主要的风险原因。

##### **6.3 获取单个企业详情**

  * **接口名称:** 获取单个企业详情
  * **请求方法:** `GET`
  * **请求路径:** `/api/supply-chain/companies/{id}`
  * **接口描述:** 用于在编辑企业信息时，表单的数据回填。
  * **请求参数 (Path):**
      * `id` (number, required): 企业的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "id": 1,
        "name": "哈尔滨电气集团有限公司（这是一个为了测试表格横向滚动而故意设置的超长公司名称）",
        "industry": "制造-装备产业",
        "tech": "低",
        "finance": "高",
        "law": "中",
        "credit": "低",
        "reason": "营收数据缺失，且连续三个季度下滑，现金流紧张，存在短期偿债风险"
      }
    }
    ```
    **字段说明:**
      * `id`, `name`, `industry`, `tech`, `finance`, `law`, `credit`, `reason` 字段含义同 6.2 接口。

##### **6.4 新增企业信息**

  * **接口名称:** 新增企业信息
  * **请求方法:** `POST`
  * **请求路径:** `/api/supply-chain/companies`
  * **接口描述:** 添加一个新的企业到供应链列表中。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "name": "某某新材料科技有限公司",
      "industry": "新材料",
      "tech": "中",
      "finance": "低",
      "law": "低",
      "credit": "低",
      "reason": "初创公司，暂无风险"
    }
    ```
  * **成功响应 (201 Created):**
    ```json
    {
      "code": 201,
      "message": "创建成功",
      "data": { "id": 26 }
    }
    ```
    **字段说明:**
      * `id` (number): 新创建的企业的唯一ID。

##### **6.5 更新企业信息**

  * **接口名称:** 更新企业信息
  * **请求方法:** `PUT`
  * **请求路径:** `/api/supply-chain/companies/{id}`
  * **接口描述:** 更新指定ID的企业信息。
  * **请求参数 (Path):**
      * `id` (number, required): 企业的唯一ID。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "name": "某某新材料科技有限公司",
      "industry": "新材料",
      "tech": "中",
      "finance": "低",
      "law": "低",
      "credit": "低",
      "reason": "更新后的风险原因"
    }
    ```
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "更新成功",
      "data": null
    }
    ```

##### **6.6 删除企业信息**

  * **接口名称:** 删除企业信息
  * **请求方法:** `DELETE`
  * **请求路径:** `/api/supply-chain/companies/{id}`
  * **接口描述:** 删除指定ID的企业。
  * **请求参数 (Path):**
      * `id` (number, required): 企业的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "删除成功",
      "data": null
    }
    ```

-----

#### **7. 系统管理模块 (System Management)**

##### **7.1 用户管理 (Users)**

###### **7.1.1 获取用户列表**

  * **接口名称:** 获取用户列表
  * **请求方法:** `GET`
  * **请求路径:** `/api/system/users`
  * **接口描述:** 分页、筛选查询系统中的所有用户账户。支持通过关键词对用户名或姓名进行模糊搜索。
  * **请求参数 (Query):**
      * `page` (number, optional, default: 1): 请求的数据页码。
      * `pageSize` (number, optional, default: 10): 每页返回的记录数量。
      * `keyword` (string, optional): 搜索关键词。后端将使用此关键词在用户的`username`（用户名）或`name`（姓名）字段中进行模糊匹配搜索。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "page": 1,
        "pageSize": 10,
        "totalRecords": 4,
        "totalPages": 1,
        "hasPrevPage": false,
        "hasNextPage": false,
        "records": [
          { "id": 1, "username": "admin", "name": "张三", "role": "系统管理员", "organization": "总部", "status": "正常", "lastLogin": "2024-11-12 10:30:15" },
          { "id": 2, "username": "analyst_li", "name": "李四", "role": "风险分析师", "organization": "风险控制部", "status": "正常", "lastLogin": "2024-11-12 09:15:22" },
          { "id": 3, "username": "viewer_wang", "name": "王五", "role": "普通用户", "organization": "市场部", "status": "正常", "lastLogin": "2024-11-11 15:48:01" },
          { "id": 4, "username": "disabled_zhao", "name": "赵六", "role": "普通用户", "organization": "市场部", "status": "已禁用", "lastLogin": "2024-10-01 11:20:33" }
        ]
      }
    }
    ```
    **响应数据字段说明:**
      * `page` (number): 当前页码。
      * `pageSize` (number): 每页记录数。
      * `totalRecords` (number): 符合查询条件的总记录数。
      * `totalPages` (number): 总页数。
      * `hasPrevPage` (boolean): 是否存在上一页。
      * `hasNextPage` (boolean): 是否存在下一页。
      * `records` (array of objects): 当前页的用户信息对象数组。
          * `id` (number): 用户的唯一标识符。
          * `username` (string): 用户的登录账号名。
          * `name` (string): 用户的真实姓名或昵称。
          * `role` (string): 用户所属角色的名称。
          * `organization` (string): 用户所属组织部门的名称。
          * `status` (string): 用户的账户状态，值为 "正常" 或 "已禁用"。
          * `lastLogin` (string): 用户最后一次成功登录的时间，格式为 `YYYY-MM-DD HH:mm:ss`。

###### **7.1.2 获取单个用户详情**

  * **接口名称:** 获取单个用户详情
  * **请求方法:** `GET`
  * **请求路径:** `/api/system/users/{id}`
  * **接口描述:** 获取指定ID用户的详细信息，用于编辑表单回填。
  * **请求参数 (Path):**
      * `id` (number, required): 用户的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "id": 2,
        "username": "analyst_li",
        "name": "李四",
        "roleId": 2,
        "organizationId": 2,
        "status": "正常"
      }
    }
    ```
    **字段说明:**
      * `id`, `username`, `name`, `status`。
      * `roleId` (number): 用户所属角色的ID。
      * `organizationId` (number): 用户所属组织的ID。

###### **7.1.3 新增用户**

  * **接口名称:** 新增用户
  * **请求方法:** `POST`
  * **请求路径:** `/api/system/users`
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "username": "new_user",
      "name": "钱七",
      "password": "a_strong_password",
      "roleId": 3,
      "organizationId": 2,
      "status": "正常"
    }
    ```
  * **成功响应 (201 Created):**
    ```json
    {
      "code": 201,
      "message": "用户创建成功",
      "data": { "id": 5 }
    }
    ```

###### **7.1.4 更新用户**

  * **接口名称:** 更新用户
  * **请求方法:** `PUT`
  * **请求路径:** `/api/system/users/{id}`
  * **请求参数 (Path):**
      * `id` (number, required): 用户的唯一ID。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "name": "李四-修改",
      "roleId": 2,
      "organizationId": 3,
      "status": "已禁用"
    }
    ```
  * **成功响应 (200 OK):**
    ```json
    { "code": 200, "message": "更新成功", "data": null }
    ```

###### **7.1.5 删除用户**

  * **接口名称:** 删除用户
  * **请求方法:** `DELETE`
  * **请求路径:** `/api/system/users/{id}`
  * **请求参数 (Path):**
      * `id` (number, required): 用户的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    { "code": 200, "message": "删除成功", "data": null }
    ```

##### **7.2 角色管理 (Roles)**

###### **7.2.1 获取角色列表**

  * **接口名称:** 获取角色列表
  * **请求方法:** `GET`
  * **请求路径:** `/api/system/roles`
  * **接口描述:** 获取所有角色及其基本信息。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": [
        { "id": 1, "name": "系统管理员", "description": "拥有系统的全部权限，可以管理用户、角色和组织。" },
        { "id": 2, "name": "风险分析师", "description": "可以查看风险数据并进行蔓延模拟。" },
        { "id": 3, "name": "普通用户", "description": "仅能查看首页看板和预警信息。" }
      ]
    }
    ```
    **字段说明:**
      * `id`, `name`, `description`。

###### **7.2.2 新增角色**

  * **接口名称:** 新增角色
  * **请求方法:** `POST`
  * **请求路径:** `/api/system/roles`
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "name": "审计员",
      "description": "负责审计系统操作日志。"
    }
    ```
  * **成功响应 (201 Created):**
    ```json
    { "code": 201, "message": "角色创建成功", "data": { "id": 4 } }
    ```

###### **7.2.3 更新角色**

  * **接口名称:** 更新角色
  * **请求方法:** `PUT`
  * **请求路径:** `/api/system/roles/{id}`
  * **请求参数 (Path):**
      * `id` (number, required): 角色的唯一ID。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "name": "高级审计员",
      "description": "负责审计系统操作日志和安全配置。"
    }
    ```
  * **成功响应 (200 OK):**
    ```json
    { "code": 200, "message": "更新成功", "data": null }
    ```

###### **7.2.4 删除角色**

  * **接口名称:** 删除角色
  * **请求方法:** `DELETE`
  * **请求路径:** `/api/system/roles/{id}`
  * **请求参数 (Path):**
      * `id` (number, required): 角色的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    { "code": 200, "message": "删除成功", "data": null }
    ```

###### **7.2.5 获取角色权限**

  * **接口名称:** 获取角色权限
  * **请求方法:** `GET`
  * **请求路径:** `/api/system/roles/{id}/permissions`
  * **接口描述:** 获取指定角色的权限，用于权限编辑弹窗的数据展示。
  * **请求参数 (Path):**
      * `id` (number, required): 角色的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": {
        "assignedKeys": ["risk-analysis-view", "simulation-run"],
        "permissionTree": [
          {
            "key": "dashboard",
            "label": "首页仪表盘",
            "children": [
              { "key": "dashboard-view", "label": "查看权限" }
            ]
          },
          {
            "key": "monitoring",
            "label": "风险监测",
            "children": [
              { "key": "monitoring-view", "label": "查看资讯" },
              { "key": "monitoring-detail-view", "label": "查看详情" }
            ]
          },
          {
            "key": "supply-chain",
            "label": "供应链管理",
            "children": [
              { "key": "supply-chain-view", "label": "查看列表" },
              { "key": "supply-chain-edit", "label": "编辑企业" },
              { "key": "supply-chain-delete", "label": "删除企业" }
            ]
          },
          {
            "key": "system",
            "label": "系统管理",
            "children": [
              { "key": "user-manage", "label": "用户管理" },
              { "key": "role-manage", "label": "角色管理" },
              { "key": "org-manage", "label": "组织管理" }
            ]
          }
        ]
      }
    }
    ```
    **字段说明:**
      * `assignedKeys` (array of strings): 该角色已拥有的权限key的数组。
      * `permissionTree` (array of objects): 系统所有权限的树形结构。
          * `key` (string): 权限的唯一标识。
          * `label` (string): 权限的显示名称。
          * `children` (array, optional): 子权限数组。

###### **7.2.6 更新角色权限**

  * **接口名称:** 更新角色权限
  * **请求方法:** `PUT`
  * **请求路径:** `/api/system/roles/{id}/permissions`
  * **请求参数 (Path):**
      * `id` (number, required): 角色的唯一ID。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "permissionKeys": ["dashboard-view", "user-manage"]
    }
    ```
    **字段说明:**
      * `permissionKeys` (array of strings): 更新后角色拥有的所有权限key的数组。
  * **成功响应 (200 OK):**
    ```json
    { "code": 200, "message": "权限更新成功", "data": null }
    ```

##### **7.3 组织架构管理 (Organizations)**

###### **7.3.1 获取组织架构树**

  * **接口名称:** 获取组织架构树
  * **请求方法:** `GET`
  * **请求路径:** `/api/system/organizations`
  * **接口描述:** 获取层级化的组织架构数据，用于前端树状组件展示。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": [
        {
          "id": 1,
          "name": "总部",
          "parent": "-",
          "manager": "张三",
          "userCount": 5,
          "children": [
            { "id": 2, "name": "风险控制部", "parent": "总部", "manager": "李四", "userCount": 12, "children": [] },
            { "id": 3, "name": "市场部", "parent": "总部", "manager": "王五", "userCount": 8, "children": [] },
            { "id": 4, "name": "研发一部", "parent": "总部", "manager": "待定", "userCount": 25, "children": [] }
          ]
        }
      ]
    }
    ```
    **字段说明:**
      * `id`, `name`, `parent`, `manager`, `userCount`。
      * `children` (array): 子组织数组。

###### **7.3.2 新增组织**

  * **接口名称:** 新增组织
  * **请求方法:** `POST`
  * **请求路径:** `/api/system/organizations`
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "name": "华东大区",
      "parentId": 1,
      "manager": "孙八"
    }
    ```
  * **成功响应 (201 Created):**
    ```json
    { "code": 201, "message": "组织创建成功", "data": { "id": 5 } }
    ```

###### **7.3.3 更新组织**

  * **接口名称:** 更新组织
  * **请求方法:** `PUT`
  * **请求路径:** `/api/system/organizations/{id}`
  * **请求参数 (Path):**
      * `id` (number, required): 组织的唯一ID。
  * **请求体 (Request Body):** `application/json`
    ```json
    {
      "name": "风险与合规部",
      "manager": "李四-新"
    }
    ```
  * **成功响应 (200 OK):**
    ```json
    { "code": 200, "message": "更新成功", "data": null }
    ```

###### **7.3.4 删除组织**

  * **接口名称:** 删除组织
  * **请求方法:** `DELETE`
  * **请求路径:** `/api/system/organizations/{id}`
  * **接口描述:** 删除组织。如果组织下有子组织或用户，应有业务逻辑限制（建议返回400 Bad Request）。
  * **请求参数 (Path):**
      * `id` (number, required): 组织的唯一ID。
  * **成功响应 (200 OK):**
    ```json
    { "code": 200, "message": "删除成功", "data": null }
    ```

##### **7.4 权限字典**

###### **7.4.1 获取所有可用权限**

  * **接口名称:** 获取所有可用权限
  * **请求方法:** `GET`
  * **请求路径:** `/api/system/permissions/all`
  * **接口描述:** 获取系统定义的所有权限点，用于给角色分配权限时的UI展示。
  * **成功响应 (200 OK):**
    ```json
    {
      "code": 200,
      "message": "查询成功",
      "data": [
        "用户管理", "角色管理", "组织管理", "风险预警查看", "风险模拟", "供应链评估", "系统设置", "数据导出"
      ]
    }
    ```
    **字段说明:**
      * `data` (array of strings): 包含所有权限点显示名称的字符串数组。
* 
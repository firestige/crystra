# 配置文件交互

> D23，2026-09-11 用户裁定。总览布局、观察设置与后续配置文件入口采用同一交互。

| 契约键 | 触发与行为 | 状态与边界 |
|---|---|---|
| `configuration-file.export` | 导出操作直接触发 JSON 下载，不打开应用自己的保存窗口 | 页面提供序列化内容和文件名；不修改配置，也不退出编辑；提示下载开始不表示浏览器已完成落盘 |
| `configuration-file.import` | 导入操作打开系统文件选择器，单选 JSON | 取消不修改状态；文件读完并校验成功后才提交；错误反馈并保留原配置；清空输入值以允许重新选同一文件 |

共享源码：[configuration-file.tsx](../../../../wsr-ui/packages/bi/src/components/configuration-file.tsx)。`downloadConfiguration` 负责 Blob、下载链接及 URL 回收；`ConfigurationFileInput` 负责原生 file input、读取期间状态、错误转交与重复选文件。复用已有 ghost Action Tool，不增加新的按钮风格。

- 总览导出当前布局草稿，建议文件名 `crystra-layout.json`；导入校验后替换布局草稿，仍需保存／取消编辑。
- 观察设置导出当前激活的已保存设置，建议文件名 `observation-setting.json`；导入校验后作为新设置加入并激活，保留临时 Delivery 范围。
- 文件 schema、版本、大小限制及业务校验由页面／领域 decoder 定义，共享控件不统一文件内容。
- 系统文件选择由浏览器原生 `<input type="file">` 调用；无需 File System Access 的保存／打开 picker API。浏览器下载设置可能决定最终保存位置或是否询问位置，Crystra 不覆盖这些偏好。

页面关联：[总览](../pages/analysis-audit.md#布局文件与添加-widget)、[观察设置](result-analysis-review.md#导入导出与数据边界)。此规则覆盖旧总览的系统保存窗口约定；其他主题或文档缺口不因此关闭。

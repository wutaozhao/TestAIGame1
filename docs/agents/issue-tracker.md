# 本地 Markdown 工单

- 每个功能使用 `.scratch/<feature-slug>/` 目录。
- 规格存放于 `.scratch/<feature-slug>/spec.md`。
- 每张工单使用独立文件 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，从 `01` 编号。
- 工单顶部用 `Status:` 记录分诊状态。见 [状态映射](triage-labels.md)。
- 评论与讨论记录追加到文件末尾的 `## Comments` 下。

发布规格或工单时，按上述路径创建文件及所需目录。读取工单时，使用给出的路径，或在对应功能目录内按编号查找。

## Wayfinder

- 地图存放于 `.scratch/<effort>/map.md`，子工单沿用 `issues/<NN>-<slug>.md`。
- 用 `Type:` 记录 `research`、`prototype`、`grilling` 或 `task`，用 `Blocked by:` 列出依赖工单编号。
- 选择编号最小、尚未领取且所有依赖均已解决的开放工单。获准领取后，先保存 `Status: claimed`。
- 完成时在 `## Answer` 下记录结论，将状态改为 `resolved`，并把结论摘要和工单链接加到地图的 `Decisions-so-far` 下。

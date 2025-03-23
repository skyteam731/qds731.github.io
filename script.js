// 初始化数据存储
let projects = JSON.parse(localStorage.getItem('photoProjects')) || [];

// 项目数据结构
const projectSchema = {
  id: Date.now(),
  title: '未命名项目',
  date: new Date().toLocaleDateString(),
  cover: 'https://via.placeholder.com/300x200.png?text=点击上传封面',
  materials: [],
  description: '暂无描述'
};

// 渲染项目卡片
function renderProjects() {
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = projects.map(project => `
    <article class="project-card" data-id="${project.id}">
      <img src="${project.cover}" alt="封面" class="project-cover">
      <div class="project-info">
        <h3>${project.title}</h3>
        <time>${project.date}</time>
        <p>${project.description.substring(0, 30)}...</p>
      </div>
    </article>
  `).join('');
}

// 打开编辑模态框
function openEditor(mode, projectId) {
  const modal = document.getElementById('modalBackdrop');
  modal.style.display = 'flex';
  
  if (mode === 'new') {
    document.getElementById('modalTitle').textContent = '新建拍摄项目';
    document.getElementById('modalBody').innerHTML = `
      <form onsubmit="saveProject(event)">
        <div class="form-group">
          <label>项目标题</label>
          <input type="text" id="projectTitle" required>
        </div>
        <div class="form-group">
          <label>项目描述</label>
          <textarea id="projectDesc" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>添加素材链接</label>
          <div id="materialList"></div>
          <button type="button" onclick="addMaterialField()" class="add-btn">
            <span class="material-icons">add_link</span> 添加链接
          </button>
        </div>
        <div class="form-actions">
          <button type="submit">保存</button>
          <button type="button" onclick="closeModal()">取消</button>
        </div>
      </form>
    `;
  }
}

// 关闭模态框
function closeModal() {
  document.getElementById('modalBackdrop').style.display = 'none';
}

// 保存项目
function saveProject(e) {
  e.preventDefault();
  const newProject = {
    ...projectSchema,
    id: Date.now(),
    title: document.getElementById('projectTitle').value,
    description: document.getElementById('projectDesc').value
  };
  
  projects.push(newProject);
  localStorage.setItem('photoProjects', JSON.stringify(projects));
  renderProjects();
  closeModal();
}

// 初始化加载
window.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  
  // 点击项目卡片
  document.getElementById('projectGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (card) {
      const projectId = card.dataset.id;
      const project = projects.find(p => p.id == projectId);
      openEditor('edit', project);
    }
  });
});

// 添加素材链接字段
function addMaterialField() {
  const container = document.getElementById('materialList');
  const field = document.createElement('div');
  field.className = 'material-field';
  field.innerHTML = `
    <select>
      <option value="image">图片</option>
      <option value="video">视频</option>
    </select>
    <input type="url" placeholder="输入素材链接">
    <button type="button" onclick="this.parentElement.remove()">删除</button>
  `;
  container.appendChild(field);
}
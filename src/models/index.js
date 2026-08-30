const User = require('./User');
const RefreshToken = require('./RefreshToken');
const Project = require('./Project');
const Task = require('./Task');

// User associations
User.hasMany(Project, { foreignKey: 'userId', as: 'projects', onDelete: 'CASCADE' });
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks', onDelete: 'SET NULL' });

// Project associations
Project.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });

// Task associations
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

// RefreshToken associations
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  RefreshToken,
  Project,
  Task,
};

const allRoles = {
  user: ['student'],
  admin: ['student', 'club_admin'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

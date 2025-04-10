function showSalary(users, age) {
  const filteredUsers = users.filter(user => user.age <= age);
  const userStrings = filteredUsers.map(user => `${user.name}, ${user.balance}`);
  return userStrings.join('\n');
}
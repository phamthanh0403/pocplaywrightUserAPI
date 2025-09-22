module.exports = {
  // Nếu bạn cần tạo nhanh object mẫu:
  createUser(email, password) {
    return { email, password };
  },

  createUserList(id, email, password, firstName, lastName) {
    return { id, email, password, first_name: firstName, last_name: lastName };
  }
};

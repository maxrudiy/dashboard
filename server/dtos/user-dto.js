class UserDTO {
  email;
  userId;
  isActivated;
  groups;
  constructor(userData) {
    this.email = userData.email;
    this.userId = userData._id;
    this.isActivated = userData.isActivated;
    this.groups = userData.groups;
  }
}

export { UserDTO };

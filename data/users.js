import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin",
    email: "admin@test.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "User",
    email: "user@test.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;

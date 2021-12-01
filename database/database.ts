import fs from "fs";
import path from "path";

const DB_PATH = path.join(__dirname, "db.json");

interface Schema {
  users: {
    [key: string]: User;
  };
}

interface User {
  id: string; // Discord ID
  fflogsId?: number;
  alexbux?: number;
}

class Database {
  data: Schema = { users: {} };

  read() {
    try {
      this.data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch (e) {
      // no-op, if no file exists, it will be created on write
    }
  }

  write() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data), "utf8");
  }

  getUserById(id: string) {
    return this.data.users[id] || null;
  }

  setUser(user: User) {
    this.data.users[user.id] = user;
    this.write();
  }
}

export const database = new Database();

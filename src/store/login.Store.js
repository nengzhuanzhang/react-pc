// login module

import { makeAutoObservable } from "mobx";
import { http } from "@/utils";

class LoginStore {
  token = "";
  constructor() {
    // 响应式
    makeAutoObservable(this);
  }
  getToken = async ({ mobile, code }) => {
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    this.token = res.data.token
  };
}

export default LoginStore;

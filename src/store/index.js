// 把所有模块统一处理，导出一个统一的方法 userStore
import React from "react";
import LoginStore from "./login.Store.js";

class RootStore {
  // 组合模块
  constructor() {
    this.loginStore = new LoginStore();
  }
}
// 实例化根，导入useStore方法供组件使用数据
const rootStore = new RootStore();
const context = React.createContext(rootStore);
const useStore = () => React.useContext(context);

export { useStore };

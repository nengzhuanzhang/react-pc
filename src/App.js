import { NOT_LOCAL_BINDING } from "@babel/types";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import { AuthRoute } from "@/components/AuthRoute";
function App() {
  return (
    // 路由配置
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* 需要鉴权的路由 */}
          <Route path="/*" element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }></Route>
          {/* 不需要鉴权的路由 */}
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

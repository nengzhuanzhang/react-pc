import { NOT_LOCAL_BINDING } from "@babel/types";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import { AuthRoute } from "@/components/AuthRoute";
import "./App.css";
import Home from "./pages/Home";
import Article from "@/pages/Article";
import Publish from "@/pages/Publish";
import { HistoryRouter, history } from "@/utils/history";

function App() {
  return (
    // 路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          {/* 需要鉴权的路由 */}
          <Route
            path="/*"
            element={
              <AuthRoute>
                <Layout />
              </AuthRoute>
            }
          >
            // 二级路由
            <Route index element={<Home />}></Route>
            <Route path="article" element={<Article />}></Route>
            <Route path="publish" element={<Publish />}></Route>
          </Route>
          {/* 不需要鉴权的路由 */}
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </div>
    </HistoryRouter>
  );
}

export default App;

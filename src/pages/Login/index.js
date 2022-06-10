import { Card } from "antd";
import logo from "@/assets/logo.png";
import "./index.scss";
import { Form, Input, Checkbox, Button, message } from "antd";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";

function Login() {
  // 获取跳转实例对象
  const { loginStore } = useStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Success:", values);
    const { mobile, code } = values;

    try {
      await loginStore.getToken({ mobile, code });
      navigate("/");
    } catch (e) {
      message.error(e.response?.data?.message || "登录失败");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          validateTrigger={["onBlur", "onChange"]}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{ remeber: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="mobile"
            name="mobile"
            rules={[
              { required: true, message: "Please input mobile!" },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
                validateTrigger: "onBlur",
              },
            ]}
          >
            <Input placeholder="请输入手机号"></Input>
          </Form.Item>
          <Form.Item
            label="code"
            name="code"
            rules={[
              { required: true, message: "Please input password!" },
              { len: 6, message: "验证码6个字符", validateTrigger: "onBlur" },
            ]}
          >
            <Input placeholder="请输入验证码" maxLength={6}></Input>
          </Form.Item>
          <Form.Item
            name="remeber"
            wrapperCol={{ offset: 5, span: 19 }}
            valuePropName="checked"
          >
            <Checkbox>我已阅读并同意「用户协议」和「隐私条款」</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
            <Button type="primary" block htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
export default Login;

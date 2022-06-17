import { useState, useRef,useEffect } from "react";
import {
  Breadcrumb,
  Card,
  Form,
  Input,
  Select,
  Radio,
  Upload,
  Space,
  Button,message
} from "antd";
import { Link, useSearchParams,useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import "./index.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {http} from '@/utils'

const { Option } = Select;
const Publish = () => {
  const [params] = useSearchParams();
  const articleId = params.get("id");
  // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
  const [form] = Form.useForm()
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${articleId}`);
      const data = res.data;
      form.setFieldsValue({ ...data, type: data.cover.type });
      // 回填upload
      const formatImgList = data.cover.images.map(url => ({ url }))
      setFileList(formatImgList)
      // 暂存列表里也存一份
      cacheImgList.current = formatImgList
      // 图片type
      setImageCount(data.cover.type)
    };
     // 必须是编辑状态 才可以发送请求
     if (articleId) {
      loadDetail();
    }
  }, [articleId, form]);

  const [fileList, setFileList] = useState([]);

  // 声明一个暂存仓库
  const cacheImgList = useRef();
  // 上传成功的回调
  const onUploadChange = (info) => {
    const formatList = info.fileList.map((file) => {
      if (file.response) {
        return {
          url: file.response.data.url,
        };
      }
      return file;
    });
    setFileList(formatList);
    cacheImgList.current = formatList;
  };

  const [imgCount, setImageCount] = useState(1);
  const changeType = (e) => {
    const count = e.target.value;
    setImageCount(count);

    if (count === 1) {
      const img = cacheImgList.current[0];
      setFileList([img]);
    } else if (count === 3) {
      setFileList(cacheImgList.current);
    }
  };

  // 提交表单
  const navigate = useNavigate()
  const onFinish = async (values) => {
    const { channel_id, content, title, type } = values;
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map((item) => item.url),
      },
    };

    if (articleId) {
      await http.put(`/mp/articles/${articleId}?draft=false`, params)
    } else {
      await http.post('/mp/articles?draft=false', params)
    }

    // 跳转列表 提示用户
    navigate('/article')
    message.success(`${articleId ? '更新成功' : '发布成功'}`)
  };

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {articleId ? "修改文章" : "发布文章"}
            </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: "" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              <Option value={0}>推荐</Option>
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 当imgCount>0 时才展示上传组件 */}
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imgCount > 1}
                maxCount={imgCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill theme="snow" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 2 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? "修改文章" : "发布文章"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;

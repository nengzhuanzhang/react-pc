import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
  Table,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "moment/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import "./index.scss";
import img404 from "@/assets/error.png";
import { useEffect, useState } from "react";
import { http } from "@/utils";
import { history } from "@/utils/history";

const { Option } = Select;
const { RangePicker } = DatePicker;
const Article = () => {
  // 获取频道列表
  const [channels, setchannels] = useState([]);
  useEffect(() => {
    async function fetchChannels() {
      const res = await http.get("/channels");
      setchannels(res.data.channels);
    }
    fetchChannels();
  }, []);

  // 文章列表数据管理
  const [article, setArticleList] = useState({
    list: [],
    count: 0,
  });

  // 参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
  });

  useEffect(() => {
    async function fetchArticleList() {
      const res = await http.get("/mp/articles", { params });
      const { results, total_count } = res.data;
      setArticleList({
        list: results,
        // list: tableData,
        count: total_count,
      });
    }
    fetchArticleList();
  }, [params]);

  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: (cover) => {
        return <img src={cover || img404} width={80} height={60} alt="" />;
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (_, data) => (
        <>
          <Tag color={data.status == 1 ? "green" : "red"}>
            {data.status !== 1 ? "审核通过" : "拒绝"}
          </Tag>
        </>
      ),
    },
    {
      title: "发布时间",
      dataIndex: "pubdate",
    },
    {
      title: "阅读数",
      dataIndex: "read_count",
    },
    {
      title: "评论数",
      dataIndex: "comment_count",
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
    },
    {
      title: "操作",
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => editArticle(data)}
            />

            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 按条件查询
  const onSearch = (values) => {
    const { status, channel_id, date } = values;
    const _params = {};
    _params.status = status;
    if (channel_id) {
      _params.channel_id = channel_id;
    }
    if (date) {
      _params.begin_pubdate = date[0].format("YYYY-MM-DD");
      _params.end_pubdate = date[1].format("YYYY-MM-DD");
    }
    setParams({
      ...params,
      ..._params,
    });
  };

  // 分页查询
  const pageChange = (page) => {
    // 拿到当前页参数 修改params 引起接口更新
    setParams({
      ...params,
      page,
    });
  };

  // 删除
  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`);
    setParams({
      page: 1,
      per_page: 10,
    });
  };

  // 编辑
  const navigage = useNavigate();
  const editArticle = (data) => {
    navigage(`/home/publish?id=${data.id}`);
  };

  const tableData = [
    {
      id: "8218",
      comment_count: 0,
      cover: {
        images: ["http://geek.itheima.net/resources/images/15.jpg"],
      },
      like_count: 0,
      pubdate: "2019-03-11 09:00:00",
      read_count: 2,
      status: 2,
      title: "离线化加载h5资源解决方案",
    },
    {
      id: "8219",
      comment_count: 1,
      cover: {
        images: ["http://geek.itheima.net/resources/images/15.jpg"],
      },
      like_count: 1,
      pubdate: "2019-03-11 09:00:00",
      read_count: 1,
      status: 1,
      title: "wkwebview",
    },
  ];
  return (
    <div>
      <Card
        className="mb20"
        title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/article">内容管理</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        {/* form 表单 */}
        <Form initialValues={{ status: null }} onFinish={onSearch}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="频道" name="channel_id">
            <Select placeholder="请选择文章频道" style={{ width: 120 }}>
              {channels.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* table */}
      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={article.list}
          pagination={{
            position: ["bottomCenter"],
            current: params.page,
            pageSize: params.per_page,
            onChange: pageChange,
          }}
        ></Table>
      </Card>
    </div>
  );
};

export default Article;

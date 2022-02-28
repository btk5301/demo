import {Layout, Menu, Breadcrumb, Table, Empty, Button, Radio} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined,
    PlusOutlined
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";
import {useState, useEffect} from 'react'
import {deleteStudent, getAllStudents} from "./client";
import './App.css';
import Spin from "antd/es/spin";
import Badge from "antd/es/badge";
import Tag from "antd/es/tag";
import Avatar from "antd/es/avatar";
import Popconfirm from "antd/es/popconfirm";
import {errorNotification, successNotification} from "./Notification";
import Divider from "antd/es/divider";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split(" ");

    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>
}

const confirm = (student, callback) => {
    deleteStudent(student.id).then(() => {
        successNotification("Student successfully deleted",
            `${student.name} was deleted from the system`)
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        })
    })
}

const Actions = ({student, fetchStudents}) => {
    return <Popconfirm placement="top" title={`Are you sure you want to delete ${student.name}`}
                       onConfirm={() => confirm(student, fetchStudents)}
                       okText="Yes" cancelText="No">
        <Radio.Button value="Delete">Delete</Radio.Button>
        <Radio.Button value="Edit">Edit</Radio.Button>
    </Popconfirm>
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: '',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, student) => <Actions student={student} fetchStudents={fetchStudents}/>
    },
];

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);


    const fetchStudents = () => {
        getAllStudents()
            .then(resp => resp.json())
            .then(data => {
                setStudents(data);

            }).catch(err => {
            console.log(err.response);
            // using this method allows us to pass through the server error message to the frontend instead of having separate error messages
            err.response.json().then(res => {
                errorNotification(
                    "There was an issue",
                    `${res.message} [statusCode: ${res.status}] [${res.error}`)
            })
        }).finally(() => setFetching(false));
    }

    useEffect(() => {
        fetchStudents()
        console.log("I am here");
    }, [])

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }

        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty/>
            </>
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}/>
            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() => <>
                    <Tag>Number of students</Tag>
                    <Badge count={students.length} className="site-badge-count-4"/>
                    <br/><br/>
                    <Button
                        onClick={() => setShowDrawer(!showDrawer)}
                        type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                        Add New Student
                    </Button>
                </>}
                pagination={{pageSize: 50}}
                scroll={{y: 400}}
                rowKey={(student) => student.id}/>
        </>
    }


    return <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}/>
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                <Image
                    width={75}
                    src="https://user-images.githubusercontent.com/40702606/110871298-0ab98d00-82c6-11eb-88e8-20c4d5c9ded5.png"
                />
                <Divider>
                    <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href="https://amigoscode.com/p/full-stack-spring-boot-react">
                        Click here to access Fullstack Spring Boot & React for professionals
                    </a>
                </Divider>
            </Footer>
        </Layout>
    </Layout>
}

export default App;

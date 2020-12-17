
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Link from '@material-ui/core/Link';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Container from '@material-ui/core/Container';



export default function MemberManagement() {
    const useStyles = makeStyles(theme => ({
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
        },
        absolute: {
            position: 'absolute',
            bottom: theme.spacing(8),
            right: theme.spacing(8),
        },
        root: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
        },
        mInfoIn: {
            padding: theme.spacing(2),
        },
        bottom: {
            margin: theme.spacing(3),
        },
    }));
    const classes = useStyles();


    const [memberData, setMemberData] = useState([]);
    const [editing, setEditing] = useState({});
    const [historyPageTotal, sethistoryPageTotal] = useState(0)
    const [historyPageCurrent, sethistoryPageCurrent] = useState(0)

    function handelEdit(id) {
        var editingStause = {}
        for (var data of memberData) {
            editingStause[data.id] = false;
        }
        editingStause[id] = !editing[id]
        setEditing(editingStause)
    }
    function getChange(id) {
        var phone = document.getElementById('phoneVal-' + id);
        var name = document.getElementById('nameVal-' + id);
        var dataPack = { id: id, name: name.value, phone: phone.value }
        fetch('./api/post/MemberManagement/getChange', {//访问的域名中含有/api 则会使用代理 
            method: 'POST',
            credentials: "include",//包含Cookie
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(dataPack),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())//解析为可读数据 从数据中then读取数据
            .then(data => handel(data))//执行结果是 resolve就调用then方法
            .catch(err => setErrorMessage(true))//执行结果是 reject就调用catch方法

        function handel(data) {
            console.log(data)
            setSuccessMessage(true)
            inital()
        }
    }

    function inital(page) {
        var url = "./api/get/MemberManagement/getMemberData?page=0"
        if (page != null) {
            url = "./api/get/MemberManagement/getMemberData?page=" + page
        }
        fetch(url, {//访问的域名中含有/api 则会使用代理 
            method: 'GET',
            credentials: "include",//包含Cookie
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())//解析为可读数据 从数据中then读取数据
            .then(data => {
                sethistoryPageTotal(data["total"])
                handel(data["data"])
            })//执行结果是 resolve就调用then方法
            .catch(err => console.log(err))//执行结果是 reject就调用catch方法

        function handel(data) {
            var editingStause = {}
            for (var sd of data) {
                editingStause[sd.id] = false;
            }
            setEditing(editingStause)
            setMemberData(data)
        }
    }
    useEffect(() => {
        inital();
    }, []);


    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const handelAddMember = () => {
        setAddDialogOpen(true)
    }
    const handleClose = () => {
        setAddDialogOpen(false)
        setSuccessMessage(false)
        setErrorMessage(false)
        setMemberRecordDialog(false)
    }
    const addingMember = () => {
        handleClose()
        var name = document.getElementById('addingName').value
        var point = document.getElementById('addingPoint').value
        var phone = document.getElementById('addingPhone').value
        var dataPack = { name: name, point: point, phone: phone }
        //发送 成功 更新  失败警告
        fetch('./api/post/MemberManagement/addingMember', {//访问的域名中含有/api 则会使用代理 
            method: 'POST',
            credentials: "include",//包含Cookie
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(dataPack),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())//解析为可读数据 从数据中then读取数据
            .then(data => handel(data))//执行结果是 resolve就调用then方法
            .catch(err => setErrorMessage(true))//执行结果是 reject就调用catch方法

        function handel(data) {
            console.log(data)
            setSuccessMessage(true)
            inital()
        }
    }

    const [successMessage, setSuccessMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }


    const [memberRecordDialog, setMemberRecordDialog] = useState(false)
    const [memberRecordData, setMemberRecordData] = useState([])
    function getMemberRecords(id) {
        fetch('./api/post/MemberManagement/getMemberRecords', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({ memberID: id }),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => {
                setMemberRecordData(data)
                setMemberRecordDialog(true)
            })
            .catch(err => console.log(err))
    }
    return (
        <React.Fragment>

            <Snackbar open={successMessage} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
                <Alert onClose={handleClose} severity="success">
                    操作成功
                </Alert>
            </Snackbar>

            <Snackbar open={errorMessage} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
                <Alert onClose={handleClose} severity="error">
                    操作失败
                </Alert>
            </Snackbar>



            <Dialog
                onClose={handleClose}
                open={addDialogOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Card className={classes.root}>
                    <CardContent >
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Title>添加会员</Title>
                            <TextField id="addingName" label="会员名" autoComplete='off' className={classes.mInfoIn} />
                            <TextField id="addingPhone" label="手机号" autoComplete='off' className={classes.mInfoIn} />
                            <TextField id="addingPoint" label="初始积分" autoComplete='off' className={classes.mInfoIn} defaultValue='0' />
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                            >
                                <Button
                                    className={classes.bottom}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<CheckIcon />}
                                    onClick={addingMember}
                                >
                                    确定
                                </Button>
                                <Button
                                    className={classes.bottom}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<CheckIcon />}
                                    onClick={handleClose}
                                >
                                    取消
                        </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Title>会员信息</Title>
                    <Tooltip title="添加会员" aria-label="添加会员" onClick={handelAddMember}>
                        <Fab color="secondary" className={classes.absolute}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>名称</TableCell>
                                <TableCell>卡号</TableCell>
                                <TableCell>手机号</TableCell>
                                <TableCell>注册日期</TableCell>
                                <TableCell>积分</TableCell>
                                <TableCell>操作</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {memberData.map(row => (
                                <TableRow key={row.id + "_" + Math.random()}>
                                    <TableCell><Input style={{ width: 80 }} id={'nameVal-' + row.id} readOnly={!editing[row.id]} disableUnderline={!editing[row.id]} margin='none' defaultValue={row.name} />
                                    </TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>
                                        <Input style={{ width: 140 }} id={'phoneVal-' + row.id} readOnly={!editing[row.id]} disableUnderline={!editing[row.id]} margin='none' defaultValue={row.phone} />
                                    </TableCell>
                                    <TableCell>{row.signUpDate}</TableCell>
                                    <TableCell onClick={() => { getMemberRecords(row.id) }}>{row.point}</TableCell>
                                    <TableCell>
                                        <Link onClick={() => { handelEdit(row.id) }} >
                                            编辑
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Zoom in={editing[row.id]}>
                                            <IconButton size='small' color='primary' aria-label="提交" onClick={() => {
                                                handelEdit(row.id);
                                                getChange(row.id);
                                            }}>
                                                <CheckIcon />
                                            </IconButton>
                                        </Zoom>
                                        <Zoom in={editing[row.id]}>
                                            <IconButton size='small' color='secondary' aria-label="取消" onClick={() => { handelEdit(row.id) }}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Zoom>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Container maxWidth="xl">
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                        >
                            <a key={historyPageCurrent} >
                                第{historyPageCurrent + 1}页 共{historyPageTotal}页
                                </a>
                            <IconButton clolor="primary" onClick={() => {
                                if (historyPageCurrent > 0) {
                                    inital(historyPageCurrent - 1)
                                    sethistoryPageCurrent(historyPageCurrent - 1)

                                }
                            }}>
                                <ChevronLeft />
                            </IconButton>

                            <IconButton clolor="primary" onClick={() => {
                                if (historyPageCurrent < historyPageTotal - 1) {
                                    inital(historyPageCurrent + 1)
                                    sethistoryPageCurrent(historyPageCurrent + 1)

                                }
                            }}>
                                <ChevronRight />
                            </IconButton>
                        </Grid>
                    </Container>
                </Paper>
            </Grid>

            <Dialog //执行结果
                onClose={handleClose}
                open={memberRecordDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Card className={classes.root}>
                    <CardContent >
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                        >

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>订单号</TableCell>
                                        <TableCell>消费金额</TableCell>
                                        <TableCell>点数</TableCell>
                                        <TableCell>消费日期</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {memberRecordData.map(row => (
                                        <TableRow key={row.id} >
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.money}</TableCell>
                                            <TableCell>{row.point}</TableCell>
                                            <TableCell>{row.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>

        </React.Fragment >
    );
}
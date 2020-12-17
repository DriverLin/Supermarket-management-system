import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Title from './Title';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DateFnsUtils from '@date-io/date-fns';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';



export default function SailInfo() {
    const useStyles = makeStyles(theme => ({
        bottomButton: {
            marginTop: theme.spacing(3),
        },
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
        },
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        typography: {
            padding: theme.spacing(2),
        },
        content: {
            flexGrow: 1,
            height: 'auto',
            overflow: 'auto',
        },
        appBarSpacer: theme.mixins.toolbar,
        root: {
            display: 'flex',
        },
        goodImage: {
            height: "80px",
            width: "80px"
        },
        tableContainer: {
            maxHeight: 440,
        },
        absolute: {
            position: 'absolute',
            bottom: theme.spacing(8),
            right: theme.spacing(8),
        },
        root_d: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
        },
        bottom: {
            margin: theme.spacing(3),
        },
        mInfoIn: {
            padding: theme.spacing(2),
        },
    }));
    const classes = useStyles();
    const [count, setCount] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [infoId, setInfoId] = React.useState('')

    const [selectedInvo, setSelectedInvo] = useState([])
    const handleClickOpen = (id) => {
        setOpen(true);
        fetch('./api/post/SailInfo/getInvoiceInfo', {//访问的域名中含有/api 则会使用代理 
            method: 'POST',
            credentials: "include",//包含Cookie
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({ invoiceId: id }),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())//解析为可读数据 从数据中then读取数据
            .then(data => setSelectedInvo(data))//执行结果是 resolve就调用then方法
            .catch(err => console.log(err))//执行结果是 reject就调用catch方法
    };
    const handleClose = () => {
        setOpen(false);
        setSelectDialog(false);
        setAddDialogOpen(false)
        setErrorMessage(false)
        setSuccessMessage(false)
    };
    const [selectDialog, setSelectDialog] = React.useState(false);
    const filtAndSelect = () => {
        setSelectDialog(true);
    }
    const [selectedDate, setSelectedDate] = React.useState();

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const [rows, setrows] = useState([])
    function updateData(args) {//接受参数 访问API获得数据 每次不大于10个
        fetch('./api/post/SailInfo/getTable', {//访问的域名中含有/api 则会使用代理 
            method: 'POST',
            credentials: "include",//包含Cookie
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(args),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())//解析为可读数据 从数据中then读取数据
            .then(data => setrows(data))//执行结果是 resolve就调用then方法
            .catch(err => console.log(err))//执行结果是 reject就调用catch方法
    }
    const exexSelect = () => {//执行查询  使用时间或者ID查询 服务器保存查询结果并返回10个值
        setSelectDialog(false);
        var sIDvalue = document.getElementById("idInputTextField").value;
        var sDate = selectedDate == undefined ? "" : selectedDate.toLocaleDateString();
        setSelectedDate(undefined);
        updateData({ action: "select", args: { time: sDate, id: sIDvalue } }) //如果有ID则忽略时间  ID为"" 则查询时间 时间为 "" 则表示未选择                                                            //初始化页面的查询 是用空值查询的 服务端保留上一次的状态
    }

    const initalint = () => {
        updateData({ action: "select", args: { time: '', id: '' } }) //初始化函数 从服务器获取数据 更新ROW
    }
    useEffect(() => {
        initalint();
    }, []);

    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const openAddCountDialog = () => {
        setAddDialogOpen(true)
    }

    const [successMessage, setSuccessMessage] = useState(false)

    const [errorMessage, setErrorMessage] = useState(false)
    const addingRecord = () => {
        handleClose()
        var dataPack = {
            memberID: document.getElementById("memberID").value,
            goodsString: document.getElementById("goodsString").value
        }
        fetch("./api/post/SailInfo/addRecord", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(dataPack),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => {
                if (data[0] == "success") {
                    setSuccessMessage(true)
                    updateData({ action: "next" })
                } else {
                    console.log(data[0])
                    setErrorMessage(true)
                }
            })
            .catch(err => {
                setErrorMessage(true)
            })
    }
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
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
            <Tooltip title="添加记录" aria-label="添加记录" onClick={openAddCountDialog}>
                <Fab color="secondary" className={classes.absolute}>
                    <AddIcon />
                </Fab>
            </Tooltip>
            <Dialog
                onClose={handleClose}
                open={addDialogOpen}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Card className={classes.root_d}>
                    <CardContent >
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Title>添加记录</Title>

                            <TextField id="memberID" label="会员ID(可选)" autoComplete='off' className={classes.mInfoIn} />
                            <TextField id="goodsString" label="商品记录" autoComplete='off' className={classes.mInfoIn} />
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
                                    onClick={addingRecord}
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



            <Title>订单记录</Title>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Card className={classes.root}>
                    <CardContent className={"nihao"}>
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="stretch"
                        >
                            <Table padding="default">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>时间</TableCell>
                                        <TableCell>发票ID</TableCell>
                                        <TableCell>机器ID</TableCell>
                                        <TableCell>支付金额</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{infoId.date}</TableCell>
                                        <TableCell>{infoId.invoiceId}</TableCell>
                                        <TableCell>{infoId.machineId}</TableCell>
                                        <TableCell>{infoId.amount}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <Card className={classes.root}>
                                <TableContainer className={classes.tableContainer}>
                                    <Table size="medium" stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>商品</TableCell>
                                                <TableCell>商品ID</TableCell>
                                                <TableCell>数量</TableCell>
                                                <TableCell>金额</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedInvo.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell>
                                                        <Card className={classes.root}>
                                                            <Grid
                                                                container
                                                                direction="column"
                                                                justify="flex-start"
                                                                alignItems="center"
                                                            >
                                                                <img className={classes.goodImage} src={row.img} />
                                                                <a>{row.name}</a>
                                                            </Grid>
                                                        </Card>
                                                    </TableCell>
                                                    <TableCell>{row.id}</TableCell>
                                                    <TableCell>{row.number}</TableCell>
                                                    <TableCell>{row.amount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>
            <Dialog
                open={selectDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Card className={classes.root}>
                    <CardContent>
                        <Grid
                            container
                            direction="column"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="日期查询"
                                        format="yyyy/MM/dd"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                            <TextField id="idInputTextField" label="输入ID查询" />
                            <Button variant="contained" color="primary" onClick={exexSelect} className={classes.bottomButton}>
                                确定
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>

            <Table>
                <TableHead>
                    <TableRow key={'header'}>
                        <TableCell>时间</TableCell>
                        <TableCell>发票ID</TableCell>
                        <TableCell>机器ID</TableCell>
                        <TableCell>支付金额</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id} onClick={function setID() {
                            setInfoId(row)
                            handleClickOpen(row.invoiceId)
                        }} >
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.invoiceId}</TableCell>
                            <TableCell>{row.machineId}</TableCell>
                            <TableCell>{row.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Container maxWidth="xl">
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <div className={classes.bottomButton}>
                        <Link color="primary" href="#" onClick={function () {
                            updateData({ action: "next" })
                        }}>
                            查看更多
                        </Link>
                    </div>

                    <div className={classes.bottomButton}>
                        <Link color="primary" href="#" onClick={filtAndSelect}>
                            筛选
                        </Link>
                    </div>


                </Grid>
            </Container>
        </React.Fragment>
    );
}

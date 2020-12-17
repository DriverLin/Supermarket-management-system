import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Title from './Title';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Input from '@material-ui/core/Input';
var curRowsSaved;
var timeMapTemp;


export default function Discount() { //倒计时由自己维护 并且倒计时结束更新自己 提醒另外两个组件更新自己   库存和已售 定时向服务器请求数据更新
    const [currentRows, setCurrentRows] = useState([])//当前的折扣 
    const [timeCountDown, setimeCountDown] = useState({})//计时器
    const [inventory, setInventory] = useState({})//库存
    const [preDiscount, setPreDiscount] = useState([])//未开始的数据
    const [historyDiscount, setHistoryDiscount] = useState([])//历史的数据
    const [dialogOpen, setDialogOpen] = useState(false)//添加的对话框
    const [fileName, setFileName] = useState('未选择文件'); //文件选择后显示文件名
    const [execResultDialog, setResultDialog] = useState(false)
    const [execDataResult, setexecDataResult] = useState([])
    const [prePageTotal, setprePageTotal] = useState(0)
    const [prePageCurrent, sertprePageCurrent] = useState(0)
    const [historyPageTotal, sethistoryPageTotal] = useState(0)
    const [historyPageCurrent, sethistoryPageCurrent] = useState(0)


    const openAddCountDialog = () => {
        setDialogOpen(true)
    }
    const handleDiallogClose = () => {
        setDialogOpen(false)
        setFileName('未选择文件')
    }

    const handleClose = () => {
        handleDiallogClose()
        setResultDialog(false)
    }

    const useStyles = makeStyles(theme => ({
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
        },
        speedDial: {
            position: 'absolute',
            bottom: theme.spacing(8),
            right: theme.spacing(8),
        },
        root: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
        },
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
        },
        button: {
            margin: theme.spacing(1),
            marginTop: theme.spacing(3)
        },
        absolute: {
            position: 'absolute',
            bottom: theme.spacing(8),
            right: theme.spacing(8),
        },
        bottomButton: {
            marginTop: theme.spacing(3),
        },
    }));

    const classes = useStyles();

    function timeCountDownUpdate() {
        timeMapTemp = new Map()
        for (var index = 0; index < curRowsSaved.length; index++)
            timeMapTemp.set(curRowsSaved[index].id, getDistanceTime(curRowsSaved[index].endTime))
        setimeCountDown(timeMapTemp)//倒计时        
    }

    function inventoryUpdate() {//更新库存
        fetch('./api/post/Discount/getInventory', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(curRowsSaved.map(row => (row.id))),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setInventory(data))
            .catch(err => console.log(err))
    }

    function getPreData(page) {//获未开始的数据
        var fetch_url = './api/get/Discount/getPreData?page=0'
        if (page != null) {
            fetch_url = './api/get/Discount/getPreData?page=' + page
        }
        fetch(fetch_url, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => {
                setprePageTotal(data["total"])
                setPreDiscount(data["data"])
            })
            .catch(err => console.log(err))
    }

    function getHistoryData(page) {//获取历史数据
        var fetch_url = './api/get/Discount/getHistoryData?page=0'
        if (page != null) {
            fetch_url = './api/get/Discount/getHistoryData?page=' + page
        }
        fetch(fetch_url, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => {
                sethistoryPageTotal(data["total"])
                setHistoryDiscount(data["data"])
            })
            .catch(err => console.log(err))

    }

    function getDistanceTime(time) {
        var endTime = new Date(Date.parse(time.replace(/-/g, "/")));/*replace将时间字符串中所有的'-'替换成'/',parse将时间格式的字符串转换成毫秒*/
        var nowTime = new Date();
        var distance = endTime.getTime() - nowTime.getTime();/*getTime把一个date对象转换成毫秒*/
        var day = 0;
        var hour = 0;
        var minute = 0;
        var second = 0;
        var downString;
        if (distance >= 0) {
            day = Math.floor(distance / 1000 / 60 / 60 / 24);
            hour = Math.floor(distance / 1000 / 60 / 60 % 24);
            minute = Math.floor(distance / 1000 / 60 % 60);
            second = Math.floor(distance / 1000 % 60);
            downString = day + "天" + hour + "时" + minute + "分" + second + "秒";
        } else {
            downString = "已结束"
        }
        return downString;
    }




    function inital() {
        fetch('./api/get/Discount/getCurrentData', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => handelResponse(data))
            .catch(err => console.log(err))
        getPreData()
        getHistoryData()

        function handelResponse(currentRowsTemp) {//先拿到了数据 再初始化需要动态请求的数据 再设置数据  设置更新
            curRowsSaved = currentRowsTemp
            timeMapTemp = new Map();
            for (var index = 0; index < currentRowsTemp.length; index++) {
                timeMapTemp.set(currentRowsTemp[index].id, getDistanceTime(currentRowsTemp[index].endTime))
            }

            inventoryUpdate()
            timeCountDownUpdate()

            setCurrentRows(currentRowsTemp)//初始化当前折扣数据

            setInterval(timeCountDownUpdate, 1000);//每秒更新倒计时
            setInterval(inventoryUpdate, 10000);//每10秒 向服务器请求 更新库存
        }
    }

    const removeDiscount = (rowValue) => {//删除未开始的折扣 
        fetch('./api/post/Discount/delDiscount', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(rowValue),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(getPreData())
            .catch(err => console.log(err))//成功 更新 失败 警告
    }

    const uploadDiscountFile = () => {
        var file = document.getElementById('addDiscountFileUpload').files[0]
        console.log(file)
        if (file == undefined) {
            handleDiallogClose()
            return
        }
        var formData = new FormData()
        formData.append("file", file, file.name)//name value filename
        fetch('./api/upload/Discount/addDiscount', {
            method: 'POST',
            credentials: "include",
            // headers: {
            //     "Content-Type": "multipart/form-data" //不要加headers   会报错
            // },
            body: formData,
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => {
                setexecDataResult(data)
                handleDiallogClose()
                setResultDialog(true)
                getPreData()
            })
            .catch(err => console.log(err))

    }

    useEffect(() => {
        inital()
    }, []);





    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Paper className={classes.paper}>

                    <Title>当前进行中的折扣</Title>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>商品</TableCell>
                                <TableCell>商品ID</TableCell>
                                <TableCell>原价</TableCell>
                                <TableCell>折扣价</TableCell>
                                <TableCell>折扣比</TableCell>
                                <TableCell>结束时间</TableCell>
                                <TableCell>剩余时间</TableCell>
                                <TableCell>库存</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentRows.map(row => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.price}</TableCell>
                                    <TableCell>{row.discountPrice}</TableCell>
                                    <TableCell>{row.percent}</TableCell>
                                    <TableCell>{row.endTime}</TableCell>
                                    <TableCell>{timeCountDown.get(row.id)}</TableCell>
                                    <TableCell>{inventory[row.id]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <React.Fragment>
                        <Title>未开始的的折扣</Title>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>商品</TableCell>
                                    <TableCell>商品ID</TableCell>
                                    <TableCell>原价</TableCell>
                                    <TableCell>折扣价</TableCell>
                                    <TableCell>折扣比</TableCell>
                                    <TableCell>开始时间</TableCell>
                                    <TableCell>结束时间</TableCell>
                                    <TableCell>操作</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {preDiscount.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>{row.discountPrice}</TableCell>
                                        <TableCell>{row.percent}</TableCell>
                                        <TableCell>{row.startTime}</TableCell>
                                        <TableCell>{row.endTime}</TableCell>
                                        <TableCell>
                                            <Link href="#" color='secondary' onClick={function () { removeDiscount(row) }}>
                                                删除
                                            </Link>
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
                                <a key={prePageCurrent} >
                                    第{prePageCurrent + 1}页 共{prePageTotal}页
                                </a>
                                <IconButton clolor="primary" onClick={() => {
                                    if (prePageCurrent >= 1) {
                                        getPreData(prePageCurrent - 1)

                                        sertprePageCurrent(prePageCurrent - 1)
                                    }
                                }}>
                                    <ChevronLeft />
                                </IconButton>

                                <IconButton clolor="primary" onClick={() => {
                                    if (prePageCurrent < prePageTotal - 1) {
                                        getPreData(prePageCurrent + 1)

                                        sertprePageCurrent(prePageCurrent + 1)
                                    }
                                }}>
                                    <ChevronRight />
                                </IconButton>
                            </Grid>
                        </Container>
                    </React.Fragment>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <React.Fragment>
                        <Title>历史折扣</Title>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>商品</TableCell>
                                    <TableCell>商品ID</TableCell>
                                    <TableCell>原价</TableCell>
                                    <TableCell>折扣价</TableCell>
                                    <TableCell>折扣比</TableCell>
                                    <TableCell>开始时间</TableCell>
                                    <TableCell>结束时间</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historyDiscount.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.price}</TableCell>
                                        <TableCell>{row.discountPrice}</TableCell>
                                        <TableCell>{row.percent}</TableCell>
                                        <TableCell>{row.startTime}</TableCell>
                                        <TableCell>{row.endTime}</TableCell>
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
                                        getHistoryData(historyPageCurrent - 1)

                                        sethistoryPageCurrent(historyPageCurrent - 1)
                                    }
                                }}>
                                    <ChevronLeft />
                                </IconButton>

                                <IconButton clolor="primary" onClick={() => {
                                    if (historyPageCurrent < historyPageTotal - 1) {
                                        getHistoryData(historyPageCurrent + 1)

                                        sethistoryPageCurrent(historyPageCurrent + 1)
                                    }
                                }}>
                                    <ChevronRight />
                                </IconButton>
                            </Grid>
                        </Container>
                    </React.Fragment>
                </Paper>
            </Grid>



            <Dialog
                open={dialogOpen}
                onClose={handleDiallogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="center"
                    className={classes.root}
                >
                    <Title>添加折扣信息</Title>
                    <input
                        className={classes.input}
                        id="addDiscountFileUpload"
                        type="file"
                        style={{ display: 'none', }}
                        onChange={
                            function () {
                                var file = document.getElementById('addDiscountFileUpload').files[0]
                                if (file == undefined) {
                                    return
                                }
                                if (file.name.length > 18) {
                                    setFileName(file.name.slice(0, 15) + '...')
                                }
                                else
                                    setFileName(file.name)
                            }
                        }
                    />

                    <label htmlFor="addDiscountFileUpload" >
                        <Button variant="contained" color="secondary" component="span" className={classes.button} startIcon={<CloudUploadIcon />}>
                            上传表格文件
                        </Button>
                    </label>
                    <Typography variant='body2' component='p'>
                        {fileName}
                    </Typography>

                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        className={classes.root}
                    >
                        <Button variant="contained" color="primary" style={{ marginRight: '50px' }} onClick={uploadDiscountFile}>确认</Button>
                        <Button variant="contained" color="secondary" style={{ marginLeft: '50px' }} onClick={handleDiallogClose}>取消</Button>

                    </Grid>
                </Grid>

            </Dialog>

            <Dialog //执行结果
                onClose={handleClose}
                open={execResultDialog}
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
                                        <TableCell>ID</TableCell>
                                        <TableCell>商品名</TableCell>
                                        <TableCell>折扣比</TableCell>
                                        <TableCell>开始时间</TableCell>
                                        <TableCell>状态</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {execDataResult.map(row => (
                                        <TableRow key={row.id} >
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.percent}</TableCell>
                                            <TableCell>{row.startTime}</TableCell>
                                            <TableCell>{row.stause}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>

            <Tooltip title="添加折扣" aria-label="添加折扣" onClick={openAddCountDialog}>
                <Fab color="secondary" className={classes.absolute}>
                    <AddIcon />
                </Fab>
            </Tooltip>
        </React.Fragment >
    );
}
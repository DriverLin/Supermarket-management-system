import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Title from './Title';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Input from '@material-ui/core/Input';
import Zoom from '@material-ui/core/Zoom';
import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';



import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

export function AttendanceSheet() {
    const useStyles = makeStyles(theme => ({
        fixedHeightTableContainer: {
            maxHeight: 400,
        },
    }))
        ;
    const classes = useStyles();
    const [selectedDate, setSelectedDate] = useState();
    const handleDateChange = date => {
        setSelectedDate(date);
        updateTable(date)
    };
    const [attendanceData, setAttendanceData] = useState([]);
    function updateTable(date) {
        fetch('./api/post/StaffManagement/getAttendanceSheet', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(date),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setAttendanceData(data))
            .catch(err => console.log(err))
    }
    useEffect(() => {
        updateTable(new Date())
    }, [])


    return (<React.Fragment>
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-end"
        >
            <Title>员工考勤表</Title>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <KeyboardDatePicker
                    margin="normal"
                    id="AttendanceSheetDatePicker"
                    label=""
                    format="yyyy/MM/dd"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                    style={{ "width": 170 }}
                />
            </MuiPickersUtilsProvider>
        </Grid>
        <TableContainer className={classes.fixedHeightTableContainer}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>姓名</TableCell>
                        <TableCell>签到</TableCell>
                        <TableCell>签退</TableCell>
                        <TableCell>说明</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {attendanceData.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.checkIn}</TableCell>
                            <TableCell>{row.checkOut}</TableCell>
                            <TableCell>{row.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </React.Fragment>)
}

export function AbsenteeismSheet() {
    const useStyles = makeStyles(theme => ({
        fixedHeightTableContainer: {
            maxHeight: 400,
        },
    }))
        ;
    const classes = useStyles();
    const [absenteeismData, setAbsenteeismData] = useState([]);
    function inital() {
        fetch('./api/get/StaffManagement/getAbsenteeismSheet', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setAbsenteeismData(data))
            .catch(err => console.log(err))
    }
    useEffect(() => {
        inital();
    }, [])
    return (<React.Fragment>
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-end"
        >
            <Title>缺勤/请假 记录</Title>
        </Grid>
        <TableContainer className={classes.fixedHeightTableContainer}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>姓名</TableCell>
                        <TableCell>日期</TableCell>
                        <TableCell>说明</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {absenteeismData.map(row => (
                        <TableRow key={row.id + "-" + row.date}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </React.Fragment>)
}

export function DepartSheet() {
    const [dispalyingData, setDispalyingData] = useState([])
    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
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
        root_d: {
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

    function getDisplayData(department) {
        fetch('./api/post/StaffManagement/getStaffByDepartment', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(department),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => handel(data))
            .catch(err => console.log(err))
        function handel(data) {
            setDispalyingData(data)
            for (var rec of data) {
                editingStause[rec.id] = false;
            }
            setEditing(editingStause)
        }
    }
    const [deparment, setDepartment] = useState([])
    const [selectedDepertment, setSelectedDepertment] = useState("")
    function getDepartment() {
        fetch('./api/get/StaffManagement/getDepartment', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => {
                setDepartment(data)
                changeSelectedDepartment(data[0])//使用这个名称  获取列表
            })
            .catch(err => console.log(err))
    }
    useEffect(() => {
        getDepartment()
    }, []);

    const tableHead = ["ID", "姓名", "联系方式", "工资", "职位", "所属部门", "入职日期", "操作", ""]

    const [editing, setEditing] = useState({})

    function handelEdit(id) {
        var editingStause = {}
        for (var data of dispalyingData) {
            editingStause[data.id] = false;
        }
        editingStause[id] = !editing[id]
        setEditing(editingStause)
    }


    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }


    function changeSelectedDepartment(departmentName) {//切换显示部门数据 按钮切换
        setChartTransition(false)
        setSelectedDepertment(departmentName)//设置选中的部名
        getDisplayData(departmentName)//获取数据
        setTimeout(function () {
            setChartTransition(true);
        }, 200);
    }
    function getChange(id) {//修改员工数据 提交
        var dataPack = {
            id: id,
            name: document.getElementById("staff_name_" + id).value,
            phone: document.getElementById("staff_phone_" + id).value,
            sallary: document.getElementById("staff_sallary_" + id).value,
            position: document.getElementById("staff_position_" + id).value,
            department: document.getElementById("staff_department_" + id).value
        }
        fetch('./api/post/StaffManagement/getChange', {
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
                console.log(data)
                getDisplayData(selectedDepertment)//发送修改的内容  更新显示数据
            })
            .catch(err => console.log(err))
    }

    const [chartTransition, setChartTransition] = useState(true)

    const changeChartHiden = () => {
        setChartTransition(!chartTransition)
    }


    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const handleClose = () => {
        setAddDialogOpen(false)
        setErrorMessage(false)
        setSuccessMessage(false)
    }

    const [successMessage, setSuccessMessage] = useState(false)

    const [errorMessage, setErrorMessage] = useState(false)

    const addingStaff = () => {
        handleClose()
        var dataPack = {
            name: document.getElementById("addingName").value,
            phone: document.getElementById("addingPhone").value,
            sallary: document.getElementById("addingSallary").value,
            position: document.getElementById("addingPos").value,
            department: document.getElementById("addingDep").value,
        }
        fetch('./api/post/StaffManagement/addStaff', {
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
                getDisplayData(document.getElementById("addingDep").value)//发送修改的内容  更新显示数据
                setSuccessMessage(true)

            })
            .catch(err => {
                console.log(err)
                setErrorMessage(true)
            })

    }
    const openAddCountDialog = () => {
        setAddDialogOpen(true)
    }

    return (<React.Fragment>
        <Title>员工管理</Title>
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
            <Card className={classes.root_d}>
                <CardContent >
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Title>添加员工</Title>

                        <TextField id="addingName" label="姓名" autoComplete='off' className={classes.mInfoIn} />
                        <TextField id="addingPhone" label="联系方式" autoComplete='off' className={classes.mInfoIn} />
                        <TextField id="addingSallary" label="工资" autoComplete='off' className={classes.mInfoIn} />
                        <TextField id="addingPos" label="职位" autoComplete='off' className={classes.mInfoIn} />
                        <TextField id="addingDep" label="所属部门" autoComplete='off' className={classes.mInfoIn} />
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
                                onClick={addingStaff}
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


        <div className={classes.root}>
            <ButtonGroup color="primary" aria-label="outlined secondary button group" style={{ alignItems: 'center', }}>
                {deparment.map(row => (<Button key={row} onClick={() => { changeSelectedDepartment(row) }}>
                    {row}
                </Button>))}
            </ButtonGroup>
            <Zoom in={chartTransition}>
                <Table>
                    <TableHead>
                        <TableRow key={"head"}>
                            {tableHead.map(data => (
                                <TableCell key={data}>{data}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dispalyingData.map(row => (
                            <TableRow key={row.id + "_" + Math.random()} > {/* 随机数 作为kry 确保每次都是更新数据 */}
                                <TableCell>{row.id}</TableCell>
                                <TableCell>
                                    <Input style={{ width: 80 }} id={'staff_name_' + row.id} readOnly={!editing[row.id]} disableUnderline={!editing[row.id]} margin='none' defaultValue={row.name} />
                                </TableCell>
                                <TableCell>
                                    <Input style={{ width: 140 }} id={'staff_phone_' + row.id} readOnly={!editing[row.id]} disableUnderline={!editing[row.id]} margin='none' defaultValue={row.phone} />
                                </TableCell>
                                <TableCell>
                                    <Input style={{ width: 140 }} id={'staff_sallary_' + row.id} readOnly={!editing[row.id]} disableUnderline={!editing[row.id]} margin='none' defaultValue={row.sallary} />
                                </TableCell>
                                <TableCell>
                                    <Input style={{ width: 140 }} id={'staff_position_' + row.id} readOnly={!editing[row.id]} disableUnderline={!editing[row.id]} margin='none' defaultValue={row.position} />
                                </TableCell>
                                <TableCell>
                                    <Input style={{ width: 140 }} id={'staff_department_' + row.id} readOnly={!editing[row.id]} disableUnderline={!editing[row.id]} margin='none' defaultValue={row.department} />
                                </TableCell>
                                <TableCell>{row.entrydate}</TableCell>
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
            </Zoom>
        </div>
        <Tooltip title="添加员工" aria-label="添加员工" onClick={openAddCountDialog}>
            <Fab color="secondary" className={classes.absolute}>
                <AddIcon />
            </Fab>
        </Tooltip>

    </React.Fragment>
    )
}
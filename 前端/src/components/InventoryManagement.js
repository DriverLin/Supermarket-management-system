import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import InventoryInfoChart from './InventoryInfoChart'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DateFnsUtils from '@date-io/date-fns';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function InventoryManagement() {
    const useStyles = makeStyles(theme => ({
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column',
        }, absolute: {
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

    const [inRecord, setInRecord] = useState([])
    const getInRecord = () => {
        fetch('./api/get/Inventory/getInRecord', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setInRecord(data))
            .catch(err => console.log(err))
    }

    const [outRecord, setOutRecord] = useState([])
    const getOutRecord = () => {
        fetch('./api/get/Inventory/getOutRecord', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setOutRecord(data))
            .catch(err => console.log(err))
    }

    const [invStause, setInvStause] = useState([])
    const getInvStause = () => {
        fetch('./api/get/Inventory/getInvStause', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setInvStause(data))
            .catch(err => console.log(err))
    }

    const inital = () => {
        getInRecord()
        getOutRecord()
        getInvStause()
    }

    useEffect(() => {
        inital()
    }, []);

    const handleClose = () => {
        setAddDialogOpen(false)
        setSuccessMessage(false)
        setErrorMessage(false)
    }



    const openAddCountDialog = () => {
        setAddDialogOpen(true)
    }

    const [addDialogOpen, setAddDialogOpen] = useState(false)

    const [successMessage, setSuccessMessage] = useState(false)

    const [errorMessage, setErrorMessage] = useState(false)
    const addingRecord = () => {
        handleClose()
        var dataPack = {
            date: document.getElementById("add_date").value,
            id: document.getElementById("add_goodsid").value,
            count: document.getElementById("add_count").value
        }
        fetch("./api/post/Inventory/addRecord", {
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
                    if (document.getElementById("add_count").value > 0) {
                        getInRecord()
                        getInvStause()

                    } else {
                        getOutRecord()
                        getInvStause()
                    }

                    setSuccessMessage(true)
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

                            <TextField id="add_date" label="日期" autoComplete='off' className={classes.mInfoIn} />
                            <TextField id="add_goodsid" label="商品id" autoComplete='off' className={classes.mInfoIn} />
                            <TextField id="add_count" label="出/入数量" autoComplete='off' className={classes.mInfoIn} />
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



            <Grid item xs={12}>
                <Paper className={classes.paper} id={"InventoryInfoChart_Paper"}>
                    <InventoryInfoChart />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Title>入库记录</Title>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>日期</TableCell>
                                <TableCell>商品</TableCell>
                                <TableCell>商品ID</TableCell>
                                <TableCell>入库数量</TableCell>
                                <TableCell>原先库存</TableCell>
                                <TableCell>入库后库存</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inRecord.map(row => (
                                <TableRow key={row.id + '-' + row.date}>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.inNum}</TableCell>
                                    <TableCell>{row.numBefore}</TableCell>
                                    <TableCell>{row.numAfter}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <React.Fragment>
                        <Title>出库记录</Title>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>日期</TableCell>
                                    <TableCell>商品</TableCell>
                                    <TableCell>商品ID</TableCell>
                                    <TableCell>出库数量</TableCell>
                                    <TableCell>原先库存</TableCell>
                                    <TableCell>出库后库存</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {outRecord.map(row => (
                                    <TableRow key={row.id + '-' + row.date}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.outNum}</TableCell>
                                        <TableCell>{row.numBefore}</TableCell>
                                        <TableCell>{row.numAfter}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </React.Fragment>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <React.Fragment>
                        <Title>库存状态</Title>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>商品</TableCell>
                                    <TableCell>商品ID</TableCell>
                                    <TableCell>库存</TableCell>
                                    <TableCell>最近记录时间</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invStause.map(row => (
                                    <TableRow key={row.id + '-' + row.date}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.num}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </React.Fragment>
                </Paper>
            </Grid>
        </React.Fragment >
    );
}
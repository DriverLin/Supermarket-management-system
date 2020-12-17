import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Title from './Title';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import EditIcon from '@material-ui/icons/Edit';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(5)
    },
    root: {
        display: 'flex',
    },
    bottomButton: {
        marginTop: theme.spacing(3),
    },
    uploadButton: {
        width: theme.spacing(30),
    }
}));

export default function ManageGoods() {//管理商品 上架下架的
    const classes = useStyles();

    const [putDown, setputDownOpen] = React.useState(false); //下架对话框

    const [putUp, setputUpOpen] = React.useState(false); //上架对话框

    const [changeGoods, setchangeGoods] = React.useState(false); //修改商品对话框

    const [execResultDialog, setexecResultDialog] = React.useState(false); //执行结果对话框

    const [execDataResult, setexecDataResult] = React.useState([]); //执行结果 数据

    const [fileName, setFileName] = React.useState('未选择文件'); //文件选择后显示文件名

    const handleClose = () => { //关闭所有对话框  设置文件显示为未选择
        setputDownOpen(false)
        setputUpOpen(false)
        setchangeGoods(false)
        setexecResultDialog(false)
        setFileName('未选择文件')
    };

    const handlePutDownOpen = () => {
        setputDownOpen(true);
    };
    const handlePutUpOpen = () => {
        setputUpOpen(true);
    };

    const handleChangeGoods = () => {
        setchangeGoods(true)
    }

    const putDownById = () => {
        var idList = document.getElementById("idListInputTextField").value;
        fetch('./api/post/ManageGoods/putDown', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify(idList),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setexecDataResult(data))
            .catch(err => console.log(err))
        handleClose()
        setexecResultDialog(true)
    }

    const upLoadputUpFile = () => {
        var file = document.getElementById('adderFileInput').files[0]
        console.log(file)
        if (file == undefined) {
            handleClose()
            return
        }
        var formData = new FormData()
        formData.append("file", file, file.name)//name value filename
        fetch('./api/upload/ManageGoods/putUp', {
            method: 'POST',
            credentials: "include",
            // headers: {
            //     "Content-Type": "multipart/form-data" //不要加headers   会报错
            // },
            body: formData,
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setexecDataResult(data))
            .catch(err => console.log(err))
        handleClose()
        setexecResultDialog(true)
    }
    const upLoadchangeFile = () => {
        var file = document.getElementById('changeFileInput').files[0]
        console.log(file)
        if (file == undefined) {
            handleClose()
            return
        }
        var formData = new FormData()
        formData.append("file", file, file.name)//name value filename
        fetch('./api/upload/ManageGoods/getChange', {
            method: 'POST',
            credentials: "include",
            // headers: {
            //     "Content-Type": "multipart/form-data" //不要加headers   会报错
            // },
            body: formData,
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => setexecDataResult(data))
            .catch(err => console.log(err))
        handleClose()
        setexecResultDialog(true)
    }

    return (
        <React.Fragment>
            <Dialog //执行结果
                open={execResultDialog}
                onClose={handleClose}
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
                                        <TableCell>状态</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {execDataResult.map(row => (
                                        <TableRow key={row.id} >
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.stause}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>


            <Dialog //修改信息
                open={changeGoods}
                onClose={handleClose}
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

                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="center"
                                className={classes.uploadButton}
                            >
                                <input
                                    className={classes.input}
                                    id="changeFileInput"
                                    type="file"
                                    style={{ display: 'none', }}
                                    onChange={
                                        function () {
                                            var file = document.getElementById('changeFileInput').files[0]
                                            if (file == undefined) {
                                                return
                                            }
                                            setFileName(file.name)
                                        }
                                    }
                                />
                                <label htmlFor="changeFileInput">
                                    <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
                                        上传表格文件
                                    </Button>
                                </label>

                                <Typography variant='body2' component='p'>
                                    {fileName}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Button variant="contained" color="primary" className={classes.bottomButton} onClick={upLoadchangeFile}>
                                    确定
                                </Button>
                                <Button variant="contained" color="secondary" className={classes.bottomButton} onClick={handleClose}>
                                    取消
                            </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>


            <Dialog //商品上架
                open={putUp}
                onClose={handleClose}
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

                            <Grid
                                container
                                direction="column"
                                justify="flex-start"
                                alignItems="center"
                                className={classes.uploadButton}
                            >
                                <input
                                    className={classes.input}
                                    id="adderFileInput"
                                    type="file"
                                    style={{ display: 'none', }}
                                    onChange={
                                        function () {
                                            var file = document.getElementById('adderFileInput').files[0]
                                            if (file == undefined) {
                                                return
                                            }
                                            setFileName(file.name)
                                        }
                                    }
                                />
                                <label htmlFor="adderFileInput">
                                    <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
                                        上传表格文件
                                    </Button>
                                </label>

                                <Typography variant='body2' component='p'>
                                    {fileName}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Button variant="contained" color="primary" className={classes.bottomButton} onClick={upLoadputUpFile}>
                                    确定
                            </Button>
                                <Button variant="contained" color="secondary" className={classes.bottomButton} onClick={handleClose}>
                                    取消
                            </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>
            <Dialog //上平上架
                open={putDown}
                onClose={handleClose}
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
                            <TextField id="idListInputTextField" label="输入商品ID / 隔开" autoComplete="off" />
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Button variant="contained" color="primary" className={classes.bottomButton} onClick={putDownById}>
                                    确定
                            </Button>
                                <Button variant="contained" color="secondary" className={classes.bottomButton} onClick={handleClose}>
                                    取消
                            </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Dialog>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Title>商品管理</Title>
                <Grid
                    container
                    direction="column"
                    justify="space-evenly"
                    alignItems="stretch"
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<DeleteSweepIcon />}
                        onClick={handlePutDownOpen}
                    >
                        商品下架
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<PlaylistAddIcon />}
                        onClick={handlePutUpOpen}
                    >
                        商品上架
                </Button>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<EditIcon />}
                        onClick={handleChangeGoods}
                    >
                        修改商品
                </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}
import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import IconButton from '@material-ui/core/IconButton';



export default function GoodInofPaper() {
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
            maxHeight: "80px",
            maxWidth: "80px"
        },
        goodImage_container: {
            height: "80px",
            hidth: "80px",
            borderRadius: "5px"
        },
        tableContainer: {
            maxHeight: 440,
        },
    }));
    const classes = useStyles();
    const [rows, setRows] = useState([])
    const [historyPageTotal, sethistoryPageTotal] = useState(0)
    const [historyPageCurrent, sethistoryPageCurrent] = useState(0)

    function updateData(args) {//接受参数 访问API获得数据 每次不大于10个
        console.log(args)
        fetch('./api/post/goodInfo/getTable', {//访问的域名中含有/api 则会使用代理 
            method: 'POST',
            credentials: "include",//包含Cookie
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                page: args
            }),
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())//解析为可读数据 从数据中then读取数据
            .then(data => {
                sethistoryPageTotal(data["total"])
                setRows(data["data"])
            })//执行结果是 resolve就调用then方法
            .catch(err => console.log(err))//执行结果是 reject就调用catch方法
    }

    const initalint = () => {
        updateData(0) //初始化函数 从服务器获取数据 更新ROW
    }
    useEffect(() => {
        initalint();
    }, []);

    return (
        <div>
            <React.Fragment>
                <Title>商品信息</Title>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>商品</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>种类</TableCell>
                            <TableCell>售价</TableCell>
                            <TableCell>库存</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.goodsId} onClick={function setID() {

                            }} >
                                <TableCell>

                                    <Grid
                                        container
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="flex-start"
                                    >
                                        <img className={classes.goodImage} src={"http://127.0.0.1:8080/" + row.imgSrc} />
                                        <a>{row.goods}</a>
                                    </Grid>

                                </TableCell>
                                <TableCell>{row.goodsId}</TableCell>
                                <TableCell>{row.kind}</TableCell>
                                <TableCell>{row.price}</TableCell>
                                <TableCell>{row.inventory}</TableCell>
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
                                updateData(historyPageCurrent - 1)
                                sethistoryPageCurrent(historyPageCurrent - 1)

                            }
                        }}>
                            <ChevronLeft />
                        </IconButton>

                        <IconButton clolor="primary" onClick={() => {
                            if (historyPageCurrent < historyPageTotal - 1) {
                                updateData(historyPageCurrent + 1)
                                sethistoryPageCurrent(historyPageCurrent + 1)

                            }
                        }}>
                            <ChevronRight />
                        </IconButton>
                    </Grid>
                </Container>
            </React.Fragment>
        </div>
    );
}

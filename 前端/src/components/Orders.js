import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

export default function Orders() {
  const [rows, setRows] = useState([])
  useEffect(() => {
    fetch('./api/get/RecentOrder/getData', {//访问的域名中含有/api 则会使用代理 
      method: 'GET',
      credentials: "include",//包含Cookie
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      mode: 'cors',
      cache: 'no-store'
    }).then(response => response.json())//解析为可读数据 从数据中then读取数据
      .then(data => setRows(data))//执行结果是 resolve就调用then方法
      .catch(err => console.log(err))//执行结果是 reject就调用catch方法
  }, []);

  return (
    <React.Fragment>
      <Title>最近销售记录</Title>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>时间</TableCell>
            <TableCell>发票ID</TableCell>
            <TableCell>机器ID</TableCell>
            <TableCell>支付金额</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.invoiceId}</TableCell>
              <TableCell>{row.machineId}</TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

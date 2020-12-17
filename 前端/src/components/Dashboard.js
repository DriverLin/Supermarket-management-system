import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { MainListItems, SecondaryListItems } from './listItems';
import DayIncomeChart from './DayIncomeChart';
import CurrentIncomeChart from './CurrentIncomeChart';
import Orders from './Orders';
import SailInfo from './sailInfo'
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';
import Zoom from '@material-ui/core/Zoom';
import GoodInofPaper from './goodsInfo'
import Title from './Title';

import GoodsInfoChart from './goodsInfoChart'

import ManageGoods from './ManageGoods'

import Discount from './Discount'

import InventoryManagement from './InventoryManagement'

import MemberManagement from './MemberManagement'

import { AttendanceSheet, AbsenteeismSheet, DepartSheet } from "./StaffManagement"

export default function Dashboard() {
  const drawerWidth = 240;
  const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 300,
    },
    gm_fixedHeight: {
      height: 500,
    },
  }));

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [hp, hpChecked] = React.useState(true);
  const [si, siChecked] = React.useState(false);
  const [gi, giChecked] = React.useState(false);
  const [di, diChecked] = React.useState(false);
  const [im, imChecked] = React.useState(false);
  const [mm, mmChecked] = React.useState(false);
  const [sm, smChecked] = React.useState(false);

  const handleChange = (value) => {
    const stause = [
      hpChecked,
      siChecked,
      giChecked,
      diChecked,
      imChecked,
      mmChecked,
      smChecked
    ]
    for (let i = 0; i < stause.length; i++) {
      stause[i](false)
    }
    stause[value](true)
  };

  function handleChangeGridContainer(value) {
    handleChange(value)
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const gm_FixedHeightPaper = clsx(classes.paper, classes.gm_fixedHeight);



  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            管理后台
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List><MainListItems func={handleChangeGridContainer} /></List>
        <Divider />
        {/* <List><SecondaryListItems /></List> */}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Collapse in={hp}>
            <Zoom in={hp}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={8}>
                  <Paper className={fixedHeightPaper}>
                    <Title>总销售情况</Title>
                    <DayIncomeChart />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <Paper className={fixedHeightPaper}>
                    <Title>当前销售情况</Title>
                    <CurrentIncomeChart />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Orders name='react' />
                  </Paper>
                </Grid>
              </Grid>
            </Zoom>
          </Collapse>

          <Collapse in={si}>
            <Zoom in={si}>
              <Grid container>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <SailInfo name='react' />
                  </Paper>
                </Grid>
              </Grid>
            </Zoom>
          </Collapse>

          <Collapse in={gi}>
            <Zoom in={gi}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={9} lg={9}>
                  <Paper className={gm_FixedHeightPaper}>
                    <GoodsInfoChart />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <Paper className={gm_FixedHeightPaper}>
                    <ManageGoods />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <GoodInofPaper name='react' />
                  </Paper>
                </Grid>
              </Grid>
            </Zoom>
          </Collapse>

          <Collapse in={di}>
            <Zoom in={di}>
              <Grid container spacing={3}>
                <Discount />
              </Grid>
            </Zoom>
          </Collapse>

          <Collapse in={im}>
            <Zoom in={im}>
              <Grid container spacing={3}>
                <InventoryManagement />
              </Grid>
            </Zoom>
          </Collapse>

          <Collapse in={mm}>
            <Zoom in={mm}>
              <Grid container spacing={3}>
                <MemberManagement />
              </Grid>
            </Zoom>
          </Collapse>

          <Collapse in={sm}>
            <Zoom in={sm}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Paper className={classes.paper} style={{ 'height': 450 }} >
                    <AttendanceSheet />
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper className={classes.paper} style={{ 'height': 450 }} >
                    <AbsenteeismSheet />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper} >
                    <DepartSheet />
                  </Paper>
                </Grid>
              </Grid>
            </Zoom>
          </Collapse>

        </Container>
      </main>
    </div>
  );
}

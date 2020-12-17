import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import StorefrontIcon from '@material-ui/icons/Storefront';
import HomeIcon from '@material-ui/icons/Home';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import CreditCardIcon from '@material-ui/icons/CreditCard';
export function MainListItems(props) {
  return (
    <div>
      <ListItem button onClick={function mainPageClicked() {
        props.func(0)
      }}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="首页" />
      </ListItem>

      <ListItem button onClick={function mainPageClicked() {
        props.func(1)
      }}>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="订单记录" />
      </ListItem>
      <ListItem button onClick={function mainPageClicked() {
        props.func(2)
      }}>
        <ListItemIcon>
          <StorefrontIcon />
        </ListItemIcon>
        <ListItemText primary="商品信息" />
      </ListItem>
      <ListItem button onClick={function mainPageClicked() {
        props.func(3)
      }}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="折扣信息" />
      </ListItem>
      <ListItem button onClick={function mainPageClicked() {
        props.func(4)
      }}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="库存管理" />
      </ListItem>

      <ListItem button onClick={function mainPageClicked() {
        props.func(5)
      }}>
        <ListItemIcon>
          <CreditCardIcon />
        </ListItemIcon>
        <ListItemText primary="会员管理" />
      </ListItem>

      <ListItem button onClick={function mainPageClicked() {
        props.func(6)
      }}>
        <ListItemIcon>
          <PeopleAltIcon />
        </ListItemIcon>
        <ListItemText primary="员工管理" />
      </ListItem>
    </div>
  );
};

export function SecondaryListItems() {
  return (
    <div>
      <ListSubheader inset>报告</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="昨日" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="当月" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="季度" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="年度" />
      </ListItem>
    </div>
  );
}

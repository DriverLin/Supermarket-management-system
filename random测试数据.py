import json
import time
import sqlite3
import random
import requests

con = sqlite3.connect(r"H:\数据库项目\store.db")


day_start = 1607163332


# # 部门 没什么好说的
# for i in range(6):
#     bid = i+1
#     name = "部门"+str(bid)
#     rec = (bid, name)
#     con.execute("insert into department values(?,?)", rec)


# # 员工  独立的
# for i in range(60):
#     uid = i+1
#     name = "员工"+str(i+1)
#     phone = random.randint(10000000000, 99999999999)
#     sallary = random.randint(3, 12)*1000
#     position = "职位"+str((i+1) % 10+1)
#     department_id = random.randint(1, 6)
#     entrydate = random.randint(1606440715, 1607854532)
#     rec = (uid, name, phone, sallary, position, department_id, entrydate)
#     con.execute("insert into staff values(?,?,?,?,?,?,?)", rec)

# # 签到 独立的
# for i in range(10):
#     start = day_start+i*27*3600
#     for i in range(10):  # 每天10条记录
#         uid = i+1
#         name = "员工"+str(uid)
#         date = day_start+12*3600
#         desc = "签到"
#         chin = start+8*3600+random.randint(200, 3600)
#         chout = start+18*3600+random.randint(200, 3600)
#         rec = (uid, name, date, desc, chin, chout)
#         con.execute("insert into absenteeism values(?,?,?,?,?,?)", rec)

# # 商品

# for i in range(100):
#     data = {
#         "typeid": i % 10+1,
#         "name": "商品"+str(i+1),
#         "price": random.randint(10, 200),
#         "img": './{:03d}.jpg'.format(random.randint(0, 20))
#     }
#     con.execute("insert into goodsinfo(id,typeid,name,price,inv_num,latest_inv_date,img,valid) values(NULL,?,?,?,0,?,?,1)",
#                 (data['typeid'], data['name'], data['price'], int(time.time()), data['img']))

# # 折扣


# con.commit()

# content = []
# for i in range(30):
#     startTime = random.randint(day_start, day_start+10*24*3600)
#     endtime = startTime + random.randint(0, 6*24*3600)
#     data = {
#         "id":  i+1,
#         "percent": random.randint(50, 100)/100,
#         "startTime": startTime,
#         "endTime": endtime
#     }
#     name, price = con.execute(
#         "select name,price from goodsinfo where id == ?", (data["id"],)).fetchone()
#     con.execute(
#         "insert into discount(id,name,price,discountPrice,percent,startTime,endTime) values(?,?,?,?,?,?,?)",
#         (data["id"], name, price, int(data["percent"]*price), int(data["percent"]*100), data["startTime"], data["endTime"]))

# con.commit()
# # 记得上传
# # 类型
# for i in range(10):
#     uid = i+1
#     name = "种类"+str(uid)
#     con.execute("insert into types values(?,?)", (uid, name))


# for i in range(7, 100):
#     name = "会员"+str(i+1)
#     phone = str(random.randint(10000000000, 15000000000))
#     point = 0
#     con.execute("insert into members values(?,NULL,?,?,?)", (
#         name, int(time.time()), phone, point))

# con.commit()

# for j in range(10):
#     for i in range(100):
#         io = 1 * random.randint(100, 200)
#         con.execute("insert into inventory(id,date,inout,inv_after) values(?,?,?,NULL)",
#                     (i+1, day_start+i*24*3600, io))
# con.commit()
#
#
#  for j in range(10):
#     for i in range(100):
#         now = day_start + i*24*3600 + random.randint(1, 24*3600)
#         invoiceId = int(str(now)+str(random.randint(100, 999)))

#         data = {
#             "memberID": "",
#             "goodsString": ""
#         }
#         if random.randint(1, 100) > 70:
#             data["memberID"] = random.randint(1, 100)
#         for i in range(random.randint(3, 10)):
#             data["goodsString"] += (str(random.randint(1, 100)) +
#                                     "*" + str(random.randint(1, 5)) + ";")

#         data["goodsString"] = data["goodsString"][:-1]

#         for good in data["goodsString"].split(";"):
#             gid, count = good.split("*")
#             insertString = "insert into invoce(id,goodsid,count) values({},{},{})".format(
#                 invoiceId, gid, count)
#             con.execute(insertString)
#         con.commit()

#         if data["memberID"] != "":
#             insertString = "insert into member_expenses(invoce_id,member_id,gain_point) values({},{},{})".format(
#                 invoiceId, data["memberID"], int(random.randint(10, 100)))
#             con.execute(insertString)

#         insertString = "insert into sailRecord(id,date,invoiceId,machineId,amount) values({},{},{},{},{})".format(
#             invoiceId, now, invoiceId, 1, 0)
#         con.execute(insertString)
#         con.commit()

# start = int(time.time())
# count = 0
# for rec in con.execute("select * from sailRecord").fetchall():
#     # print(rec)
#     uid, date, iid, mid, amount = rec
#     print(date)
#     newtime = start + 605*count
#     count += 1
#     con.execute("update sailRecord set date = ? where id == ?", (newtime, uid))
# con.commit()

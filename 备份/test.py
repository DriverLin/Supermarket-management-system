import time
import sqlite3
import random
import json
con = sqlite3.connect(r"H:\数据库项目\store.db")

# for i in con.execute("select name,id,startTime from discount limit 10 offset 20").fetchall():

#     print({
#         "name": i[0],
#         "id": i[1],
#         "startTime": i[2]
#     })


for i in range(1, 100):
    base = 1607264122
    keeptime = random.randint(129600, 259200)
    offset = random.randint(24*3600*i, 48*3600*i) - 24*3600*20
    sqlstr = '''
    INSERT INTO discount (id,name,price,discountPrice,percent,startTime,endTime)
    VALUES ({},'{}',{},{},{},{},{});
    '''.format(i, "测试商品"+str(i),  random.randint(10, 999),  random.randint(10, 800),  random.randint(80, 99), base+offset, base+offset+keeptime)
    print(sqlstr)
    con.execute(sqlstr)
con.commit()

# for i in range(100):
#     name = "员工{}".format(i)
#     phone = random.randint(10000000000, 99999999999)
#     sallary = random.randint(1000, 20000)
#     pos = "职位{}".format(i % 10)
#     departmentid = random.randint(1, 6)
#     indate = random.randint(1544438429, 1607601968)
#     con.execute("insert into staff values(NULL,?,?,?,?,?,?)",
#                 (name, phone, sallary, pos, departmentid, indate))
# con.commit()


# print(con.execute("select * from staff where id = :id", {
#     "id": 1
# }).fetchall())

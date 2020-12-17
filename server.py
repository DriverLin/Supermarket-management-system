from bottle import *
import json
import base64
import os
import sqlite3
import string
import random
from types import prepare_class
import math
# %Y-%m-%d %H:%M:%S


def timestamp_to_str(formatstr, timestamp):
    return time.strftime(formatstr, time.localtime(timestamp))


def str_to_timestamp(formatstr, str):
    return int(time.mktime(time.strptime(str, formatstr)))


def get_now_dat_timestrp():
    nowDay = timestamp_to_str("%Y-%m-%d", time.time())+" 0:0:0"
    return str_to_timestamp("%Y-%m-%d %H:%M:%S", nowDay)


@route('/api/<path:path>', method='POST')
def server_post(path):
    if(path[0:6] == "upload"):
        filedata = request.files.get("file")
        filedata.save(os.path.join(r'.\upload', filedata.filename))
        return path
    else:
        data = request.body.read()
        return path


@route('/api/get/MemberManagement/getMemberData', method='GET')
def getMemberData():
    offset = int(request.query.page)
    res = {
        "total": math.ceil(con.execute("select count(*) from members").fetchone()[0]/10),
        "data": [
            {
                "name": rec[0],
                "id": rec[1],
                "signUpDate": timestamp_to_str("%Y-%m-%d %H:%M:%S", rec[2]),
                "phone": rec[3],
                "point": rec[4]
            } for rec in con.execute("select name,id,signUpDate,phone,point from members limit 10 offset ?", (offset*10,)).fetchall()
        ]

    }

    return json.dumps(res)


@route('/api/get/DayIncomeChart/getData', method='GET')
def DayIncomeChart_getData():
    now = int(time.time())
    result = []
    for i in range(24):
        timeRange = (now - (24-i) * 3600, now - (23-i) * 3600)
        result.append(con.execute(
            "select sum(amount) from sailRecord where date between ? and ? ", timeRange).fetchone()[0])
    return json.dumps(result)


@route('/api/get/CurrentIncomeChart/getData', method='GET')
def CurrentIncomeChart_getData():
    now = int(time.time())
    dateArrary = []
    countData = []
    for i in range(6):
        dayRange = (now - (6-i) * 600, now - (5-i) * 600)
        dateArrary.append(
            time.strftime("%H:%M", time.localtime(dayRange[0]))
            + "-"
            + time.strftime("%M", time.localtime(dayRange[1])))
        res = con.execute(
            "select sum(amount) from sailRecord where date between ? and ? ", dayRange).fetchone()[0]
        if res is None:
            countData.append(0)
        else:
            countData.append(res)

    return json.dumps(
        {
            "dateArrary": dateArrary,
            "countData": countData
        }
    )


@route('/api/get/RecentOrder/getData', method='GET')
def RecentOrder_getData():
    return json.dumps(
        [
            {
                "id": rec[0],
                "date":  timestamp_to_str("%Y-%m-%d %H:%M:%S", rec[1]),
                "invoiceId":  rec[2],
                "machineId":  rec[3],
                "amount":  rec[4]
            } for rec in con.execute("select id,date,invoiceId,machineId,amount from sailRecord limit 10 offset 0").fetchall()
        ]
    )


# 销售情况曲线表 种类划分 日期range对应的类型的销售量
@route('/api/get/goodInfo/getChart', method='GET')
def goodInfo_getChart():
    now = int(time.time())
    dateArrary = []
    for i in range(7):
        dateArrary.append(time.strftime(
            "%m/%d", time.localtime(now - (7-i) * 86400)))
    goodsArrary = []
    for tid, tname in con.execute("select id,name from types").fetchall():
        data = {
            "name": tname,
            "data": [
                con.execute("select count(*) from for_type_count where tid = ? and date between ? and ?",
                            (tid, now - (7-i) * 86400, now - (6-i) * 86400)).fetchone()[0]
                for i in range(7)
            ]
        }
        goodsArrary.append(data)
    return json.dumps({
        "dateArrary": dateArrary,
        "goodsArrary": goodsArrary
    })


@route('/api/get/Discount/getPreData', method='GET')
def Discount_getPreData():
    offset = int(request.query.page)
    res = {
        "total": math.ceil(con.execute("select count(*) from discount where startTime > ? ", (int(time.time()),)).fetchone()[0]/10),
        "data": [
            {
                "id": rec[0],
                "name": rec[1],
                "price": rec[2],
                "discountPrice": rec[3],
                "percent": rec[4],
                "startTime": timestamp_to_str("%Y/%m/%d-%H:%M:%S", rec[5]),
                "endTime": timestamp_to_str("%Y/%m/%d-%H:%M:%S", rec[6])
            } for rec in con.execute(
                "select id,name,price,discountPrice,percent,startTime,endTime from discount where startTime > ? limit 10 offset ?", (int(time.time()), offset*10)).fetchall()
        ]
    }

    return json.dumps(res)


@route('/api/get/Discount/getCurrentData', method='GET')
def Discount_getCurrentData():
    return json.dumps([
        {
            "id": rec[0],
            "name": rec[1],
            "price": rec[2],
            "discountPrice": rec[3],
            "percent": rec[4],
            "startTime": timestamp_to_str("%Y-%m-%d %H:%M:%S", rec[5]),
            "endTime": timestamp_to_str("%Y-%m-%d %H:%M:%S", rec[6])
        } for rec in con.execute(
            "select id,name,price,discountPrice,percent,startTime,endTime from discount where startTime < ? and endTime > ? limit 10", (int(time.time()), int(time.time()))).fetchall()
    ])


@route('/api/get/Discount/getHistoryData', method='GET')
def Discount_getHistoryData():
    offset = int(request.query.page)
    res = {
        "total": math.ceil(con.execute("select count(*) from discount where endTime < ? ", (int(time.time()),)).fetchone()[0]/10),
        "data": [
            {
                "id": rec[0],
                "name": rec[1],
                "price": rec[2],
                "discountPrice": rec[3],
                "percent": rec[4],
                "startTime": timestamp_to_str("%Y/%m/%d", rec[5]),
                "endTime": timestamp_to_str("%Y/%m/%d", rec[6])
            } for rec in con.execute(
                "select id,name,price,discountPrice,percent,startTime,endTime from discount where endTime < ? limit 10 offset ?", (int(time.time()), offset*10)).fetchall()
        ]
    }
    return json.dumps(res)


@route("/api/get/Inventory/getChart")
def Inventory_getChart():
    now = get_now_dat_timestrp()+86400  # 获取到的 是今天0点 加上一天 因为是减法取
    dateArrary = []
    inArrary = []
    outArrary = []
    incDataArrary = []
    for i in range(7):
        dayRange = (now - (7-i) * 86400, now - (6-i) * 86400)
        dateArrary.append(timestamp_to_str("%m/%d", dayRange[1]))
        inSum, outSum = 0, 0
        for rec in con.execute("select id,date,inout,inv_after from inventory where date between ? and ?", dayRange).fetchall():
            if rec[2] > 0:
                inSum += rec[2]
            else:
                outSum += rec[2]
        inArrary.append(inSum)
        outArrary.append(outSum)
        incDataArrary.append(inSum + outSum)
    return (
        json.dumps({
            "dateArrary": dateArrary,
            "incData": incDataArrary,
            "in": inArrary,
            "out": outArrary
        })
    )


@route('/api/get/Inventory/getInRecord', method='GET')
def Inventory_getInRecord():
    return json.dumps(
        [
            {
                "date": timestamp_to_str("%Y-%m-%d", rec[0]),
                "name": rec[1],
                "id": rec[2],
                "inNum": rec[3],
                "numBefore": rec[4],
                "numAfter": rec[5]
            }
            for rec in con.execute(
                "select date,name,id,inout,inv_before,inv_after from for_inventory_io where inout > 0 limit 10").fetchall()
        ]
    )


@route('/api/get/Inventory/getOutRecord', method='GET')
def Inventory_getOutRecord():
    return json.dumps(
        [
            {
                "date": timestamp_to_str("%Y-%m-%d", rec[0]),
                "name": rec[1],
                "id": rec[2],
                "outNum": rec[3]*-1,
                "numBefore": rec[4],
                "numAfter": rec[5]
            }
            for rec in con.execute(
                "select date,name,id,inout,inv_before,inv_after from for_inventory_io where inout < 0 limit 10").fetchall()
        ]
    )


@route('/api/get/Inventory/getInvStause', method='GET')
def Inventory_getInvStause():
    return json.dumps(
        [
            {
                "name": rec[0],
                "id": rec[1],
                "num": rec[2],
                "date": timestamp_to_str("%Y-%m-%d", rec[3])
            }
            for rec in con.execute(
                "select name,id,inv_num,latest_inv_date from goodsinfo order by latest_inv_date desc limit 10 offset 0").fetchall()
        ]
    )


@route('/api/get/StaffManagement/getAbsenteeismSheet', method='GET')
def StaffManagement_getAbsenteeismSheet():
    return json.dumps(
        [
            {
                "id": rec[0],
                "name": rec[1],
                "date": timestamp_to_str("%Y-%m-%d", rec[2]),
                "description": rec[3]
            }
            for rec in con.execute(
                "select id,name,date,description from absenteeism order by date desc limit 6;").fetchall()
        ]
    )


@route('/api/get/StaffManagement/getDepartment', methods='GET')
def StaffManagement_getDepartment():
    return json.dumps(
        [
            rec[0] for rec in con.execute("select name from department").fetchall()
        ]
    )


@route('/api/post/MemberManagement/addingMember', method="POST")
def MemberManagement_ddingMember():
    data = json.loads(request.body.read())
    con.execute("insert into members(name,id,signUpDate,phone,point) values(?,NULL,?,?,?)",
                (data["name"], int(time.time()), data["phone"], data["point"]))
    con.commit()
    return '["添加成功"]'


@route('/api/post/MemberManagement/getChange', method='POST')
def MemberManagement_getChange():
    data = json.loads(request.body.read())
    con.execute("update members set name=?,phone=? where id = ?",
                (data["name"], data["phone"], data["id"]))
    con.commit()
    return '["修改成功"]'


sailInfo_page_limit = 10
lastData = None
@route('/api/post/SailInfo/getTable', method='POST')
def SailInfo_getTable():
    global sailInfo_page_limit, lastData
    data = json.loads(request.body.read())
    if data["action"] == "select":
        sailInfo_page_limit = 10
        lastData = data
    elif data["action"] == "next":
        sailInfo_page_limit += 10
        data = lastData

    filterStr = "where 1==1 "
    if data["args"]["time"] != "":
        date = data["args"]["time"]
        date_0 = str_to_timestamp("%Y/%m/%d-%H:%M:%S", date+"-0:0:0")
        date_24 = date_0 + 86400
        filterStr += "and date between {} and {}".format(date_0, date_24)
    if data["args"]["id"] != "":
        filterStr += "and invoiceId=={}".format(data["args"]["id"])

    queryStr = "select id,date,invoiceId,machineId,amount from sailRecord {} limit {}".format(
        filterStr, sailInfo_page_limit)

    return json.dumps(
        [
            {
                "id": rec[0],
                "date":  timestamp_to_str("%Y-%m-%d %H:%M:%S", rec[1]),
                "invoiceId":  rec[2],
                "machineId":  rec[3],
                "amount":  rec[4]
            } for rec in con.execute(queryStr).fetchall()
        ]
    )


@route('/api/post/SailInfo/getInvoiceInfo', method='POST')
def SailInfo_getInvoiceInfo():
    data = json.loads(request.body.read())
    return json.dumps([
        {
            "name": rec[0],
            "id": rec[1],
            "number": rec[2],
            "amount": rec[3],
            "img": rec[4]
        } for rec in con.execute("select name,goodsid,count,amount,img from for_get_invoiceInfo where invoceid == ?",
                                 (data["invoiceId"],)).fetchall()
    ])


@route('/api/post/SailInfo/addRecord', method='POST')
def SailInfo_addRecord():
    try:
        now = int(time.time())
        invoiceId = int(str(now)+str(random.randint(100, 999)))
        data = json.loads(request.body.read())
        for good in data["goodsString"].split(";"):
            gid, count = good.split("*")
            insertString = "insert into invoce(id,goodsid,count) values({},{},{})".format(
                invoiceId, gid, count)
            con.execute(insertString)
        con.commit()

        if data["memberID"] != "":
            insertString = "insert into member_expenses(invoce_id,member_id,gain_point) values({},{},{})".format(
                invoiceId, data["memberID"], int(random.randint(10, 100)))
            con.execute(insertString)

        insertString = "insert into sailRecord(id,date,invoiceId,machineId,amount) values({},{},{},{},{})".format(
            invoiceId, now, invoiceId, 1, 0)
        con.execute(insertString)
        con.commit()

    except Exception as e:
        return '["{}"]'.format(e)
    return '["success"]'


@route('/api/post/goodInfo/getTable', method='POST')
def goodInfo_getTable():
    offset = int(json.loads(request.body.read())["page"])
    return json.dumps(
        {
            "total": math.ceil(con.execute("select count(*) from goodsinfo where valid == 1").fetchone()[0]/6),
            "data": [
                {
                    "goods": rec[0],
                    "imgSrc": rec[1],
                    "goodsId": rec[2],
                    "kind": rec[3],
                    "price": rec[4],
                    "inventory": rec[5]
                } for rec in con.execute("select name,img,id,typeid,price,inv_num from goodsinfo where valid == 1 limit 6 offset ?", (offset*6,)).fetchall()
            ]
        }
    )


@route('/api/post/ManageGoods/putDown', method='POST')
def ManageGoods_putDown():
    data = json.loads(request.body.read())
    ids = [(gid,) for gid in data.split('/')]
    con.executemany("update goodsinfo set valid = 0 where id = ?", ids)
    con.commit()
    res = []
    for gid in data.split('/'):
        rec = con.execute(
            "select id,name from goodsinfo where id = ?", (gid,)).fetchone()
        res.append({
            "id": rec[0],
            "stause": "下架成功 √",
            "name": rec[1]
        })
    return json.dumps(res)


@route('/api/upload/ManageGoods/putUp', method='POST')
def ManageGoods_putUp():
    filedata = request.files.get("file")
    filePath = os.path.join(r'./upload', filedata.filename)
    filedata.save(filePath)
    content = []
    try:
        content = json.loads(open(filePath, 'r', encoding='utf-8').read())
    except Exception as e:
        print(e)
    os.remove(filePath)
    result = []
    for data in content:
        try:
            con.execute("insert into goodsinfo(id,typeid,name,price,inv_num,latest_inv_date,img,valid) values(NULL,?,?,?,0,?,?,1)",
                        (data['typeid'], data['name'], data['price'], int(time.time()), data['img']))

            result.append(
                {
                    "id": data['typeid'],
                    "stause": "成功",
                    "name": data['name']
                }
            )
        except Exception as e:
            result.append(
                {
                    "id": -1,
                    "stause": str(e),
                    "name": data['name']
                }
            )
    con.commit()
    return json.dumps(result)


@route('/api/upload/ManageGoods/getChange', method='POST')
def ManageGoods_putUp():
    filedata = request.files.get("file")
    filePath = os.path.join(r'./upload', filedata.filename)
    filedata.save(filePath)
    content = []
    try:
        content = json.loads(open(filePath, 'r', encoding='utf-8').read())
    except Exception as e:
        print(e)
    os.remove(filePath)
    result = []
    for data in content:
        name = con.execute(
            "select name from goodsinfo where id == ?", (data["id"],)).fetchone()[0]
        try:
            if "price" in data:
                con.execute("update goodsinfo set price=? where id==?",
                            (data['price'], data["id"]))
            if "img" in data:
                con.execute("update goodsinfo set img=? where id==?",
                            (data['img'], data["id"]))
            result.append(
                {
                    "id": data['id'],
                    "stause": "成功",
                    "name": name
                }
            )
        except Exception as e:
            result.append(
                {
                    "id": -1,
                    "stause": str(e),
                    "name": name
                }
            )
    con.commit()
    return json.dumps(result)


@route("/api/post/Discount/getInventory", method='POST')  # 折扣 ID=商品ID 是记录类型
def Discount_getInventory():
    data = json.loads(request.body.read())
    result = {}
    for gid in data:
        try:
            result[gid] = con.execute(
                "select inv_num from goodsinfo where id==?", (gid,)).fetchone()[0]
        except Exception:
            result[gid] = -1
    return json.dumps(result)


@route("/api/post/Discount/delDiscount", method="POST")
def Discount_delDiscount():
    data = json.loads(request.body.read())

    con.execute("delete from discount where id == ? and name == ? and startTime== ? and endTime == ?",
                (data['id'], data['name'],
                 str_to_timestamp("%Y/%m/%d-%H:%M:%S", data['startTime']),
                 str_to_timestamp("%Y/%m/%d-%H:%M:%S", data['endTime'])
                 ))
    con.commit()
    return '["成功"]'


@route("/api/upload/Discount/addDiscount", method='POST')
def Discount_addDiscount():
    filedata = request.files.get("file")
    filePath = os.path.join(r'./upload', filedata.filename)
    filedata.save(filePath)
    content = []
    try:
        content = json.loads(open(filePath, 'r', encoding='utf-8').read())
    except Exception as e:
        print(e)
    os.remove(filePath)
    result = []
    # 需要 id percent starttime endtime
    for data in content:
        try:
            name, price = con.execute(
                "select name,price from goodsinfo where id == ?", (data["id"],)).fetchone()
            con.execute(
                "insert into discount(id,name,price,discountPrice,percent,startTime,endTime) values(?,?,?,?,?,?,?)",
                (data["id"], name, price, int(data["percent"]*price), int(data["percent"]*100), data["startTime"], data["endTime"]))
            result.append(
                {
                    "id": data["id"],
                    "name": name,
                    "percent": data["percent"],
                    "startTime":  data["startTime"],
                    "stause": "添加成功"
                }
            )
        except Exception as e:
            result.append(
                {
                    "id": data["id"],
                    "name": data["id"],
                    "percent": data["percent"],
                    "startTime":  data["startTime"],
                    "stause": str(e)
                }
            )
    con.commit()
    return json.dumps(result)


@route("/api/post/MemberManagement/getMemberRecords", method='POST')
def MemberManagement_getMemberRecords():
    data = json.loads(request.body.read())
    return json.dumps(
        [
            {
                "id": rec[0],
                "money": rec[1],
                "point": rec[2],
                "date": timestamp_to_str("%Y-%m-%d", rec[3])
            } for rec in con.execute(
                "select invoce_id,total,gain_point,date from for_member_member_expenses_record where member_id == ?", (data["memberID"],)).fetchall()
        ]
    )

# %Y-%m-%d %H:%M:%S
@route("/api/post/StaffManagement/getAttendanceSheet", method='POST')
def staffManagement_getAttendanceSheet():
    data = str_to_timestamp("%Y-%m-%dT%H:%M:%S",
                            request.body.read().decode("utf-8")[1:-6])
    date_ymd = timestamp_to_str("%Y-%m-%d", data)+" 0:0:0"
    date_0 = str_to_timestamp("%Y-%m-%d %H:%M:%S", date_ymd)
    date_24 = date_0 + 86400

    def format_iodate(timestamp):
        if timestamp == None:
            return "--"
        else:
            return timestamp_to_str("%H:%M", timestamp)
    return json.dumps(
        [
            {
                "id": rec[0],
                "name": rec[1],
                "checkIn": format_iodate(rec[2]),
                "checkOut": format_iodate(rec[3]),
                "description": rec[4]
            }
            for rec in con.execute(
                "select id,name,checkIn,checkOut,description from absenteeism where (checkIn between ? and ?) or (checkOut between ? and ?);", (date_0, date_24, date_0, date_24)).fetchall()
        ]
    )


@route("/api/post/StaffManagement/getStaffByDepartment", method='POST')
def StaffManagement_getStaffByDepartment():
    Department_name = request.body.read().decode('utf-8')[1:-1]

    return json.dumps(
        [
            {
                "id": rec[0],
                "name": rec[1],
                "phone":  rec[2],
                "sallary": rec[3],
                "position": rec[4],
                "department": rec[5],
                "entrydate": timestamp_to_str("%Y-%m-%d", rec[6])
            }
            for rec in con.execute(
                "select staff.id,staff.name,staff.phone,staff.sallary,staff.position,department.name as dname,staff.entrydate from staff,department where dname == ? and department_id == department.id ", (Department_name,)).fetchall()
        ]
    )


@route("/api/post/StaffManagement/getChange", method='POST')
def StaffManagement_getChange():
    data = json.loads(request.body.read())
    data["department_id"] = con.execute(
        "select id from department where name=?", (data["department"],)).fetchone()[0]
    try:
        con.execute("update staff set name = :name , phone = :phone ,sallary = :sallary ,position = :position,department_id = :department_id where id = :id", data)
        con.commit()
    except Exception as e:
        return '["{}"]'.format(str(e))
    return '["success"]'


@route("/api/post/StaffManagement/addStaff", method='POST')
def StaffManagement_getChange():
    data = json.loads(request.body.read())
    data["department_id"] = con.execute(
        "select id from department where name=?", (data["department"],)).fetchone()[0]
    try:
        con.execute(
            "insert into staff(name,phone,sallary,position,department_id)  values(:name,:phone,:sallary,:position,:department_id)", data)
        con.commit()
    except Exception as e:
        return '["{}"]'.format(str(e))
    return '["success"]'


@route("/api/post/Inventory/addRecord", method='POST')
def StaffManagement_getChange():
    data = json.loads(request.body.read())
    try:
        date = data['date']
        if date == "":
            date = int(time.time())
        gid = data['id']
        count = data['count']
        con.execute(
            "insert into inventory(id,date,inout,inv_after) values(?,?,?,NULL)", (gid, date, count))
        con.commit()
    except Exception as e:
        return '["{}"]'.format(str(e))
    return '["success"]'


@route('/<path>', method='GET')
def getSouce(path):
    return static_file(path, root=r'./static')


@route('/', method='GET')
def getSouce():
    return static_file("index.html", root=r'./static')


# con = sqlite3.connect(r"./备份\满表备份.db")

con = sqlite3.connect(r"./store.db")
run(host="0.0.0.0", port=8080, reloader=False)  # reloader设置为True可以在更新代码时自动重载

#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os
import base64
import json
from bottle import *


@route('/api/<path:path>', method='POST')
def server_post(path):
    if(path[0:6] == "upload"):

        filedata = request.files.get("file")
        filedata.save(os.path.join(r'.\upload', filedata.filename))
        content = json.loads(os.path.join(r'.\upload', filedata.filename))
        os.remove(os.path.join(r'.\upload', filedata.filename))
        return getBody('POST', "shoule receive from file", "/"+path)
    else:
        data = request.body.read()
        return getBody('POST', data.decode("utf-8"), "/"+path)


@route('/api/<path:path>', method='GET')
def server_get(path):
    return getBody('GET', "", "/"+path)


@route('/<path>', method='GET')
def getSouce(path):
    return static_file(path, root='./html/')


def getBody(method, body, path):
    print("=========================================")
    print("mathod:", method)
    print("path:", path)
    print("body:", body)
    with open(r".\mapdata.json", 'rb') as f:
        dataMap = json.load(f)
        if (dataMap.get(method).get(path) != None):
            print("responseBody:", dataMap.get(method).get(path))
            print("=========================================")
            return json.dumps(dataMap.get(method).get(path))
    print("responseBody:", '["error"]')
    print("=========================================")
    return '["error"]'


run(port=8080, reloader=False)  # reloader设置为True可以在更新代码时自动重载

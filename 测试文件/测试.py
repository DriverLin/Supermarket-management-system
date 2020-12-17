import os
import json

path = r"H:\数据库项目\测试文件\putUp.json"
# res = open(path, 'r', encoding='utf-8').read()
res = json.loads(open(path, 'r', encoding='utf-8').read())
print(res)

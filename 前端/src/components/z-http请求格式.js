fetch('http://localhost:8086/postApi', {
    method: 'POST',
    credentials: "include",
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(dataPack),
    mode: 'cors',
    cache: 'no-store'
}).then(response => response.json())
    .then(data => (data))
    .catch(err => console.log(err))



fetch('./api/get/MemberManagement/getMemberData', {
    method: 'GET',
    credentials: "include",
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    mode: 'cors',
    cache: 'no-store'
}).then(response => response.json())
    .then(data => (data))
    .catch(err => console.log(err))


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
    .then(data => (data))
    .catch(err => console.log(err))
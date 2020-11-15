const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname, 'data.txt')
// 读取文件内容
fs.readFile(fileName, (err, data) => {
    if(err) {
        console.log(err);
        return
    }
    // data是二进制类型， 需要转换为字符串
    console.log(data.toString())
})

// 写入文件

const content = '这是新写入的内容\n'
const opt = {
    flags: 'a'  // 追加写入的方式， 追加用'a', 覆盖用'w'
}

fs.writeFile(fileName, content, opt, (err) => {
    if(err) {
        console.log(err)
    }
})


// 问题： 写入和读取的时候很耗费内存，每一次都要打开文件写入读取，
// 如果写入或者读取的内容特别大的话，将会是灾难性的后果

// 判断文件是否存在
fs.exists(fileName, (exist) => {
    console.log(exist, 'exist');
})





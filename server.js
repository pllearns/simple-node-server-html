const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

// set the files we want to serve

const mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
}

http.createServer((req, res) => {
  var uri = url.parse(req.url).pathname
  var fileName = path.join(process.cwd(), uri)
  console.log('Loading' + uri)
  var stats

  try {
    stats = fs.lstatSync(fileName)
  } catch (e) {
    res.writeHead(404, {'content-type': 'text/plain'})
    res.write('404 not found')
    res.end()
    return
  }

  if (stats.isFile()){
    var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]
    res.writeHead(200, {'content-type': mimeType})

    var fileStream = fs.createReadStream(fileName)
    fileStream.pipe(res)
  } else if(stats.isDirectory) {
    res.writeHead(302, {
      'Location': 'index.html'
    })
    res.end()
  } else {
    res.writeHead(500, {'Content-Type': 'text.plain'})
    res.write('500 Internal Error\n')
    res.end()
  }
}).listen(3000)
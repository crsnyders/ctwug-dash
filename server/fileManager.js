var fs = require('fs');

var FileManager = module.exports = function() {
};

FileManager.prototype.list_files = function(path) {
  return new Promise((resolve, reject) => {
    try {
      let files = fs.readdirSync(path);
      let items = [];
      for (var i = 0; i < files.length; i++) {
        let file = path + '/' + files[i];
        let fileStat = fs.statSync(file);
        items.push({
          name: files[i],
          path: file,
          size: fileStat["size"],
          date_modified: fileStat["mtime"],
          date_created: fileStat["birthtime"],
          is_dir: fileStat.isDirectory(),
          is_file: fileStat.isFile()
        })
      }
      resolve(items);
    } catch (error) {
      reject(error);
    }
  })
};

FileManager.prototype.move_file = function (target, destination) {
  return new Promise((resolve, reject)=>{
    fs.rename(target,destination,(err, out)=>{
        if(err){
          reject(err);
        }else{
          resolve(out)
        }
    })
  })
};

FileManager.prototype.rename_file = function (target, destination) {
  return this.move_file(target,destination);
};


FileManager.prototype.make_dir = function (target) {
  return new Promise((resolve, reject)=>{
    fs.mkdir(target,(err, out)=>{
        if(err){
          reject(err);
        }else{
          resolve(out)
        }
    })
  })
};

FileManager.prototype.remove_file = function (target) {
  return new Promise((resolve, reject)=>{
    fs.unlink(target,(err, out)=>{
        if(err){
          reject(err);
        }else{
          resolve(out)
        }
    })
  })
};

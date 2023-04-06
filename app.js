var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const {body,validationReult, Result} = require('express-validator')
require('dotenv').config()
app.use(cors())
const mysql = require('mysql2');
const { Router } = require('express')
const connection = mysql.createConnection(
/*  {
    host: 'localhost',
    user: 'root',
    database: 'clinic',
    password: ''
   }*/
  
process.env.DATABASE_URL
  );
  
//สมัครสมาชิก
app.post('/register',jsonParser, function (req, res, next) {
connection.execute(
  'INSERT INTO member(firstname_member,lastname_member,tell_member,username_member,password_member) VALUES (?,?,?,?,?)',
  [req.body.firstname_member,req.body.lastname_member,req.body.tell_member,req.body.username_member,req.body.password_member],
  function(err,username_member, fields) {
    if(err){
        res.json({status:'error', message:err})
        return
    } 
    res.json({status:'Ok'})
  }
);
 
})


//เเสดงข้อมูล user
/*app.get('/getuser/:id',(req,res)=>{
  console.log(req.params.id_member)
  try{
    if(req.params.id_member){
      connection.execute('SELECT * FROM member where username_member=?',[
        req.params.id_member],
        (err,member,fil)=>{
          if(member&&member[0]){
            console.log(member)
            for(let i=0;i<member.length;i++){

              if( member[i]["username_member"] == req.params.id_member){
                  return res.status(200).json({
                  RespCode:200,
                  ResMessage:"สำเร็จ",
                  Result:member[i]
                })
              }
            }
  
          } 
          else{
            console.log("ไม่พบข้อมูล")
            return res.status(200).json({
              RespCode:200,
              ResMessage:"ไม่สำเร็จ",
              Log:1
            })  
          }
        })
   
  }else{
    console.log("ไม่พบข้อมูล2")
    return res.status(200).json({
      RespCode:200,
      ResMessage:"ไม่สำเร็จ",
      Log:2
    }) 
  } 
}
  catch(error){
    console.log("0",error)
    return res.status(200).json({
      RespCode:200,
      ResMessage:"ไม่",
      Log:0
    })
  }
  })*/

  //เข้าสู่ระบบสมาชิก
app.post('/login',jsonParser, function (req, res, next) {
  
  try{
    console.log(req.body.username_member)
    console.log(req.body.password_member)
    connection.execute(
      'SELECT * FROM member WHERE username_member =? ',
      [req.body.username_member],
      function(err,member, fields) {
        if(err){
          res.json({status:'error', message:err, username_member:null})
          return
        }
        for(let i = 0 ; i <  member.length ; i ++){
          console.log(member[i]["username_member"])
          if( member[i]["username_member"] == req.body.username_member &&  member[i]["password_member"] == req.body.password_member){
            res.json({username_member:member[i]})
            return;
          }
        }
        res.json({ message:"ไม่สำเร็จ", username_member:req.body.username_member})
      } 
    );

   
  }catch(err){
    res.json({status:'error', message:"อิอิ", username_member:null})
  }
    }   
    )

    //แก้ไขข้อมูลส่วนตัว
    app.put('/editmember',jsonParser,function(req,res,next){
      connection.execute(
        'UPDATE member  SET firstname_member = ?,lastname_member = ?,tell_member= ?,username_member = ?,	password_member = ? WHERE id_member = ?',
        [req.body.firstname_member,req.body.lastname_member,req.body.tell_member,req.body.username_member,req.body.password_member,req.body.id_member],
        function(err,result){
          res.json(result);
        }       
        )
    
    })

    
  //แสดงข้อมูลผู้ใช้งาน
 app.get('/getmember',(req,res)=>{
  connection.execute(
    'SELECT * FROM member',(error,result,fields)=>{
      if(error)throw error;

      let message=""
      if(result === undefined || result.length==0){
        message = "no";
      }else{
        message = "สำเร็จ";
      }console.log(result)
      return res.json({error:false,data:result,message:message});

    }
  )
 }) 


    //เพิ่มข้อมูลคลินิกของผู้ใช้งาน
  app.post('/creatclinicuser',jsonParser, function (req, res, next) {
    connection.execute(
      "INSERT INTO clinicsawaiting (name_waiting,address_waiting,tell_waiting,type_waiting,vehicle_waiting,time_waiting,latitude_waiting,longitude_waiting,detail_waiting,img_waiting) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [req.body.name_waiting,req.body.address_waiting,req.body.tell_waiting,req.body.type_waiting ,req.body.vehicle_waiting,req.body.time_waiting,req.body.latitude_waiting,req.body.longitude_waiting,req.body.detail_waiting ,req.body.img_waiting],
      //,image,time,detail,star,comment,vehicle,longtigude
      //,req.body.time,req.body.detail,req.body.star,req.body.comment,req.body.vehicle,req.body.longitude],
      function(err,username, fields) {
        if(err){
            res.json({status:'error', message:err})
            return
        } 
        res.json({message:"สำเร็จ", latitude_waiting:req.body.latitude_waiting})
      }
    );
     
    })

  /*app.post('edit/register',jsonParser, function (req, res, next) {
      connection.execute(
        'UPDATE member (firstname,lastname,tell,username,password) VALUES (?,?,?,?,?)',
        [req.body.firstname,req.body.lastname,req.body.tell,req.body.username,req.body.password],
        function(err,username, fields) {
          if(err){
              res.json({status:'error', message:err})
              return
          } 
          res.json({status:'Ok'})
        }
      );
       
      })*/

  //เพิ่มข้อมูลคลินิก
  app.post('/creatclinic',jsonParser, async function (req, res, next) {
    console.log(req.body.name_clinics)
    //var a = false;
    var b ;
   
    try{

 
      /*
          for(let i =0 ; i<result.length ; i++){
          //console.log(result[i]["name_clinics"])
      
        if(result[i]["name_clinics"] == req.body.name_clinics){
          return true
          //console.log(หกด)
          //res.json({status:'error', message:"ชื่อซ้ำ"})
        }
      */ 
        let data1 
        const setData = (data)=>{
          let a = false
          data1 = data
          for(let i =0 ; i<data.length ; i++){
            //console.log(result[i]["name_clinics"])
        
          if(data[i]["name_clinics"] == req.body.name_clinics){
            a =true
          
          
        }
      }
      console.log(a)
      if(a ==true){
        res.send("ชื่อซ้ำ")
        return
      }
      connection.execute(
        "INSERT INTO clinics (name_clinics,address_clinics,tell_clinics,img_clinics,time_clinics,type_clinics,detail_clinics,vehicle_clinics,latitude_clinics,longitude_clinics,search_clinics) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [req.body.name_clinics,req.body.address_clinics,req.body.tell_clinics,req.body.img_clinics,req.body.time_clinics,req.body.type_clinics,req.body.detail_clinics,req.body.vehicle_clinics,req.body.latitude_clinics,req.body.longitude_clinics,req.body.search_clinics],
        //,image,time,detail,star,comment,vehicle,longtigude
        //,req.body.time,req.body.detail,req.body.star,req.body.comment,req.body.vehicle,req.body.longitude],
        function(err,username, fields) {
          if(err){
              res.json({status:'error', message:err})
              return
          } 
          res.json({status:'Ok'})
        }
      );

    }

let query = 'SELECT * FROM clinics ORDER BY id_clinics DESC';
 connection.query(query , async function(err, results, fields) {
//console.log(results)
await setData(results)
})

console.log("หดกเ")
     
      }catch(err){
        console.log("ๅๅ")
        res.json({status:'error', message:"ชื่อซ้ำ"})
        return;
      }
        })

  //แสดงข้อมูลคลินิก
 app.get('/getclinic',(req,res)=>{
  connection.execute(
    'SELECT * FROM clinics ORDER BY id_clinics DESC',(error,result,fields)=>{
      if(error)throw error;

      let message=""
      if(result === undefined || result.length==0){
        message = "no";
      }else{
        message = "สำเร็จ";
      }
      //console.log(result)
      return res.json({error:false,data:result,message:message});

    }
  )
 })    
 //แก้ไข้ข้อมูลคลินิก
app.put('/editclinic',jsonParser,function(req,res,next){

console.log(req.body)
    connection.execute(
      'UPDATE clinics SET name_clinics = ?,address_clinics= ?,tell_clinics= ?,img_clinics= ?,time_clinics= ?,type_clinics= ?,detail_clinics= ?,vehicle_clinics= ?,latitude_clinics= ?,longitude_clinics= ? ,search_clinics = ? WHERE id_clinics = ?',
      [req.body.name_clinics,req.body.address_clinics,req.body.tell_clinics,req.body.img_clinics,req.body.time_clinics,req.body.type_clinics,req.body.detail_clinics,req.body.vehicle_clinics,req.body.latitude_clinics,req.body.longitude_clinics,req.body.search_clinics,req.body.id_clinics],
      function(err,result){
        res.json(result);
      }       
      )
 
})

//แก้ไขข้อมูลคลินิกที่รออนุมัติ
app.put('/editclinicawaiting',jsonParser,function(req,res,next){
  
  connection.execute(
    'UPDATE clinicsawaiting SET name_waiting = ?,address_waiting = ?,tell_waiting = ?,type_waiting = ?,vehicle_waiting = ?,time_waiting = ?,latitude_waiting = ?,longitude_waiting = ?,detail_waiting =?,img_waiting =? WHERE id_waiting = ?',
    [req.body.name_waiting,req.body.address_waiting,req.body.tell_waiting,req.body.type_waiting ,req.body.time_waiting,req.body.vehicle_waiting,req.body.latitude_waiting,req.body.longitude_waiting,req.body.detail_waiting ,req.bodyimg_waiting,req.body.id_waiting],
    function(err,result){
      res.json(result);
    }       
    )

})

//ลบคลินิก
app.delete('/deleteclinic',jsonParser,function (req,res,next){
  connection.execute(
    'DELETE FROM clinics WHERE id_clinics = ?',
    [req.body.id_clinics],
    function(err,result){
      res.json(result);
    }       
  )
})


 //เข้าสู่ระบบผู้ดูเเลระบบ
 app.post('/loginadmin',jsonParser, function (req, res, next) {
  try{
    connection.execute(
      'SELECT * FROM admin WHERE user_admin =? ',
      [req.body.user_admin],
      function(err, user_admin, fields) {
        if(err){
          res.json({status:'error', message:err, user_admin:null})
          return
        }
        for(let i = 0 ; i < user_admin.length ; i ++){
          console.log(user_admin[i]["user_admin"])
          if(  user_admin[i]["user_admin"] == req.body.user_admin &&  user_admin[i]["password_admin"] == req.body.password_admin){
            res.json({user_admin:req.body.user_admin})
            return;
          }
        }
        res.json({status:'error', message:"กดเ", user_admin:null})
      } 
    );

   
  }catch(err){
    res.json({status:'error', message:"กดเ", user_admin:null})
  }
    }   
    )

   //ลบคลินิกที่รออนุมัติ
    app.delete('/deleteclinicsawaiting',jsonParser,function (req,res,next){
      connection.execute(
        'DELETE FROM clinicsawaiting WHERE id_waiting = ?',
        [req.body.id_waiting],
        function(err,result){
          res.json(result);
        }       
      )
    })


  //แสดงข้อมูลคลินิกที่รออนุมัติ
  app.get('/getclinicsawaiting',(req,res)=>{


      connection.execute(
        'SELECT * FROM clinicsawaiting  ORDER BY id_waiting DESC',(error,result,fields)=>{
          if(error)throw error;
    
          let message=""
          if(result === undefined || result.length==0){
            message = "no";
          }else{
            message = "สำเร็จ";
          }console.log(result)
          return res.json({error:false,data:result,message:message});
    
        }
      )
     })  

     


const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, __dirname + '/images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const test = (function (req,res,next){
  if (req.file === 'undefined' || req.file === null) {
    return res.status(422).send('image is empty');
  }
  let file = req.file;
res.send({urlImage:`http://192.168.20.148:3333/images/${file.filename}`})
})
uploadImage = multer({ storage: storage });
  //อัพรูป
  app.post('/uploadImage', uploadImage.single('image1'),test );

  app.use('/images', express.static('./images'));
/*
const uploadImageCat = (req, res, next) => {
  if (req.file === 'undefined' || req.file === null) {
    return res.status(422).send('image is empty');
  }
  let file = req.file;
  //console.log(file);
  //console.log(req.body);
  return res
    .status(201)
    .send({ name: `http://192.168.20.239:3030/images/${file.filename}` });
};
*/
const http = require('http');
const util = require('util');

// https://github.com/node-formidable/node-formidable
const formidable = require('formidable');

//https://www.npmjs.com/package/dotenv
const cloudinary = require("cloudinary");
require('dotenv').config()


cloudinary.config({
    cloud_name: "dqvq5bo0u",
    api_key: "448124316576359",
    api_secret: "vpXqcJQ0dUIPIqCYGQKqWXSMHCk"
});

//Create a server
http.createServer((req, res) => {
    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
  
        // parse a file upload
       const form = formidable();

        form.parse(req, (err, fields, files) => {
          //console.log(files)

            //https://cloudinary.com/documentation/upload_images
            cloudinary.uploader.upload(files.files.filepath, result => {

                //console.log(result)
                res.end(util.inspect(result.url));
                return;
                if (result.public_id) {
                    res.writeHead(200, { 'content-type': 'text/plain' });
                    res.write('received upload:\n\n');
                    res.end(util.inspect({ fields: fields, files: files }));
                }
            }
            );
        });
        return;
    }

    // show a file upload form
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input type="text" name="title" /><br/>
      <input type="file" name="upload" multiple="multiple" /><br/>
      <input type="submit" value="Upload" />
    </form>
  `);

}).listen(5000);
 //แสดงคอมเม้น
app.get('/getcomments',(req,res)=>{
  connection.execute(
    'SELECT * FROM comments  ORDER BY id_comment DESC',(error,result,fields)=>{
      if(error)throw error;

      let message=""
      if(result === undefined || result.length==0){
        message = "no";
      }else{
        message = "สำเร็จ";
      }
      
      //console.log(result)
      return res.json({error:false,data:result,message:message});

    }
  )
 }) 
//เพิ่มคอมเม้น
 app.post('/addcomments',jsonParser, function (req, res, next) {
  console.log(req.body)
  connection.execute(
    "INSERT INTO comments (id_clinics,star_comment,detail_comment,id_member) VALUES (?,?,?,?)",
    [req.body.id_clinics,req.body.star_comment,req.body.detail_comment,req.body.id_member],
    //,image,time,detail,star,comment,vehicle,longtigude
    //,req.body.time,req.body.detail,req.body.star,req.body.comment,req.body.vehicle,req.body.longitude],
    function(err,username, fields) {
      if(err){
        console.log(err.message)
          res.json({status:'error', message:err})
          return
      } 
      console.log("ok")
      res.json({status:'Ok'})
    }
  );
   
  })

//เพิ่มนัดหมาย
app.post('/addappoint',jsonParser, function (req, res, next) {
  connection.execute(
    "INSERT INTO appoint (date_appoint,	detail_appoint,id_member,	name_clinics) VALUES (?,?,?,?)",
    [req.body.date_appoint,req.body.detail_appoint,req.body.id_member,req.body.name_clinics],
    //,image,time,detail,star,comment,vehicle,longtigude
    //,req.body.time,req.body.detail,req.body.star,req.body.comment,req.body.vehicle,req.body.longitude],
    function(err,username, fields) {
      if(err){
        console.log(err.message)
          res.json({status:'error', message:err})
          return
      } 
      res.json({status:'Ok'})
    }
  );});

  //แสดงวันนัดหมาย
  app.get('/getappoint',(req,res)=>{
    connection.execute(
      'SELECT * FROM appoint  ORDER BY id_appoint DESC',(error,result,fields)=>{
        if(error)throw error;
  
        let message=""
        if(result === undefined || result.length==0){
          message = "no";
        }else{
          message = "สำเร็จ";
        }console.log(result)
        return res.json({error:false,data:result,message:message});
  
      }
    )
   }) 
   //ลบวันนัดหมาย
   app.delete('/deleteapppoint',jsonParser,function (req,res,next){
    connection.execute(
      'DELETE FROM appoint WHERE id_appoint = ?',
      [req.body.id_appoint],
      function(err,result){
        res.json(result);
      }       
    )
  })

  //แก้ไข้ warn
  app.put('/editwarn',jsonParser,function(req,res,next){
 console.log(req.body.read_warn)
 console.log("ๅๅๅ")
    connection.execute(
      'UPDATE warn SET read_warn = ? WHERE id_warn = ? ',
      [req.body.read_warn,1],
      function(err,result){
        if(err){
          res.json(err);
        }
        console.log(err)
        res.json(result);
      }       
      )
  
  })
//แสดง warn
  app.get('/getwarn',(req,res)=>{
    connection.execute(
      'SELECT * FROM warn',(error,result,fields)=>{
        if(error){
          return res.json({error:error});
        }
  
        let message=""
        if(result === undefined || result.length==0){
          message = "no";
        }else{
          message = "สำเร็จ";
        }
        
        //console.log(result)
        return res.json({error:false,data:result,message:message});
  
      }
    )
   }) 
   app.get('/getview',(req,res)=>{
    connection.execute(
      'SELECT * FROM view',(error,result,fields)=>{
        if(error){
          return res.json({error:error});
        }
  
        let message=""
        if(result === undefined || result.length==0){
          message = "no";
        }else{
          message = "สำเร็จ";
        }
        
        //console.log(result)
        return res.json({error:false,data:result,message:message});
  
      }
    )
   })
  
    app.put('/editview',jsonParser,function(req,res,next){
      console.log(req.body)
      console.log("ๅๅๅ")
      connection.execute(
        'UPDATE clinics SET view_clinics = ? WHERE id_clinics = ? ',
        [Number(req.body.view_clinics),req.body.id_clinics],
        function(err,result){
          if(err){
            console.log(err)
            res.json(err);
          }
          console.log(result)
          res.json(result);
        }  )     
       
       
       })

app.listen(3333, jsonParser, function () {
  console.log('CORS-enabled web server listening on port 3333')
})


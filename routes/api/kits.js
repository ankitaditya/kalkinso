const AWS = require('aws-sdk');
const express = require('express');
const { body, validationResult } = require('express-validator');
const config = require('config');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const Task = require('../../models/Tasks');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const fs = require('fs');
const formidable = require('formidable');
const ipAuth = require('../../middleware/ipAuth');
const upload = multer({ dest: 'temp/upload/' });
const Kits = require('../../models/Kits');

const router = express.Router();
const s3 = new AWS.S3();
const sampleBody = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <script src="https://kit.fontawesome.com/b99e675b6e.js"></script> \n  <style>\n    @import url("https://fonts.googleapis.com/css?family=Montserrat:400,500,700&display=swap");\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  list-style: none;\n  font-family: "Montserrat", sans-serif;\n}\n\nbody {\n  background: #585c68;\n  font-size: 14px;\n  line-height: 22px;\n  color: #555555;\n}\n\n.bold {\n  font-weight: 700;\n  font-size: 20px;\n  text-transform: uppercase;\n}\n\n.semi-bold {\n  font-weight: 500;\n  font-size: 16px;\n}\n\n.resume {\n  width: 800px;\n  height: auto;\n  display: flex;\n  margin: 50px auto;\n}\n\n.resume .resume_left {\n  width: 280px;\n  background: #0bb5f4;\n}\n\n.resume .resume_left .resume_profile {\n  width: 100%;\n  height: 280px;\n}\n\n.resume .resume_left .resume_profile img {\n  width: 100%;\n  height: 100%;\n}\n\n.resume .resume_left .resume_content {\n  padding: 0 25px;\n}\n\n.resume .title {\n  margin-bottom: 20px;\n}\n\n.resume .resume_left .bold {\n  color: #fff;\n}\n\n.resume .resume_left .regular {\n  color: #b1eaff;\n}\n\n.resume .resume_item {\n  padding: 25px 0;\n  border-bottom: 2px solid #b1eaff;\n}\n\n.resume .resume_left .resume_item:last-child,\n.resume .resume_right .resume_item:last-child {\n  border-bottom: 0px;\n}\n\n.resume .resume_left ul li {\n  display: flex;\n  margin-bottom: 10px;\n  align-items: center;\n}\n\n.resume .resume_left ul li:last-child {\n  margin-bottom: 0;\n}\n\n.resume .resume_left ul li .icon {\n  width: 35px;\n  height: 35px;\n  background: #fff;\n  color: #0bb5f4;\n  border-radius: 50%;\n  margin-right: 15px;\n  font-size: 16px;\n  position: relative;\n}\n\n.resume .icon i,\n.resume .resume_right .resume_hobby ul li i {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.resume .resume_left ul li .data {\n  color: #b1eaff;\n}\n\n.resume .resume_left .resume_skills ul li {\n  display: flex;\n  margin-bottom: 10px;\n  color: #b1eaff;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.resume .resume_left .resume_skills ul li .skill_name {\n  width: 25%;\n}\n\n.resume .resume_left .resume_skills ul li .skill_progress {\n  width: 60%;\n  margin: 0 5px;\n  height: 5px;\n  background: #009fd9;\n  position: relative;\n}\n\n.resume .resume_left .resume_skills ul li .skill_per {\n  width: 15%;\n}\n\n.resume .resume_left .resume_skills ul li .skill_progress span {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background: #fff;\n}\n\n.resume .resume_left .resume_social .semi-bold {\n  color: #fff;\n  margin-bottom: 3px;\n}\n\n.resume .resume_right {\n  width: 520px;\n  background: #fff;\n  padding: 25px;\n}\n\n.resume .resume_right .bold {\n  color: #0bb5f4;\n}\n\n.resume .resume_right .resume_work ul,\n.resume .resume_right .resume_education ul {\n  padding-left: 40px;\n  overflow: hidden;\n}\n\n.resume .resume_right ul li {\n  position: relative;\n}\n\n.resume .resume_right ul li .date {\n  font-size: 16px;\n  font-weight: 500;\n  margin-bottom: 15px;\n}\n\n.resume .resume_right ul li .info {\n  margin-bottom: 20px;\n}\n\n.resume .resume_right ul li:last-child .info {\n  margin-bottom: 0;\n}\n\n.resume .resume_right .resume_work ul li:before,\n.resume .resume_right .resume_education ul li:before {\n  content: "";\n  position: absolute;\n  top: 5px;\n  left: -25px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  border: 2px solid #0bb5f4;\n}\n\n.resume .resume_right .resume_work ul li:after,\n.resume .resume_right .resume_education ul li:after {\n  content: "";\n  position: absolute;\n  top: 14px;\n  left: -21px;\n  width: 2px;\n  height: 115px;\n  background: #0bb5f4;\n}\n\n.resume .resume_right .resume_hobby ul {\n  display: flex;\n  justify-content: space-between;\n}\n\n.resume .resume_right .resume_hobby ul li {\n  width: 80px;\n  height: 80px;\n  border: 2px solid #0bb5f4;\n  border-radius: 50%;\n  position: relative;\n  color: #0bb5f4;\n}\n\n.resume .resume_right .resume_hobby ul li i {\n  font-size: 30px;\n}\n\n.resume .resume_right .resume_hobby ul li:before {\n  content: "";\n  position: absolute;\n  top: 40px;\n  right: -52px;\n  width: 50px;\n  height: 2px;\n  background: #0bb5f4;\n}\n\n.resume .resume_right .resume_hobby ul li:last-child:before {\n  display: none;\n}\n\n  </style> \n</head>\n<body>\n<div class="resume">\n  <div class="resume_left">\n    <div class="resume_profile">\n      <img src="https://i.imgur.com/eCijVBe.png" alt="KALKINSO profile_pic">\n    </div>\n    <div class="resume_content">\n      <div class="resume_item resume_info">\n        <div class="title">\n          <p class="bold">stephen colbert</p>\n          <p class="regular">Designer</p>\n        </div>\n        <ul>\n          <li>\n            <div class="icon">\n              <i class="fas fa-map-signs"></i>\n            </div>\n
<div class="data">\n              21 Street, Texas <br /> USA\n            </div>\n          </li>\n          <li>\n            <div class="icon">\n              <i class="fas fa-mobile-alt"></i>\n            </div>\n            <div class="data">\n              +324 4445678\n            </div>\n          </li>\n          <li>\n            <div class="icon">\n              <i class="fas fa-envelope"></i>\n            </div>\n            <div class="data">\n              stephen@gmail.com\n            </div>\n          </li>\n          <li>\n            <div class="icon">\n              <i class="fab fa-weebly"></i>\n            </div>\n            <div class="data">\n              www.stephen.com\n            </div>\n          </li>\n        </ul>\n      </div>\n      <div class="resume_item resume_skills">\n        <div class="title">\n          <p class="bold">skill\'s</p>\n        </div>\n        <ul>\n          <li>\n            <div class="skill_name">\n              HTML\n            </div>\n            <div class="skill_progress">\n              <span style="width: 80%;"></span>\n            </div>\n            <div class="skill_per">80%</div>\n          </li>\n          <li>\n            <div class="skill_name">\n              CSS\n            </div>\n            <div class="skill_progress">\n              <span style="width: 70%;"></span>\n            </div>\n            <div class="skill_per">70%</div>\n          </li>\n          <li>\n            <div class="skill_name">\n              SASS\n            </div>\n
<div class="skill_progress">\n              <span style="width: 90%;"></span>\n            </div>\n            <div class="skill_per">90%</div>\n          </li>\n          <li>\n            <div class="skill_name">\n              JS\n            </div>\n            <div class="skill_progress">\n              <span style="width: 60%;"></span>\n            </div>\n            <div class="skill_per">60%</div>\n          </li>\n          <li>\n            <div class="skill_name">\n              JQUERY\n            </div>\n            <div class="skill_progress">\n              <span style="width: 88%;"></span>\n            </div>\n            <div class="skill_per">88%</div>\n          </li>\n        </ul>\n      </div>\n      <div class="resume_item resume_social">\n        <div class="title">\n          <p class="bold">Social</p>\n        </div>\n        <ul>\n          <li>\n            <div class="icon">\n              <i class="fab fa-facebook-square"></i>\n            </div>\n            <div class="data">\n              <p class="semi-bold">Facebook</p>\n              <p>Stephen@facebook</p>\n            </div>\n          </li>\n          <li>\n            <div class="icon">\n              <i class="fab fa-twitter-square"></i>\n            </div>\n            <div class="data">\n              <p class="semi-bold">Twitter</p>\n              <p>Stephen@twitter</p>\n            </div>\n          </li>\n          <li>\n            <div class="icon">\n              <i class="fab fa-youtube"></i>\n            </div>\n            <div class="data">\n              <p class="semi-bold">Youtube</p>\n              <p>Stephen@youtube</p>\n            </div>\n          </li>\n          <li>\n            <div class="icon">\n              <i class="fab fa-linkedin"></i>\n
  </div>\n            <div class="data">\n              <p class="semi-bold">Linkedin</p>\n              <p>Stephen@linkedin</p>\n            </div>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </div>\n  <div class="resume_right">\n    <div class="resume_item resume_about">\n      <div class="title">\n        <p class="bold">About us</p>\n      </div>\n      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perspiciatis illo fugit officiis distinctio culpa officia totam atque exercitationem inventore repudiandae?</p>\n    </div>\n    <div class="resume_item resume_work">\n      <div class="title">\n        <p class="bold">Work Experience</p>\n      </div>\n      <ul>\n        <li>\n          <div class="date">2013 - 2015</div>\n          <div class="info">\n            <p class="semi-bold">Lorem ipsum dolor sit amet.</p>\n            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>\n          </div>\n        </li>\n        <li>\n          <div class="date">2015 - 2017</div>\n          <div class="info">\n            <p class="semi-bold">Lorem ipsum dolor sit amet.</p>\n            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>\n          </div>\n        </li>\n        <li>\n          <div class="date">2017 - Present</div>\n          <div class="info">\n            <p class="semi-bold">Lorem ipsum dolor sit amet.</p>\n            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>\n          </div>\n        </li>\n      </ul>\n    </div>\n    <div class="resume_item resume_education">\n      <div class="title">\n        <p class="bold">Education</p>\n      </div>\n      <ul>\n        <li>\n          <div class="date">2010 - 2013</div>\n          <div class="info">\n            <p class="semi-bold">Web Designing (Texas University)</p>\n            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>\n          </div>\n        </li>\n        <li>\n          <div class="date">2000 - 2010</div>\n          <div class="info">\n            <p class="semi-bold">Texas International School</p>\n            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptatibus!</p>\n          </div>\n        </li>\n      </ul>\n    </div>\n    <div class="resume_item resume_hobby">\n      <div class="title">\n        <p class="bold">Hobby</p>\n      </div>\n      <ul>\n        <li><i class="fas fa-book"></i></li>\n        <li><i class="fas fa-gamepad"></i></li>\n        <li><i class="fas fa-music"></i></li>\n        <li><i class="fab fa-pagelines"></i></li>\n      </ul>\n    </div>\n  </div>\n</div>\n</body>\n</html>`

const getFolderStructure = async (bucketName, folderPrefix) => {
    let params = {
      Bucket: bucketName,
      Prefix: folderPrefix,
      Delimiter: '/',
    };
  
    try {
      const data = await s3.listObjectsV2(params).promise();
      const folderStructure = buildHierarchy(data.CommonPrefixes, data.Prefix, data.Contents, params, true);
      return folderStructure;
    } catch (error) {
      console.error('Error fetching folder structure:', error);
    }
  };

  const createFolderWithFile = async (bucketName, folderName, fileName, fileContent) => {
    const folderKey = `${folderName}/`;
    const fileKey = `${folderName}/${fileName}`;
  
    // Create an empty folder by uploading a zero-byte object
    const createFolderParams = {
      Bucket: bucketName,
      Key: folderKey,
      Body: '',
    };
  
    const createFileParams = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent,
      ContentType: 'text/markdown',
    };
  
    try {
      // Create the folder
      await s3.putObject(createFolderParams).promise();
      console.log(`Folder "${folderName}" created successfully.`);
  
      // Create the initial .md file in the folder
      await s3.putObject(createFileParams).promise();
      console.log(`File "${fileName}" created successfully in folder "${folderName}".`);
    } catch (error) {
      console.error('Error creating folder or file:', error);
    }
  };
  
  const buildHierarchy = async (folders, currentFolder, files, params, isRoot=false) => {
    let filesList = [];
    let task = null;
    try{
      task = await Task.findById(currentFolder.slice(0,-1));
    } catch (error) {
      task = null;
    }

    // Process the files in the current folder
    if (files.length === 0 && isRoot && folders.length === 0) {
        const bucketName = params.Bucket;
        const folderName = params.Prefix;
        const fileName = 'RESUME.html';
        const fileContent = sampleBody;
        createFolderWithFile(bucketName, folderName.slice(0,-1), fileName, fileContent);
        const client = new S3Client({region:'ap-south-1'});
        const command = new GetObjectCommand({ Bucket: bucketName, Key: folderName+fileName });
        filesList.push({
            id: `${folderName.slice(0,-1)}/${fileName}`,
            value: fileName,
            title: fileName,
            icon: 'Document',
            fileType: fileName.split('.').pop(),
            content: await getSignedUrl(client, command, { expiresIn: 3600*48 }),
            size: fileContent.length,
        });
        return {
          sortBy: ['title'],
          entries:[
            {
            id: folderName.split(currentFolder)[0]+currentFolder,
            value: currentFolder.slice(0,-1),
            title: task?task.name:currentFolder.slice(0,-1),
            description: task?task.description:'No Description',
            icon: 'Folder',
            children: {
                sortBy: ['title','value'],
                filterBy: ['fileType'],
                entries: filesList,
            },
        }]};
    }
    for (const file of files) {
        const fileKey = file.Key.split('/').pop();
        if (fileKey) {
            const client = new S3Client({region:'ap-south-1'});
            const command = new GetObjectCommand({ Bucket: params.Bucket, Key: file.Key });
            filesList.push({
                id: file.Key,
                value: fileKey,
                title: fileKey,
                icon: 'Document',
                fileType: fileKey.split('.').pop(),
                signedUrl: await getSignedUrl(client, command, { expiresIn: 3600*48 }),
                size: file.Size,
            });
        }
    };

    // Process the subfolders
    if (folders.length > 0) {
      let tempFolders = folders;
        if(task&&task.subTasks?.length>0){
          let taskFolders = task.subTasks.map(subTask=>{
            return folders.find(folder=>folder.Prefix.includes(subTask))
          });
          tempFolders = [...folders.filter(folder=>!task.subTasks.includes(folder.Prefix.split('/').filter(Boolean).pop())),...taskFolders];
        }
        for (const folder of tempFolders) {
            const folderKey = folder.Prefix;
            params.Prefix = folderKey;

            // Check if the folder is a direct child of the current folder
            console.log(folderKey.split('/').filter(Boolean).pop());
            console.log(currentFolder);
            if (folderKey.split('/').length === 3) {
                try {
                    const data = await s3.listObjectsV2(params).promise();
                    const hierarchyData = await buildHierarchy(
                        data.CommonPrefixes,
                        folderKey.split('/').filter(Boolean).pop()+'/',
                        data.Contents,
                        params
                    );
                    filesList = [...filesList,...hierarchyData.entries];
                } catch (error) {
                    console.error('Error fetching subfolder:', error);
                }
            } else {
                  const data = await s3.listObjectsV2(params).promise();
                  const hierarchyData = await buildHierarchy(
                    data.CommonPrefixes,
                    folderKey.split('/').filter(Boolean).pop()+'/',
                    data.Contents,
                    params
                );
                // const subfolderHierarchy = {
                //     id: folderKey.split('/').filter(Boolean).pop(),
                //     value: folderKey.split('/').filter(Boolean).pop(),
                //     title: folderKey.split('/').filter(Boolean).pop(),
                //     icon: 'Folder',
                //     children: {
                //         sortBy: ['title','value'],
                //         filterBy: 'fileType',
                //         entries: [],
                //     },
                // };
                filesList = [...filesList,...hierarchyData.entries];
                // filesList.push(subfolderHierarchy);
            }
        }
    }

    // Return the current folder's hierarchy
    return {
      sortBy: ['title'],
      entries:[
        {
        id: params.Prefix.split(currentFolder)[0]+currentFolder,
        value: currentFolder.slice(0,-1),
        title: task?task.name:currentFolder.slice(0,-1),
        description: task?task.description:'No Description',
        icon: 'Folder',
        children: {
            sortBy: ['title','value'],
            filterBy: ['fileType'],
            entries: filesList,
        },
    }]};
};
  

router.post('/delete', ipAuth, auth, async (req, res) => {
  try {
    const regex = new RegExp(req.user.id, 'g')
    await Kits.deleteMany({ id: { $regex: regex } });
    await fetch(`${req.protocol}://${req.hostname}/api/kits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': req.header('x-auth-token'),
      },
      body: JSON.stringify({ bucketName: req.body.bucketName, Prefix: `users/${req.user.id}/tasks/` }),
    });
    const { bucketName, Prefix, isTask } = req.body;
    const params = {
      Bucket: bucketName,
      Prefix,
    };
    if(isTask){
      const task = await Task.findById(isTask);
      if(task){
        await task.deleteOne();
      }
    }
    const data = await s3.listObjectsV2(params).promise();
    const objects = data.Contents.map(({ Key }) => ({ Key }));
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: objects,
        Quiet: false,
      },
    };
    await s3.deleteObjects(deleteParams).promise();
    res.json({ msg: 'Files deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', auth, ipAuth, async (req, res) => {
  try {
    const kits = await Kits.findOne({ id: `${req.user.id}-s3://${req.body.bucketName}/${req.body.Prefix}` }).sort({ date: -1 });
    let kitsRecords = null;
    let result = [];
    let now = new Date();
    if (!kits || kits.expireAt < now) {
      await Kits.deleteMany({ id: `${req.user.id}-s3://${req.body.bucketName}/${req.body.Prefix}` });
      result = await getFolderStructure(req.body.bucketName, req.body.Prefix);
      kitsRecords = new Kits({ id: `${req.user.id}-s3://${req.body.bucketName}/${req.body.Prefix}`, selectedTask: JSON.stringify(result)});
      const checkKits = await Kits.findOne({ id: `${req.user.id}-s3://${req.body.bucketName}/${req.body.Prefix}` }).sort({ date: -1 });
      if(!checkKits){
        await kitsRecords.save();
      }
    } else {
      result = JSON.parse(kits.selectedTask)
    }
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Upload API
router.post('/upload', ipAuth, auth, upload.single('file'), async (req, res) => {
  const regex = new RegExp(req.user.id, 'g')
  await Kits.deleteMany({ id: { $regex: regex } });
  await fetch(`${req.protocol}://${req.hostname}/api/kits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': req.header('x-auth-token'),
    },
    body: JSON.stringify({ bucketName: req.body.bucketName, Prefix: `users/${req.user.id}/tasks/` }),
  });
  const file = req.file;
  const params = JSON.parse(req.body.params);

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: params.Bucket, // Replace with your S3 bucket name
    Key: params.Key, // File path in S3
    Body: fileStream,
    ContentType: file.mimetype,
  };

  console.log('Uploading file to S3:', uploadParams.Bucket, uploadParams.Key);

  const s3Upload = s3.upload(uploadParams);

  // Track progress and send updates via HTTP response
  s3Upload.on('httpUploadProgress', (progress) => {
    const percentage = Math.round((progress.loaded / progress.total) * 100);
    console.log(`Progress: ${percentage}%`);
    req.app.get("eventEmitter").emit("httpUploadProgress", [progress]);
  });

  s3Upload.send((err, data) => {
    fs.unlinkSync(file.path); // Delete temp file after upload
    if (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload file' });
    } else {
      console.log('Upload complete:', data.Location);
      res.json({ success: true, url: data.Location });
    }
  });
});

router.post('/copy', ipAuth, auth, async (req, res) => {
  try {
    const regex = new RegExp(req.user.id, 'g')
    await Kits.deleteMany({ id: { $regex: regex } });
    await fetch(`${req.protocol}://${req.hostname}/api/kits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': req.header('x-auth-token'),
      },
      body: JSON.stringify({ bucketName: req.body.bucketName, Prefix: `users/${req.user.id}/tasks/` }),
    });
    const { Bucket, CopySource, Key } = req.body;
    const copyParams = {
      Bucket: Bucket,
      CopySource: CopySource,
      Key: Key,
    };
    await s3.copyObject(copyParams).promise();
    res.json({ msg: 'File copied successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.put('/save', ipAuth, auth, async (req, res) => {
  try {
    const regex = new RegExp(req.user.id, 'g')
    await Kits.deleteMany({ id: { $regex: regex } });
    await fetch(`${req.protocol}://${req.hostname}/api/kits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': req.header('x-auth-token'),
      },
      body: JSON.stringify({ bucketName: req.body.bucketName, Prefix: `users/${req.user.id}/tasks/` }),
    });
    const { params } = req.body;
    await s3.putObject(params).promise();
    res.json({ msg: 'File saved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router
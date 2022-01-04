const express= require('express');
const mongoose = require('mongoose');
const students = require('./models/student')
const app = express();

mongoose.connect('mongodb://mongodb:27017/students', {
  useNewUrlParser: true, useUnifiedTopology: true
}). then(()=> console.log("connected"))
.catch(err => console.log(err))

const db = mongoose.connection;
db.on('error', error => console.log(error.message));
db.once('open', () => console.log('connected to database'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
	// res.redirect('/add');
	res.render('home');
})

app.post('/search/rollno',async (req,res)=>{
	let q=req.body.search;
	if(q!=undefined||q!=' '){
	var items=await students.find( {rollno:{$regex: q ,$options:'i'}} ).limit(10);}
	console.log(items);
	res.send(items);
	res.end();
})

app.post('/search/name',async (req,res)=>{
	let q=req.body.search;
	if(q!=undefined||q!=''){
	var items=await students.find( {name:{$regex: q ,$options:'i'}} ).limit(10);}
	console.log(items);
	res.send(items);
	res.end();
})

app.post('/search/rollno/card',async(req,res)=>{
	let q=req.body.search;
	if(q!=undefined||q!=''){
	var items=await students.findOne( {rollno:q} ).limit(10);}
	console.log(items);
	res.send(items);
	res.end();
})

app.post('/search/name/card',async(req,res)=>{
	let q=req.body.search;
	if(q!=undefined||q!=''){
	var items=await students.findOne( {name:q} );}
	console.log(items);
	res.send(items);
	res.end();
})

app.post('/delete/:rno',async (req,res)=>{
	students.remove({rollno:req.params.rno},function(err){
        if(err){
          console.log(err);
        }
    });
    res.redirect('/');
})

app.get('/add',function(req,res){
	res.render('add',{messages:'',rollno:'',name:''});
})


app.post('/add',async (req,res)=>{
	var temp1 = req.body.rollno;
	for (var i = 0; i < temp1.length; i++) {
		if(temp1[i]>=0&&temp1[i]<=9){
			continue}
		else{
			res.render('add',{messages:'Roll number has to be a number',rollno:req.body.rollno,name:req.body.name});
		}}
	let temp = await students.findOne({rollno: req.body.rollno });
	if(temp!=null){		res.render('add',{messages:'Roll number already exists',rollno:req.body.rollno,name:req.body.name});}
	else{
		let temp= new students();
		temp.name =req.body.name;
		temp.rollno =req.body.rollno;
		temp = await temp.save();
		res.redirect('/');
	}
})

app.get('/update/:crno',async (req,res)=>{
	var temp=await students.findOne( {rollno:req.params.crno} ); 
	res.render('update',{messages:'',crno:req.params.crno,rollno:temp.rollno,name: temp.name});
})
app.post('/update/:crno',async (req,res)=>{
	var check=await students.findOne( {rollno:req.body.rollno} );
	var k=false;
	console.log('s');
	if(check!=null){
		if (check.rollno==req.params.crno){
			k=true;
		}	
	}
	if(check!=null&&k==false){
			res.render('update',{messages:'Roll number already exists',crno:req.params.crno,rollno:req.body.rollno,name: req.body.name});
	}
	else{
		let student = {};
		student.rollno = req.body.rollno;
		student.name = req.body.name;
		console.log(student);
		students.updateOne({rollno:req.params.crno}, student, function(err){
			if(err){
			  console.log(err);
			  return;
			}
			else{
				res.redirect('/');
			}
		});

	}
})

app.listen(3000,function(){
	console.log('listening to port 3000');
})
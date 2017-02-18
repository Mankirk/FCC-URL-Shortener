var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main', { title: 'hai' });

});
router.get('/:link',function(req,res,next){
    
     console.log(req.params.link);
     
      MongoClient.connect("mongodb://localhost:27017/links", function(err, db) {
  if(!err) {
    console.log("We are connected");
    
    var savedlinks=db.collection('savedlinks');
    var query=req.params.link;
    var parts=query.split('.');
    console.log(parts);
    if(parts[0]!='www' || parts.length!==3){
        res.send('not a valid url')
        
    }
    
    else{
    
    if(isNaN(query)){
    savedlinks.find({'link':req.params.link}).toArray(function(err, items) {
        console.log(items);
        //var query=req.params.link;
         
        
         if(items.length==0){
             
             var nameAr= query.split('.');
             var name=nameAr[1];
             var link=query;
             var number=Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
             var toSend={site:name,link:link+'/'+number};
             var toInsert={site:name,link:link,nr:number};
             console.log("to send:"+toSend.site+' '+toSend.link+" "+toSend.nr);
             
             if(link!="favicon.ico"){
                 savedlinks.insert(toInsert)};
                 
             savedlinks.find().toArray(function(err,items){
                  console.log(items);
             })
             res.json(toSend);
         }
         else{
              toSend={originalUrl:items[0].link,link:'https://fcc-urlshorteners.herokuapp.com/'+items[0].nr}
              res.json(toSend);
             
         }
         
         //res.render('main', { title: 'bla' });
     })}
     else{
         var number=Number(query);
         savedlinks.find({'nr':number}).toArray(function(err, items) {
             if(items.length==0){
                 res.send("number not in database")
             }
             else{
                 res.writeHead(302, {'Location': 'https://'+items[0].link});
                 res.end();
             }
         })
     }
     
     
     
  }
  }
});    
 
 
})

module.exports = router;

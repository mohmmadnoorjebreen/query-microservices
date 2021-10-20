const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.urlencoded({extended: true}));

app.use(express.json())
const axios = require('axios');
const posts = {};

const handelEvent = (type,data) =>{
    
    if (type === 'postCreat'){
        const {id , title } = data
        posts[id] = {
            id , title, comments :[]
        }
    }

    if (type === 'commentCreat'){
        const {id,postId , content , status} =data

        const post = posts[postId]
        post.comments.push({id,content , status})
    }

    if (type === 'commentUpdated'){
        const {id,postId , content , status} =data

        const post = posts[postId]
        console.log('post',post);
        const comment =post.comments.find(comment =>{
          return comment.id === id
        })
           
        comment.status = status
    }
}

app.get('/posts', (req, res) => {

    res.send(posts)
 	
});

app.post('/event', (req, res) => {

    const {type,data} = req.body

    handelEvent(type,data)

    res.send({});
});


app.listen(4500, async () => {
    console.log(`Server started on 4500`);
    const res = await app.get('http://localhost:5000/event')
    console.log(res);
    if (res){
        for (let event of res.data ){
            console.log('event processed',event);
            handelEvent(event.type,event.data)
        }
    }

});

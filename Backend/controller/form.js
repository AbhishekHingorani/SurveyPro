const { json } = require('express');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const connection = require('../config/connection');

router.post('/form', passport.authenticate('jwt', {session: false}), (req, res) => {
    if (!req.isAuthenticated()) {
        res.sendStatus(401);
    } else {
        const { UserId } = req.user;
        const { title } = req.body;
        const { questions } = req.body

        let formData = {
            UserId,
            title
        }

        connection.query('INSERT INTO forms SET ?', formData, (error, results, fields) => {
            if (error) throw error;
            let FormId = results.insertId;

            let sql = "INSERT INTO questions (FormId, QuesType, QuesText, QuesOptions) VALUES ?";
            let values = questions.map(question=>([
                FormId,
                parseInt(question.quesType, 10),
                question.quesTitle,
                JSON.stringify(question.quesOptions),
            ]))

            connection.query(sql, [values], (error, results, fields) => {
                if (error) throw error;
                res.send({formId:FormId});
            })
        });
    }
});

router.get('/form/:formId', (req, res) => {  
    let {formId} = req.params;
    connection.query(
        `Select * from forms f, questions q where f.FormId = q.FormId and f.FormId = ${formId}`,
        (error, results, fields)  => {
            if(error) throw error;
            if(results.length <= 0){
                res.sendStatus(404);
            }else{
                let formData = {
                    title: results[0].title,
                    userId: results[0].UserId,
                    questions:[]
                }
                formData.questions = results.map(row=>({
                    quesId: row.QuesId,
                    quesTitle: row.QuesText,
                    quesType:row.QuesType,
                    quesOptions: JSON.parse(row.QuesOptions)
                }))
                res.send(formData)
            }
        }
    );
    
});

router.post('/answers/', (req, res) => {
    if(req.body){
        let sql = "INSERT INTO answers (QuesId, AnsVal) VALUES ?";
        let values = req.body.map(answer=>([
            parseInt(answer.quesId, 10),
            JSON.stringify(answer.ansVal),
        ]))
        connection
            .query(sql, [values], (error, results, fields)  => {
                if(error) throw error;
                res.send({'status': 'form submitted'});
            });
    }else{
        res.sendStatus(400);
    }
});

router.get('/form/:formId/answers', (req, res) => {

    let { formId } = req.params;

    let sql = `Select f.title, q.QuesId, q.QuesType, q.QuesText, q.QuesOptions, a.AnsVal from forms f, questions q, answers a where f.FormId = q.FormId and q.QuesId = a.QuesId and f.FormId = ${formId}`;
    connection
        .query(sql, (error, results, fields)  => {
            if(error) throw error;
            if(results.length <= 0){
                res.sendStatus(404);
            } else {
                let answers = [];
            
                results.forEach(row => {
                    let answer = answers.find(ans => ans.quesId === row.QuesId);
                    if(answer){
                        answer.quesAnswer.push(JSON.parse(row.AnsVal));
                    }else{
                        answers.push({
                            quesId: row.QuesId,
                            quesTitle: row.QuesText,
                            quesType: row.QuesType,
                            quesOptions:JSON.parse(row.QuesOptions),
                            quesAnswer: [JSON.parse(row.AnsVal)]
                        })
                    }
                })
                res.send({
                    title: results[0].title,
                    answers
                });
            }
            
        });
});

router.get('/forms', passport.authenticate('jwt', {session: false}), (req, res) => {

    const { UserId } = req.user;

    let sql = `Select title, FormId from forms where UserId = ${UserId}`;
    connection
        .query(sql, (error, results, fields)  => {
            if(error) throw error;
            res.send(results);
        });
});

module.exports = router;
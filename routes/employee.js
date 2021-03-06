var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// display Employee Details
router.get('/', function(req, res, next) {
    dbConn.query('SELECT * FROM Employee ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/employee/index.ejs
            res.render('employee',{data:''});
        } else {
            // render to views/employee/index.ejs
            res.render('employee',{data:rows,SearchText:''});
        }
    });
});

// display add employee page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('employee/add', {
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        CPassword: '',
        Gender:''
    })
})

// add a new employee
router.post('/add', function(req, res, next) {
    let FirstName = req.body.FirstName;
    let LastName = req.body.LastName;
    let Email = req.body.Email;
    let Password = req.body.Password;
    let CPassword = req.body.CPassword;
    let Gender = req.body.Gender;
    dbConn.query("SELECT * FROM Employee WHERE Email = '" + Email +"'", function(err, rows, fields) {
            if (err) throw err

            // if employee not found
            if (rows.length <= 0) {
                var form_data = {
                    FirstName : FirstName,
                    LastName : LastName,
                    Email : Email,
                    Password : Password,
                    Gender : Gender,
                }
                // insert query
                dbConn.query('INSERT INTO Employee SET ?', form_data, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err)
                        res.render('employee/add', {
                            FirstName : FirstName,
                            LastName : LastName,
                            Email : Email,
                            Password : Password,
                            CPassword : CPassword
                        })
                    } else {
                        req.flash('success', 'Employee successfully added');
                        res.redirect('/employee');
                    }
                })
            } else {
                req.flash('error', "Email Id Already in Used")
                res.redirect('/employee');

            }
        })

})

router.post('/searchText', function(req, res, next) {
    let SearchText = req.body.SearchText;
    if(typeof req.body.btnClear !=='undefined'){
        SearchText = ''
    }
    dbConn.query("SELECT * FROM Employee WHERE (FirstName like '%' '"+SearchText+"' '%') OR (LastName like '%' '"+SearchText+"' '%') OR (FirstName + ' ' + LastName like '%' '"+SearchText+"' '%') ORDER BY id desc", function(err,  rows, fields) {
        //if(err) throw err
        if(err) {
            req.flash('error', err);
            // render to views/employee/index.ejs
            res.render('employee',{data:'',SearchText:SearchText});
        } else {
            // render to views/employee/index.ejs
            res.render('employee',{data:rows,SearchText:SearchText});
        }
    })
})

// display edit employee page
router.get('/edit/(:id)', function(req, res, next) {
    let id = req.params.id;
    dbConn.query('SELECT * FROM Employee WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if employee not found
        if (rows.length <= 0) {
            req.flash('error', 'Employee not found with id = ' + id)
            res.redirect('/employee')
        }
        // if employee found
        else {
            // render to edit.ejs
            res.render('employee/edit', {
                title: 'Edit Employee details',
                id: rows[0].id,
                FirstName: rows[0].FirstName,
                LastName: rows[0].LastName,
                Email: rows[0].Email,
                Password: rows[0].Password,
                CPassword: rows[0].Password,
                 Gender : rows[0].Gender
            })
        }
    })
})

// update employee data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let FirstName = req.body.FirstName;
    let LastName = req.body.LastName;
    let Email = req.body.Email;
    let Password = req.body.Password;
    let CPassword = req.body.CPassword;
    let Gender = req.body.Gender;
    dbConn.query("SELECT * FROM Employee WHERE id!="+id+" and Email = '" + Email +"'", function(err, rows, fields) {
            if (err) throw err

            // if employee not found
            if (rows.length <= 0) {
                var form_data = {
                    FirstName : FirstName,
                    LastName : LastName,
                    Email : Email,
                    Password : Password,
                    Gender : Gender,
                }
                // Edit query
                dbConn.query('UPDATE Employee SET ? WHERE id = ' + id, form_data, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        // set flash message
                        req.flash('error', err)
                        // render to edit.ejs
                        res.render('employee/edit', {
                            id: req.params.id,
                            FirstName: rows[0].FirstName,
                            LastName: rows[0].LastName,
                            Email: rows[0].Email,
                            Password: rows[0].Password,
                            CPassword: rows[0].Password,
                            Gender:rows[0].Gender
                        })
                    } else {
                        req.flash('success', 'Employee Details successfully updated');
                        res.redirect('/employee');
                    }
                })

            } else {
                req.flash('error', "Email Id Already in Used")
                res.redirect('/employee');

            }
        })
    var form_data = {
            FirstName : FirstName,
            LastName : LastName,
            Email : Email,
            Password : Password,
            Gender:Gender

        }

})

// delete employee
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM Employee WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to employee page
            res.redirect('/employee')
        } else {
            // set flash message
            req.flash('success', 'Employee Details successfully deleted! ID = ' + id)
            // redirect to employee page
            res.redirect('/employee')
        }
    })
})

module.exports = router;

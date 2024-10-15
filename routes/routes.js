const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Car = require('../models/cars')
const Account = require('../models/accounts')
const multer = require('multer')
const fs = require('fs')




router.get('/cars', (req,res) => {
    Car.find().exec((err,cars) => {
        if(err){
            res.json({ message: err.message })
        } else {
            res.render('read_c', {
                title: 'Cars Page',
                cars: cars
            })
        }
    })
})


router.post('/car/add', (req, res) => {
    console.log(req.body);  // Add this to log the incoming form data

    const car = new Car({
        marka: req.body.marka,
        model: req.body.model,
        VIN: req.body.VIN,
        regnum: req.body.regnum,
        created: req.body.created,
    });

    car.save((err) => {
        if (err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: 'success',
                message: 'Car added successfully!'
            };
            res.redirect('/cars');
        }
    });
});



router.get('/car/add', (req,res) => {
    res.render("create", { title: "Add Car" })
})

router.get('/car/delete/:id', (req, res) => {
    let id = req.params.id

    Car.findByIdAndRemove(id, (err, result) => {
        if(err) {
            res.json({ message: err.message })
        }else {
            req.session.message = {
                type: 'info',
                message: 'Car deleted successfully!'
            }
            res.redirect('/cars')
        }
    })
})


router.get("/car/edit/:id", (req,res) => {
    let id = req.params.id
    Car.findById(id, (err, car) => {
        if(err){
            res.redirect('/cars')
        } else {
            if(car == null){
                res.redirect('/cars')
            } else {
                res.render("update_c.ejs", {
                    title: "Edit Car",
                    car: car,
                })
            }
        }
    })
})

router.post('/car/update/:id', (req,res) => {
    let id = req.params.id

    Car.findByIdAndUpdate(id, {
        marka: req.body.marka,
        model: req.body.model,
        VIN: req.body.VIN,
        regnum: req.body.regnum,
        created: req.body.created,

    }, (err, result) => {
        if(err){
            res.json({ message: err.message, type: 'danger' })
        } else {
            req.session.message = {
                type: 'success',
                message: 'Car updated successfully!',
            }
            res.redirect('/cars')
        }
    })
})












//------------------------------------------------------------------------------------


router.get('/home', (req,res) => {
    res.render('home', { title: 'Home Page' })
})

router.get('/contacts', (req,res) => {
    User.find().exec((err,users) => {
        if(err){
            res.json({ message: err.message })
        } else {
            res.render('index', {
                title: 'Conatcts Page',
                users: users
            })
        }
    })
})

router.post('/add', (req, res) => {
    console.log(req.body);  // Add this to log the incoming form data

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        title: req.body.title,
        created: req.body.created,
    });

    user.save((err) => {
        if (err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: 'success',
                message: 'User added successfully!'
            };
            res.redirect('/contacts');
        }
    });
});


router.get('/add', (req,res) => {
    res.render("add_users", { title: "Add Users" })
})


router.get("/edit/:id", (req,res) => {
    let id = req.params.id
    User.findById(id, (err, user) => {
        if(err){
            res.redirect('/contacts')
        } else {
            if(user == null){
                res.redirect('/contacts')
            } else {
                res.render("edit_users", {
                    title: "Edit User",
                    user: user,
                })
            }
        }
    })
})

router.post('/update/:id', (req,res) => {
    let id = req.params.id

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        title: req.body.title,
        created: req.body.created,

    }, (err, result) => {
        if(err){
            res.json({ message: err.message, type: 'danger' })
        } else {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully!',
            }
            res.redirect('/contacts')
        }
    })
})



router.get("/update/acc/:id", (req,res) => {
    let id = req.params.id
    Account.findById(id, (err, account) => {
        if(err){
            res.redirect('/accounts')
        } else {
            if(account == null){
                res.redirect('/accounts')
            } else {
                res.render("update_acc", {
                    title: "Edit User",
                    account: account,
                })
            }
        }
    })
})

// POST ruta za ažuriranje korisničkog naloga
router.post('/update/acc/:id', (req, res) => {
    let id = req.params.id;
    
    // Prvo pronađi korisnika u bazi
    Account.findById(id, (err, account) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            // Ako je nova lozinka uneta, hashuj je, a ako nije, koristi staru lozinku
            if (req.body.password) {
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if (err) {
                        res.json({ message: err.message, type: 'danger' });
                    } else {
                        // Ažuriraj korisničke podatke sa hashovanom lozinkom
                        account.username = req.body.username;
                        account.email = req.body.email;
                        account.password = hashedPassword;

                        account.save((err) => {
                            if (err) {
                                res.json({ message: err.message, type: 'danger' });
                            } else {
                                req.session.message = {
                                    type: 'success',
                                    message: 'User updated successfully!',
                                };
                                res.redirect('/accounts');
                            }
                        });
                    }
                });
            } else {
                // Ako lozinka nije promenjena, samo ažuriraj username i email
                account.username = req.body.username;
                account.email = req.body.email;

                account.save((err) => {
                    if (err) {
                        res.json({ message: err.message, type: 'danger' });
                    } else {
                        req.session.message = {
                            type: 'success',
                            message: 'User updated successfully!',
                        };
                        res.redirect('/accounts');
                    }
                });
            }
        }
    });
});



router.get('/delete/:id', (req, res) => {
    let id = req.params.id

    User.findByIdAndRemove(id, (err, result) => {
        if(err) {
            res.json({ message: err.message })
        }else {
            req.session.message = {
                type: 'info',
                message: 'User deleted successfully!'
            }
            res.redirect('/contacts')
        }
    })
})

router.get('/delete/acc/:id', (req, res) => {
    let id = req.params.id

    Account.findByIdAndRemove(id, (err, result) => {
        if(err) {
            res.json({ message: err.message })
        }else {
            req.session.message = {
                type: 'info',
                message: 'User deleted successfully!'
            }
            res.redirect('/accounts')
        }
    })
})



router.get('/accounts', (req,res) => {
    Account.find().exec((err,accounts) => {
        if(err){
            res.json({ message: err.message })
        } else {
            res.render('read_acc', {
                title: 'Account Page',
                accounts: accounts
            })
        }
    })
})




//---------------LOGIN--------------------------------

const path = require('path')
const bcrypt = require('bcrypt')
const { title } = require('process')
const { log } = require('console')


router.get('/', (req,res) => {
    res.render('login', { title: "Login Page" })
})


router.get('/register', (req,res) => {
    res.render('register',{ title: "SignUp Page" })
})

router.get('/acc/register', (req,res) => {
    res.render('register',{ title: "SignUp Page" })
})

// Function to validate email format
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        req.session.message = {
            type: 'danger',
            message: 'All fields are required!'
        };
        return res.redirect('/register');
    }

    // Check if email is valid
    if (!validateEmail(email)) {
        req.session.message = {
            type: 'danger',
            message: 'Please enter a valid email address!'
        };
        return res.redirect('/register');
    }

    try {
        // First, check if the username already exists in the database
        const existingUser = await Account.findOne({ username });
        if (existingUser) {
            req.session.message = {
                type: 'danger',
                message: 'Username already exists!'
            };
            return res.redirect('/register');
        }

        // Hash the password with bcrypt
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create a new account with hashed password
        const acc = new Account({
            username,
            password: hashedPassword,  // Save the hashed password
            email,
        });

        // Save the new account
        await acc.save();

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

router.post('/acc/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        req.session.message = {
            type: 'danger',
            message: 'All fields are required!'
        };
        return res.redirect('/acc/register');
    }

    // Check if email is valid
    if (!validateEmail(email)) {
        req.session.message = {
            type: 'danger',
            message: 'Please enter a valid email address!'
        };
        return res.redirect('/acc/register');
    }

    try {
        // First, check if the username already exists in the database
        const existingUser = await Account.findOne({ username });
        if (existingUser) {
            req.session.message = {
                type: 'danger',
                message: 'Username already exists!'
            };
            return res.redirect('/acc/register');
        }

        // Hash the password with bcrypt
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create a new account with hashed password
        const acc = new Account({
            username,
            password: hashedPassword,  // Save the hashed password
            email,
        });

        // Save the new account
        await acc.save();

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };
        res.redirect('/accounts');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.session.message = {
            type: 'danger',
            message: 'All fields are required!'
        };
        return res.redirect('/');
    }

    try {
        // Pronađi korisnika prema korisničkom imenu
        const user = await Account.findOne({ username });
        if (!user) {
            req.session.message = {
                type: 'danger',
                message: 'Invalid username or password!'
            };
            return res.redirect('/');
        }

        // Uporedi lozinku sa heširanom lozinkom u bazi podataka
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.message = {
                type: 'danger',
                message: 'Invalid username or password!'
            };
            return res.redirect('/');
        }

        // Ako je lozinka ispravna, prijavi korisnika
        req.session.user = user; // Sačuvaj korisničke podatke u sesiji
        req.session.message = {
            type: 'success',
            message: 'Logged in successfully!'
        };
        res.redirect('/home');  // Preusmeri na početnu stranicu ili stranicu po izboru
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});



router.get('/logout', (req, res) => {
    // Uništava sesiju korisnika
    req.session.destroy((err) => {
        if (err) {
            return res.json({ message: err.message, type: 'danger' });
        }

        // Nakon brisanja sesije, preusmeri korisnika na login stranicu
        res.redirect('/');
    });
});














module.exports = router
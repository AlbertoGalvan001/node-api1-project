// implement your API here
const express = require("express");

const db = require("./data/db.js");

const server = express();

server.use(express.json());


server.get('/', (req, res) => {
    res.send({ api: "up and running..." });
});

//get users GET
server.get("/api/users", (req, res) => {

    db.find()
        .then(users => {
            res
                .status(200)
                .json(users);
        })
        .catch(error => {
            console.log("error on GET /users", error);
            res
                .status(500)
                .json({ errorMessage: "error getting users from database" })
        })
})

//get users by ID
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(user => {
            if (!user) {
                res.status(404)
                    .json({ errorMessage: "That user Id doesn't exist." })
            } else {
                res.json(user)
            }
        })
        .catch(error => {
            res
                .status(400)
                .json({ errorMessage: "error getting users by ID" })
        });
});

/// add users POST request
server.post("/api/users", (req, res) => {
    const usersData = req.body;
    if (!usersData.name || !usersData.bio) {
        res
            .status(400)
            .json({ errorMessage: "enter a name and bio for this user" });
    } else {
        db.insert(usersData)
            .then(users => {
                res.status(201).json(users);
            })
            .catch(error => {
                console.log("error on POST /users", error);
                res.json({ errorMessage: "error adding users to database" })
            });
    }
});
/// delete users
server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(removed => {
            if (removed) {
                res
                    .status(200)
                    .json({ message: "The user was removed successfully", removed });
            } else {
                res.status(404)
                    .json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(error => {
            res.status(500)
                .json({ errorMessage: "error deleting user" });
        });
})

///edit users
server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const modify = req.body;

    db.findById(id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .json({ message: "The user with the specified ID does not exist." });
            } else if (!modify.name || !modify.bio) {
                res.status(400)
                    .json({ message: "Enter name and bio" });
            } else {
                db.update(id, modify)
                    .then(user => {
                        res.status(200)
                            .json(user);
                    })
                    .catch(error => {
                        res.status(500)
                            .json({ message: "that user is not updated" })
                    })
            }
        })
})


const port = 4010;
server.listen(port, () => console.log(`\n API running on port ${port} **\n`));
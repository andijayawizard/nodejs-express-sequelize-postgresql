module.exports = app => {
    const contacts = require("../controllers/contact.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", contacts.create);

    // Retrieve all contacts
    router.get("/", contacts.findAll);

    // Retrieve all published contacts
    router.get("/published", contacts.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:id", contacts.findOne);

    // Update a Tutorial with id
    router.put("/:id", contacts.update);

    // Delete a Tutorial with id
    router.delete("/:id", contacts.delete);

    // Create a new Tutorial
    router.delete("/", contacts.deleteAll);

    app.use('/api/contacts', router);
};

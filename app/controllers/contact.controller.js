const db = require("../models");
const Contact = db.contacts;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: contacts } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, contacts, totalPages, currentPage };
};
// Create and Save a new Contact
exports.create = (req, res) => {
    // Validate request
    if (!req.body.firstName || !req.body.lastName) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Contact
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        published: req.body.published ? req.body.published : false
    };

    // Save Contact in the database
    Contact.create(contact)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Contact."
            });
        });
};

// Retrieve all contacts from the database.
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const { limit, offset } = getPagination(page, size);

    Contact.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving contacts."
            });
        });

    // Contact.findAll({ where: condition })
    //     .then(data => {
    //         res.send(data);
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message:
    //                 err.message || "Some error occurred while retrieving contacts."
    //         });
    //     });
};

// Find a single Contact with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Contact.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Contact with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Contact with id=" + id
            });
        });
};

// Update a Contact by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Contact.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Contact was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Contact with id=${id}. Maybe Contact was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Contact with id=" + id
            });
        });
};

// Delete a Contact with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Contact.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Contact was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Contact with id=${id}. Maybe Contact was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Contact with id=" + id
            });
        });
};

// Delete all contacts from the database.
exports.deleteAll = (req, res) => {
    Contact.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} contacts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all contacts."
            });
        });
};

// Find all published contacts
exports.findAllPublished = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    Contact.findAndCountAll({ where: { published: true }, limit, offset })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving contacts."
            });
        });
    // Contact.findAll({ where: { published: true } })
    //     .then(data => {
    //         res.send(data);
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message:
    //                 err.message || "Some error occurred while retrieving contacts."
    //         });
    //     });
};

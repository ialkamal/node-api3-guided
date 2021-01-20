const express = require("express");

const Hubs = require("./hubs-model.js");
const Messages = require("../messages/messages-model.js");
const { route } = require("../server.js");

const router = express.Router();

router.use((req, res, next) => {
  console.log("Hi, Hubs router started!");
  next();
});

router.get("/", (req, res) => {
  Hubs.find(req.query)
    .then((hubs) => {
      res.status(200).json(hubs);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the hubs",
      });
    });
});

router.get("/:id", validateId, (req, res) => {
  res.status(200).json(req.hub);
  // Hubs.findById(req.params.id)
  //   .then((hub) => {
  //     if (hub) {
  //       res.status(200).json(hub);
  //     } else {
  //       res.status(404).json({ message: "Hub not found" });
  //     }
  //   })
  //   .catch((error) => {
  //     // log error to server
  //     console.log(error);
  //     res.status(500).json({
  //       message: "Error retrieving the hub",
  //     });
  //   });
});

router.post("/", validateBody, (req, res) => {
  Hubs.add(req.body)
    .then((hub) => {
      res.status(201).json(hub);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error adding the hub",
      });
    });
});

router.delete("/:id", validateId, (req, res) => {
  Hubs.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The hub has been nuked" });
      } else {
        res.status(404).json({ message: "The hub could not be found" });
      }
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error removing the hub",
      });
    });
});

router.put("/:id", validateId, validateBody, (req, res) => {
  Hubs.update(req.params.id, req.body)
    .then((hub) => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: "The hub could not be found" });
      }
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error updating the hub",
      });
    });
});

router.get("/:id/messages", validateId, (req, res) => {
  Hubs.findHubMessages(req.params.id)
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error getting the messages for the hub",
      });
    });
});

router.post("/:id/messages", validateId, validateBody, (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then((message) => {
      res.status(210).json(message);
    })
    .catch((error) => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error adding message to the hub",
      });
    });
});

function validateId(req, res, next) {
  const { id } = req.params;
  Hubs.findById(id)
    .then((hub) => {
      if (hub) req.hub = hub;
      else next("invalid hub id");
      next();
    })
    .catch((err) =>
      res.status(500).json({ message: "failed to process", err })
    );
}

function validateBody(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) next();
  else res.status(400).json({ message: "Incorrect Body Format" });
}

module.exports = router;

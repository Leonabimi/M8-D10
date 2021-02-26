const express = require("express");
const UserModel = require("./schema");
const axios = require("axios");
const {authenticate} = require("../auth/tools");
const { authorize } = require("../auth/middlewares")

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    console.log(req.body)
    const { _id } = await newUser.save();

    res.send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
      const { email , password } = req.body
      const user = await UserModel.findByCredentials(email,password)
      const tokens = await authenticate(user)
      res.send(tokens)
  } catch (error) {
    consol.log(error);
    next(error);
  }
});

usersRouter.get("/weather/:query", async (req, res, next) => {
  try {
    const URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "c2b9d5158fcd670365e04deabe792b98";
    const { data } = await axios.get(URL, {
      params: {
        q: req.params.query,
        units: "metric",
        APPID: API_KEY,
      },
    });
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }

});

usersRouter.post("/addFav", authorize , async (req, res, next) => {
    try {
      const user = req.user;
  
      await user.updateOne({ $addToSet: { favorite : req.body.favorite } });
  
      res.send(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


usersRouter.delete("/removeFav", authorize , async (req, res, next) => {
    try {
      const user = req.user;
  
      await user.updateOne({ $pull: { favorite : req.body.favorite } });
  
      res.send(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

module.exports = usersRouter;

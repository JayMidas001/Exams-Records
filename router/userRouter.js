const { getAll, getOne, updateScore, createUser, getStatus, updateInfo, getUserLocation, getWeather} = require("../controller/userController")

const router = require(`express`).Router()

router.post(`/createuser`,createUser)
router.get(`/getall`,getAll)
router.get(`/getone/:id`,getOne)
router.put(`/updateuser/:id`,updateScore)
router.get(`/getstatus/:status`,getStatus)
router.put(`/updateinfo/:id`,updateInfo)
router.get(`/location`,getUserLocation)
router.get(`/weather`,getWeather)

module.exports=router
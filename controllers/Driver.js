const db = require('../models');

const registerDriver = async (req, res) => {
    const id = req.params.userId;
    const driver_license = req.body.driver_license;
    const seating_capacity = req.body.seating_capacity;
    const car_model = req.body.car_model;
    const car_color = req.body.car_color;
    const bank_account = req.body.bank_account;

    const body = {
        id,
        driver_license,
        seating_capacity,
        car_model,
        car_color,
        bank_account,
    }

    const driver = await db.driver.findOne({ where: { id: id } })
    if (driver) {
        res.status(400).send({ message: 'Already register' })
    } else {
        const createDriver = await db.driver.create(body)
        res.status(201).send({ message: 'Driver created', createDriver: createDriver })
    }
}

const deleteDriver = async (req, res) => {
    const id = req.params.userId
    const driver = await db.driver.findOne({ where: { id: id } });
    if (driver) {
        const deleteDriver = await db.driver.destroy({ where: { id: id } })
        res.status(200).send({ message: 'DriverId had deleted', deleteDriver: deleteDriver })
    } else {
        res.status(400).send({ message: 'Invalid driver ID' })
    }
}

const offerRoute = async (req, res) => {
    let userData = await req.user;
    const origin = req.body.origin;
    const destination = req.body.destination;
    const date_time = req.body.date + " " + req.body.time;
    const luggage = req.body.luggage;
    const seating_capacity = req.body.seatingCapacity;
    const price = req.body.price;

    const body = {
        from: origin,
        to: destination,
        date_time,
        luggage,
        seating_capacity,
        price,
        status: "available"
    }

    await db.driver.update(
        body,
        { where: { id:  userData.id} }
    )

    res.status(201).json({
        message: "created new route",
        driver: userData.id,
        details: body
    })
}

module.exports = { registerDriver, deleteDriver, offerRoute }
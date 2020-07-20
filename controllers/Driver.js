const db = require('../models');
const { Op, where } = require("sequelize");
// const { Socket } = require('../utils/socket');
const io = require('../utils/socket');

const registerDriver = async (req, res) => {
  let userData = await req.user;
  const id = req.body.id;
  const driver_license = req.body.driver_license;
  const seat = req.body.seat;
  const car_model = req.body.car_model;
  const car_color = req.body.car_color;
  const bank_account = req.body.bank_account;

  const body = {
    id,
    driver_license,
    seat,
    car_model,
    car_color,
    bank_account,
  };

  const driver = await db.driver.findOne({ where: { id: id } });
  if (driver) {
    res.status(400).send({ message: 'Already register' });
  } else {
    const createDriver = await db.driver.create(body);
    res
      .status(201)
      .send({ message: 'Driver created', createDriver: createDriver });
  }
};

const deleteDriver = async (req, res) => {
  const id = req.params.userId;
  const driver = await db.driver.findOne({ where: { id: id } });
  if (driver) {
    const deleteDriver = await db.driver.destroy({ where: { id: id } });
    res
      .status(200)
      .send({ message: 'DriverId had deleted', deleteDriver: deleteDriver });
  } else {
    res.status(400).send({ message: 'Invalid driver ID' });
  }
};

const offerRoute = async (req, res) => {
  let userData = await req.user;
  const origin = req.body.origin;
  const originLat = req.body.originLat;
  const originLng = req.body.originLng;
  const destination = req.body.destination;
  const destinationLat = req.body.destinationLat;
  const destinationLng = req.body.destinationLng;
  const date_time = req.body.date;
  const luggage = req.body.luggage;
  const seating_capacity = req.body.seatingCapacity;
  const price = req.body.price;

  const body = {
    from: origin,
    from_lat: originLat,
    from_lng: originLng,
    to: destination,
    to_lat: destinationLat,
    to_lng: destinationLng,
    date_time,
    luggage,
    seating_capacity,
    price,
    status: 'available',
  };

  try {
    await db.driver.update(body, { where: { id: userData.id } });

    res.status(201).json({
      message: 'created new route',
      driver: userData.id,
      details: body,
    });
  } catch (err) {
    res.status(400).send({ message: 'Cannnot create route' });
    console.log(err);
  }
};

const waitForPassenger = async (req, res) => {
  let driverData = await req.user;
  let selectedDriver;

    let currentDriver = await db.driver.findOne({
      where: {
        id: driverData.id,
      },
    });

    console.log(driverData)
    try {
    
      // is avaiable & have passenger
      if (currentDriver.passenger_id) {
        let isSelected = await db.driver.update(
          {
            status: 'selected',
            confirmation: 'pending',
          },
          {
            where: {
              id: driverData.id,
            },
          }
        );
        if (isSelected) {
          selectedDriver = await db.driver.findOne({
            where: { id: driverData.id },
          });

          res.status(201).json({
            message: 'driver is selected',
            driver: selectedDriver,
            status: selectedDriver.status,
          });
        } else {
          res.status(400).json({
            message: 'something is wrong',
          });
        }
      }
    } catch(error) {
      res.status(400).json({
        message: error,
      });
    }
};
// const waitForPassenger = async (req, res) => {
//   let driverData = await req.user;
//   let selectedDriver;
//   let selectedDriverPromise = new Promise(function (resolve, reject) {
//     const checkPassenger = setInterval(async () => {
//       console.log('driver is waiting for passenger');
//       let currentDriver = await db.driver.findOne({
//         where: {
//           id: driverData.id,
//         },
//       });

//       try {
//         if(!currentDriver.status) {
//           clearInterval(checkPassenger);
//         }
//         // is avaiable & have passenger
//         if (currentDriver.passenger_id) {
//           console.log('hello from waitForpassenger !availableDriver')
//           clearInterval(checkPassenger);
//           let isSelected = await db.driver.update(
//             {
//               status: 'selected',
//               confirmation: 'pending',
//             },
//             {
//               where: {
//                 id: driverData.id,
//               },
//             }
//           );
//           if (isSelected) {
//             selectedDriver = await db.driver.findOne({
//               where: { id: driverData.id },
//             });
//             resolve('driver is selected');
//             // console.log('driver status', currentDriver.status);
//           } else {
//             clearInterval(checkPassenger);
//             reject('something is wrong');
//           }
//         }
//       } catch (err) {
//         clearInterval(checkPassenger);
//         reject(err);
//       }
//     }, 3000);
//   });

//   selectedDriverPromise
//     .then(result => {
//       res.status(201).json({
//         message: result,
//         driver: selectedDriver,
//         status: selectedDriver.status,
//       });
//     })
//     .catch(error => {
//       res.status(400).json({
//         message: error,
//       });
//     });
// };

const cancelWaitForPassenger = async(req, res) => {
  let driverData = await req.user;
  await db.driver.update(
    {status: null},
    {where: {id: driverData.id}},
  );

  res.status(201).json({
    message: 'driver stop waiting',
  })
}

const driverConfirm = async (req, res) => {
  let driverData = await req.user;
  let confirmation = req.body.confirmation;
  let passengerId = req.body.passengerId;
  try {
    if (confirmation) {
      await db.driver.update(
        {
          status: 'booked',
          confirmation: 'confirmed',
        },
        {
          where: { id: driverData.id },
        }
      );

      res.status(201).json({
        message: 'reservation is confirmed',
        status: 'booked',
        confirmation: 'confirmed',
      });

      // notify passenger
      io.getIO().emit('driverConfirmed', {
        message: `Driver confirmed your ride`,
        result: 'confirmed',
        receiverId: passengerId,
      });
      console.log(driverData)
      console.log('passegnerId', driverData.passenger_id)

    } else {

      await db.driver.update(
        {
          status: 'available',
          confirmation: null,
          passenger_id: null,
        },
        {
          where: { id: driverData.id },
        }
      );

      // notify passenger
      io.getIO().emit('driverConfirmed', {
        message: `Driver rejected your ride`,
        result: 'rejected',
        receiverId: passengerId,
      });

      res.status(201).json({
        message: 'reservation is confirmed',
        status: 'available',
        confirmation: null,
      });

      // // notify passenger
      // io.getIO().emit('driverRejected', `Driver rejected your ride`);
    }
  } catch (err) {
    res.status(400).json({
      message: 'something is wrong',
    });
  }
};

const get = async (req, res) => {
  const id = await req.user.id;
  const driver = await db.driver.findOne({ where: { id: id } });
  try {
    if (driver) {
      res.status(200).send({ message: 'OK', driver: driver });
    } else {
      res.status(400).send({message: "your aren't driver"})
    }
  } catch (error) {
    res.status(400).send();
  }
};

const registered = async (req, res) => {
  const id = req.params.userId;
  const driver = await db.driver.findOne({ where: { id: id } });

  if (driver) {
    res.status(200).send(true);
  } else {
    res.status(404).send();
  }
};

const edited = async (req, res) => {
  const id = await req.user.id;
  const driver_license = req.body.driver_license;
  const car_model = req.body.car_model;
  const car_color = req.body.car_color;
  const seat = req.body.seat;
  const bank_account = req.body.bank_account;

  const values = {};
  if (driver_license) {
    values['driver_license'] = driver_license;
  }
  if (car_model) {
    values['car_model'] = car_model;
  }
  if (car_color) {
    values['car_color'] = car_color;
  }
  if (seat) {
    values['seat'] = seat;
  }
  if (bank_account) {
    values['bank_account'] = bank_account;
  }
  const user = await db.driver.findOne({ where: { id: id } });
  if (user) {
    const edit = await db.driver.update(values, { where: { id: id } });
    try {
      res.status(200).send({ edit: edit });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: 'error' });
    }
  } else {
    res.status(400).send({ message: `Don't have user` });
  }

  res.send({ id: id });
};

const getPassenger = async (req, res) => {
  const { passengerId, driverId } = req.body;

  try{
    const passengerToAdd = await db.driver.update(
      { passenger_id: passengerId },
      {
        where: {
          id: driverId,
        },
      }
      );
    
    let selectedDriver;
  
    console.log('driver is waiting for passenger');
    let currentDriver = await db.driver.findOne({
      where: {
        id: driverId,
      },
    });

    console.log('currentDriver', currentDriver)
    try {
      // is avaiable & have passenger
      if (currentDriver.passenger_id) {
        let isSelected = await db.driver.update(
          {
            status: 'selected',
            confirmation: 'pending',
          },
          {
            where: {
              id: driverId,
            },
          }
        );
        if (isSelected) {
          selectedDriver = await db.driver.findOne({
            where: { id: driverId},
          });
          console.log('selectedDriver', selectedDriver)

          // notify driver
          console.log('emit gotPassenger')
          
          io.getIO().emit('gotPassenger', {
            message: `You got selected by a passenger!`,
            passengerId: currentDriver.passenger_id,
            receiverId: driverId,
          });


          res.status(201).json({
            message: 'driver is selected',
            driver: selectedDriver,
            status: selectedDriver.status,
          });
          console.log('driver status', selectedDriver.status);
        } else {
          res.status(400).json({
            message: 'something is wrong',
          });
        }
      }
    } catch(err) {
      console.log('error at status update to selected')
      res.status(400).send(err);
    }
  } catch(err) {
    console.log('error at updating passnger Id')
    res.status(400).send(err);
  }
};

const getTrip = async (req, res) => {
  const id = await req.user.id;
  console.log('getTrip', id)

  try{
    // const currentTrip = await db.driver.findOne({
    //   where : {
    //     [Op.or]: [
    //       { id: id },
    //       { passenger_id: id },
    //     ]
    //   }
    // })
    let roleInTrip;
    let currentTrip = await db.driver.findOne({
      where: { passenger_id: id },
    })
    roleInTrip = 'passenger';

    // if not passenger, query as a driver
    if(!currentTrip) {
      currentTrip = await db.driver.findOne({
        where: { id },
      })  
      roleInTrip = 'driver';
    }


    res.status(200).json({
      currentTrip: currentTrip,
      roleInTrip: roleInTrip,
    })
  } catch(err) {
    res.status(404).json({
      message: 'no trip found',
    })
  }
}

const gotSelected = async (req, res) => {
  let driverId = req.body.driverId;
  let selectedDriver;
    
    let currentDriver = await db.driver.findOne({
      where: {
        id: driverId,
      },
    });

    try {
    
      // is avaiable & have passenger
      if (currentDriver.passenger_id) {
        let isSelected = await db.driver.update(
          {
            status: 'selected',
            confirmation: 'pending',
          },
          {
            where: {
              id: driverId,
            },
          }
        );
        if (isSelected) {
          selectedDriver = await db.driver.findOne({
            where: { id: driverId},
          });

          res.status(201).json({
            message: 'driver is selected',
            driver: selectedDriver,
            status: selectedDriver.status,
          });
        } else {
          res.status(400).json({
            message: 'something is wrong',
          });
        }
      }
    } catch(error) {
      res.status(400).json({
        message: error,
      });
    }
};

const driverCancelTrip = async(req, res) => {
  try {
    let result = db.driver.update(
      {
        passenger_id: null,
        status: null,
        confirmation: null,
      }, {
        where: {
          id: req.body.userId
        }
      }
    )
  
    io.getIO().emit('cancelTrip', {
      message: `The trip got canceled`,
      // receiverId: passengerId,
    });
  
    res.status(201).json({
      message: 'the trip is canceled',
    })
  } catch(err) {
    res.status(400).json({
      message: 'error',
    })
  }
}

module.exports = {
  registerDriver,
  deleteDriver,
  offerRoute,
  get,
  registered,
  edited,
  getPassenger,
  waitForPassenger,
  cancelWaitForPassenger,
  driverConfirm,
  getTrip,
  gotSelected,
  driverCancelTrip,
};

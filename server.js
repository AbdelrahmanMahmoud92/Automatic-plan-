const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Users
app.use('/users', require('./src/routes/auth/register'));
app.use('/users', require('./src/routes/auth/login'));
app.use('/users', require('./src/routes/auth/update'));
app.use('/users', require('./src/routes/auth/get'));
app.use('/users', require('./src/routes/auth/delete'));


// Organization requets
app.use('/organization', require('./src/routes/organizationRequest/requests'));
app.use('/organization', require('./src/routes/organizationRequest/response'));


// Coutries
app.use('/countries', require('./src/routes/countries/add'));
app.use('/countries', require('./src/routes/countries/delete'));

// Cash 
app.use('/cash/management', require('./src/routes/cash/add'));



// Hotels
app.use('/hotels', require('./src/routes/hotels/add'));
app.use('/hotels', require('./src/routes/hotels/delete'));
app.use('/hotels', require('./src/routes/hotels/update'));
app.use('/hotels', require('./src/routes/hotels/relatedHotelsCity'));

// Rooms
app.use('/rooms', require('./src/routes/rooms/add'));


// Restaurants
app.use('/restaurants', require('./src/routes/restaurants/add'));
app.use('/restaurants', require('./src/routes/restaurants/update'));
app.use('/restaurants', require('./src/routes/restaurants/delete'));
app.use('/restaurants', require('./src/routes/restaurants/relatedRestaurantCity'));


// Flights and planes and company
app.use('/planes', require('./src/routes/flights/addPlane'));
app.use('/flight', require('./src/routes/flights/addFlight'));
app.use('/flights', require('./src/routes/flights/reservationFlight'));
app.use('/companies', require('./src/routes/flights/addCompany'));


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {console.log(`Server running on ${PORT} port.`)});;
}).catch((err) => {
    console.log(err);
});



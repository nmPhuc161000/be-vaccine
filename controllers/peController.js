const PE = require('../models/PE');

const getPE = async (req, res) => {
    try {
        const data = await PE.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
};

module.exports = { getPE };
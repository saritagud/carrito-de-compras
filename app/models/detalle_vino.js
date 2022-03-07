module.exports = function (sequelize, Sequelize) {

    const venta = require('./venta');
    const Venta = new venta(sequelize, Sequelize);
    const vino = require('./vino');
    const Vino = new vino(sequelize, Sequelize);

    const DetalleVino = sequelize.define('detalle_vino', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        cantidad: {
            type: Sequelize.DOUBLE
        },
        precioUnitario:{
            type: Sequelize.DOUBLE
        },
        precioTotal:{
            type: Sequelize.DOUBLE
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    DetalleVino.belongsTo(Venta, {
        foreignKey: 'id_venta',
        constraints: false
    });
    DetalleVino.belongsTo(Vino, {
        foreignKey: 'id_vino',
        constraints: false
    });

    return DetalleVino;
};
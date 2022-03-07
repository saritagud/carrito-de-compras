'use strict';
const models = require('../models/index');
const Persona = models.persona;
const Venta = models.venta;
const Vino = models.vino;
const Detalle = models.detalle_vino;
class VentaController {
    guardar(req, res) {
        const carrito = req.session.carrito;
        Persona.findOne({ where: { external_id: req.user.id_persona } }).then(function (persona) {
            if (persona) {
                const modeloVenta = {
                    fecha: new Date(),
                    subtotal: req.body.subtotal,
                    iva: req.body.iva,
                    total: req.body.total,
                    descuento: req.body.descuento,
                    id_persona: persona.id
                };
                Venta.create(modeloVenta).then(function (newVenta) {
                    if (!newVenta) {
                        req.flash('info', 'No se ha completado su compra.', false);
                        res.redirect('/comprar');
                    } else {
                        const detalle = [];
                        for (let item of carrito) {
                            const modeloDetalle = {
                                cantidad: item.cantidad,
                                precioUnitario: item.precio,
                                precioTotal: item.precio_total,
                                id_venta: newVenta.id,
                                id_vino: item.id
                            };
                            detalle.push(modeloDetalle);
                        };
                        Detalle.bulkCreate(detalle).then(() => {
                            return Detalle.findAll({ where: { id_venta: newVenta.id } }).then(detalles => {
                                detalles.forEach(function (item) {
                                    Vino.findOne({ where: { id: item.id_vino } }).then(function (vino) {
                                        Vino.update({ cantidad: vino.cantidad - item.cantidad }, { where: { id: item.id_vino } });
                                    });
                                });
                                req.session.carrito = [];
                                req.flash('info', 'Se ha completado su compra.', false);
                                res.redirect('/administracion');
                            });
                        });
                    }
                });
            }
        });
    }
}
module.exports = VentaController;
import React, { useState, useEffect } from "react"
import { Link , useLocation, useHistory } from "react-router-dom"
import axios from "axios"
import swal from "sweetalert"
import { stringify } from "querystring"

const DetalleCreate = () => {
    const { cabecera } = useLocation()

    const url = "https://apirestcxp.herokuapp.com/cxp/detalle/"
    const urlProv = "https://app-mod-com.herokuapp.com/compras/facturaProveedor"

    const history = useHistory()

    const [facturaProv, setFacturaProv] = useState([])

    const [detalleForm, setDetalleForm] = useState({
        idcabecera: cabecera.idcabecera,
        id_factura: 0,
        valorapagar: 0,
        abono: 1.00,
        saldo: 0
    })

    useEffect(() => {
        const getFacturaData = async () => {
            const consulta = await axios.get(urlProv + "/" + cabecera.prov_dni)
            if (consulta.data.code === 0) { }
            else {
                setFacturaProv(consulta.data || [0])
            }
        }
        getFacturaData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const valorPagar = (numFactura) => {
            try {
                if (facturaProv.length > 0) {
                    const dataFactura = facturaProv.find(factura => {
                        // eslint-disable-next-line eqeqeq
                        return factura.cab_id == numFactura
                    })
                    const saldoAnterior = (dataFactura.cab_saldo - 0).toFixed(2)
                    const saldoCalc = saldoAnterior - abono
                    setDetalleForm({ ...detalleForm, valorapagar: saldoAnterior, 
                        id_factura: numFactura, saldo: saldoCalc.toFixed(2) })
                }
            } catch (error) {
                setDetalleForm({ ...detalleForm, valorapagar: 0, 
                    id_factura: 0, saldo: 0 })
            }
    }

    const abonoSaldo = (valorAbono) => {
        try {
            const saldoCalc = valorapagar - valorAbono
            setDetalleForm({ ...detalleForm, abono: valorAbono, saldo: saldoCalc.toFixed(2) })
        } catch (e) {
            setDetalleForm({ ...detalleForm, abono: valorAbono, saldo: -1 })
        }
    }

    const { idcabecera, id_factura, valorapagar, abono, saldo } = detalleForm

    const postDetalle = async () => {
        const stringifyFuente = stringify(detalleForm)
        if (id_factura === 0){
            swal({
                title: "Error",
                text: "No se ha seleccionado una factura.",
                icon: "error"
            })
        } else if (saldo < 0) {
            console.log("esto es el abono: ",abono," esto es valor a pagar: ", valorapagar)
            swal({
                title: "Error",
                text: "No puede abonar más que el valor a pagar.",
                icon: "error"
            })
        } else if (abono === 0) {
            swal({
                title: "Error",
                text: "Debe abonar algo.",
                icon: "error"
            })
        } else {
            const post = await axios.post(url+"?"+stringifyFuente)
            if (post.data.code) {
                swal({
                    title: "Error",
                    text: post.data.message,
                    icon: "error"
                })
            } else {
                swal({
                    text: "Fuente de Pago creada con éxito",
                    icon: "success"
                })
                history.push({ pathname: "/cabecera/detalle", idcabecera: cabecera.idcabecera })
            } 
        }
    }

    return (
        <div className="container-fluid">
            <h2>Agregar Detalle de Pago</h2>
            <div className="card mb-2">
                <div className="card-body">
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Id Cabecera</label>
                        <input type="text" className="form-control" value={idcabecera} readOnly />
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Id Factura</label>
                        <div className="col row bg-white">
                            <div className="col">
                                <select className="form-select" value={id_factura}
                                    onChange={(e) => {
                                        valorPagar(e.target.value)
                                    }} >
                                    <option>0</option>
                                    {facturaProv.map((factura, index) => {
                                        return (
                                            <option key={index}>{factura.cab_id}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Valor A Pagar</label>
                        <input type="number" className="form-control" value={valorapagar} readOnly />
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center mx-2">Abono</label>
                        <div className="col input-group bg-white" >
                            <div className="input-group-prepend mx-2">
                                <span className="input-group-text">$</span>
                            </div>
                            <input type="number" className="form-control" value={abono} min="0.01" max={valorapagar}
                                onChange={(e) => abonoSaldo(e.target.value)}
                                step="0.01" lang="en-US" required />
                        </div>
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Saldo</label>
                        <input type="number" className="form-control" value={saldo} readOnly />
                    </div>
                </div>
            </div>
            <div>
                <input type="submit" onClick={postDetalle} className="btn btn-primary me-2" value="Guardar" />
                <Link to={{ pathname: "/cabecera/detalle", idcabecera: cabecera.idcabecera }} >
                    <button className="btn btn-secondary" >Regresar</button>
                </Link>
            </div>
        </div>
    )
}

export default DetalleCreate
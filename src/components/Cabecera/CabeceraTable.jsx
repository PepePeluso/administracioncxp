import React, { useState, Fragment, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt, faBars } from '@fortawesome/free-solid-svg-icons'
import swal from "sweetalert"

const CabeceraTable = () => {

    const url = "https://apirestcxp.herokuapp.com/cxp/cabecera/";

    const [dataCabecera, setDataCabecera] = useState([])

    const history = useHistory()

    const cambiarformatoFecha = (date) => {
        var fecha = String(date)

        return fecha.replace("T00:00:00.000Z", "")
    }

    useEffect(() => {
        const getCabecera = async () => {
            const consulta = await axios.get(url)
            setDataCabecera(consulta.data)
        }
        getCabecera()
    }, [])

    const deleteCabecera = async (e) => {
        const confirmEliminar = await swal({
            text: "¿Está seguro de eliminar este Pago?",
            icon: "warning",
            buttons: {
                cancel: { text: "No", value: false, visible: true },
                confirm: { text: "Si", value: true }
            }
        })
        if (confirmEliminar) {
            const del = await axios.delete(url + "?idcabecera=" + e.value)
            if (del.data.code) {
                swal({
                    title: "Error",
                    text: del.data.message,
                    icon: "error"
                })
            } else {
                await swal({
                    text: "Cabecera eliminada con éxito",
                    icon: "success"
                })
                history.go(0)
            }
        }
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <Link to="/cabecera/create">
                    <p className="btn btn-success">Crear Cabecera</p>
                </Link>
            </div>
            <div className="container-fluid table-responsive">
                <table className="table table-dark table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Id Cabecera</th>
                            <th>Descripcion de Pago</th>
                            <th>Proveedor DNI</th>
                            <th>Id Fuente de Pago</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        { !(dataCabecera===undefined) &&
                            dataCabecera.map((pago, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{pago.idcabecera}</td>
                                        <td>{pago.descripcionpago}</td>
                                        <td>{pago.prov_dni}</td>
                                        <td>{pago.idfuente}</td>
                                        <td>{cambiarformatoFecha(pago.fechapago)}</td>
                                        <td>
                                            {!(pago.facturaprint) &&
                                                <Link to={{ pathname: "/cabecera/edit", cabecera: pago }}>
                                                    <button className="btn btn-primary" ><FontAwesomeIcon icon={faEdit} /></button>
                                                </Link>
                                            }
                                            {"   "}
                                            <button className="btn btn-danger" onClick={(e) => deleteCabecera(e.currentTarget)} value={pago.idcabecera} ><FontAwesomeIcon icon={faTrashAlt} /></button>
                                            {"   "}
                                            <Link to={{ pathname: "/cabecera/detalle", idcabecera: pago.idcabecera }}>
                                                <button className="btn btn-warning"><FontAwesomeIcon icon={faBars}
                                                /></button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default CabeceraTable
import React, { useState, Fragment, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import swal from "sweetalert"

const FuentePagoTable = () => {
    const url = "https://apirestcxp.herokuapp.com/cxp/fuentepago/";

    const [dataFuente, setDataFuente] = useState([])

    const history = useHistory()

    useEffect(() => {
        const getFuentes = async () => {
            const consulta = await axios.get(url)
            if (consulta.data.code === 0){}
            else {
                setDataFuente(consulta.data || [0])
            }
        }
        getFuentes()
    }, [])

    const deleteFuente = async (e) => {
        console.log(e.value)
        const confirmEliminar = await swal({
            text: "¿Está seguro de eliminar esta Fuente de Pago?",
            icon: "warning",
            buttons: {
                cancel: { text: "No", value: false, visible: true },
                confirm: { text: "Si", value: true }
            }
        })
        if (confirmEliminar) {
            const del = await axios.delete(url + "?idfuente=" + e.value)
            if (del.data.code) {
                swal({
                    title: "Error",
                    text: del.data.message,
                    icon: "error"
                })
            } else {
                await swal({
                    text: "Fuente de Pago eliminada con éxito",
                    icon: "success"
                })
                history.go(0)
            }
        }
    }

    return(
        <Fragment>
            <div className="container-fluid">
                <Link to="/fuentepago/create">
                    <p className="btn btn-success">Crear Fuente de Pago</p>
                </Link>
            </div>
            <div className="container-fluid table-responsive">
                <table className="table table-dark table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Id Fuente</th>
                            <th>Nombre de Pago</th>
                            <th>Descripción del Pago</th>
                            <th>Cuenta Bancaria</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        { !(dataFuente===undefined) &&
                            dataFuente.map((fuente, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{fuente.idfuente}</td>
                                        <td>{fuente.nombrepago}</td>
                                        <td>{fuente.descripcionpago}</td>
                                        <td>{fuente.cuentabancaria}</td>
                                        <td>{fuente.estado.toString()}</td>
                                        <td>
                                            <Link to={{ pathname: "/fuentepago/edit", fuentePago: fuente }}>
                                                <button className="btn btn-primary" ><FontAwesomeIcon icon={faEdit} /></button>
                                            </Link>
                                            {"   "}
                                            <button className="btn btn-danger" onClick={(e) => deleteFuente(e.currentTarget)} 
                                            value={fuente.idfuente} ><FontAwesomeIcon icon={faTrashAlt} /></button>
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

export default FuentePagoTable
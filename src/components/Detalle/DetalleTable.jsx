import React, { useState, Fragment, useEffect } from "react"
import axios from "axios"
import { Link, useLocation, /*useHistory*/ } from "react-router-dom"
//import swal from "sweetalert"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const DetalleTable = () => {
    const { idcabecera } = useLocation()
    const url = "https://apirestcxp.herokuapp.com/cxp/cabecera/" + idcabecera;
    const urlDet = "https://apirestcxp.herokuapp.com/cxp/detalle/" + idcabecera;

    const [dataCabecera, setDataCabecera] = useState([])
    const [dataDetalle, setDataDetalle] = useState([])

    //const history = useHistory()

    const cambiarformatoFecha = (date) => {
        var fecha = String(date)
        return fecha.replace("T00:00:00.000Z", "")
    }

    useEffect(() => {
        const getCabeceraDetalle = async () => {
            const consulta = await axios.get(url)
            setDataCabecera(consulta.data)
        }
        getCabeceraDetalle()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const getDetalle = async () => {
            const consulta = await axios.get(urlDet)
            if ((consulta.data.code === 0) || consulta.data === undefined) { }
            else {
                setDataDetalle(consulta.data)
            }
        }
        getDetalle()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (dataDetalle === undefined) {
            setDataDetalle([])
        }
    }, [dataDetalle])

    const cols1 = [
        { field: 'idcabecera', header: 'Id Cabecera' },
        { field: 'id_detalle', header: 'Id Detalle' },
        { field: 'id_factura', header: 'Id Factura' },
        { field: 'valorapagar', header: 'ValorAPagar' },
        { field: 'abono', header: 'Abono' },
        { field: 'saldo', header: 'Saldo' },

    ];
    const exportColumns1 = cols1.map(col => ({ title: col.header, dataKey: col.field }));

    const exportPdf = () => {
        var date = new Date();
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.setFont('Helvetica', 'bold')
                doc.text(5, 8, 'Factura:\t' + dataCabecera.idcabecera)
                doc.setFontSize(10)
                doc.setFont('Helvetica', 'normal')
                doc.text(5, 15, 'Descripcion:\t       ' + dataCabecera.descripcionpago)
                doc.text(5, 20, 'DNI: \t \t \t' + dataCabecera.prov_dni)
                doc.text(5, 25, 'Fecha de pago: \t ' + dataCabecera.fechapago)
                doc.text(5, 30, 'Fecha de emision:     ' + date.toLocaleDateString())
                // colocar la tabla para los detalles
                doc.autoTable(exportColumns1, dataDetalle,
                    { margin: { top: 50 } });
                doc.save('reportFP.pdf');
            })
        })
    }

    return (<Fragment>
        <div className="container-fluid">
            <div className="row">
                <div className="col"><h3>Cabecera</h3></div>
                <div className="align-self-center derecha me-1">
                    <div className="btn btn-outline-info" onClick={exportPdf} >Imprimir Factura</div>
                </div>
            </div>
            <div className="card mb-2">
                <div className="card-body">
                    <div className="input-group mb-2">
                        <label className="form-control">Id Cabecera</label>
                        <input className="form-control" value={dataCabecera.idcabecera || "Loading..."} readOnly />
                    </div>
                    <div className="input-group mb-2">
                        <label className="form-control">Descripcion de Pago</label>
                        <input className="form-control" value={dataCabecera.descripcionpago || "Loading..."} readOnly />
                    </div>
                    <div className="input-group mb-2">
                        <label className="form-control">Proveedor DNI</label>
                        <input className="form-control" value={dataCabecera.prov_dni || "Loading..."} readOnly />
                    </div>
                    <div className="input-group mb-2">
                        <label className="form-control">Id Fuente de Pago</label>
                        <input className="form-control" value={dataCabecera.idfuente || "Loading..."} readOnly />
                    </div>
                    <div className="input-group mb-2">
                        <label className="form-control">Fecha</label>
                        <input className="form-control" value={cambiarformatoFecha(dataCabecera.fechapago) || "Loading..."} readOnly />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col"><h3>Detalle</h3></div>
                <div className="col align-self-center derecha me-1">
                    <Link to={{ pathname: "/cabecera/detalle/create", cabecera: dataCabecera }}>
                        <h4><FontAwesomeIcon icon={faPlusCircle} /></h4>
                    </Link>
                </div>
            </div>
            <table className="table table-dark table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Id Detalle</th>
                        <th>Id Cabecera</th>
                        <th>Id Factura</th>
                        <th>Valor a Pagar</th>
                        <th>Abono</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    {dataDetalle.map((detalle, index) => {
                        return (
                            <tr key={index}>
                                <td>{detalle.id_detalle}</td>
                                <td>{detalle.idcabecera}</td>
                                <td>{detalle.id_factura}</td>
                                <td>{detalle.valorapagar}</td>
                                <td>{detalle.abono}</td>
                                <td>{detalle.saldo}</td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </div>
    </Fragment>)

}

export default DetalleTable
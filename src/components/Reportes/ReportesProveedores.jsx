import React, { useState } from 'react';
import axios from "axios";
import Logo2 from '../../images/provvedores.png';
import { ExportToCsv } from "export-to-csv"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import swal from 'sweetalert';

const ReportesProveedores = () => {
    const urlCabecera = "https://apirestcxp.herokuapp.com/cxp/";

    const [dni, setDni] = useState("")

    const [dataCabecera, setDataCabecera] = useState([]);

    const configCSV = {
        fieldSeparator: ',',
        filename: "Reporte de proveedor",
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true
    }

    const csvExporter = new ExportToCsv(configCSV)

    const cols = [
        { field: 'idcabecera', header: 'Id Cabecera' },
        { field: 'descripcionpago', header: 'Descripcion' },
        { field: 'prov_dni', header: 'DNI' },
        { field: 'idfuente', header: 'Id Fuente' },
    ];

    const cols1 = [
        { field: 'idcabecera', header: 'Id Cabecera' },
        { field: 'id_detalle', header: 'Id Detalle' },
        { field: 'id_factura', header: 'Id Factura' },
        { field: 'valorapagar', header: 'ValorAPagar' },
        { field: 'abono', header: 'Abono' },
        { field: 'saldo', header: 'Saldo' },

    ];

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));
    const exportColumns1 = cols1.map(col => ({ title: col.header, dataKey: col.field }));

    const getCabecera = async () => {
        if (!(dni === "")) {
            const consulta = await axios.get(urlCabecera + dni)
            setDataCabecera(consulta.data);
        }
    }

    const cambiarformatoFecha = (date) => {
        var fecha = String(date)

        return fecha.replace("T00:00:00.000Z", "")
    }

    const exportPagoPdf = () => {
        if (dataCabecera.length > 0) {
            const array = []
            // eslint-disable-next-line array-callback-return
            dataCabecera.map((pago) => {
                // eslint-disable-next-line array-callback-return
                pago.detalle.map((detail) => {
                    array.push(detail)
                })
            })

            var date = new Date();
            import('jspdf').then(jsPDF => {
                import('jspdf-autotable').then(() => {
                    const doc = new jsPDF.default(0, 0);
                    doc.setFont('Helvetica', 'bold')
                    doc.text(5, 8, 'Movimientos de pagos')
                    doc.addImage(Logo2, 'PNG', 5, 10, 30, 30)
                    doc.setFontSize(10)
                    doc.setFont('Helvetica', 'normal')
                    doc.text(5, 50, 'Fecha de emision: ' + date.toLocaleDateString())

                    doc.autoTable(exportColumns, dataCabecera,
                        { margin: { top: 60 } });

                    doc.autoTable(exportColumns1, array,
                        { margin: { top: 100 } });
                    doc.save('reportPagoProv.pdf');
                })
            })
        } else {
            swal({
                title: "Error",
                text: "No hay datos que exportar",
                icon: "error"
            })
        }
    }

    const exportCSV = () => {
        if (dataCabecera.length > 0) {
            csvExporter.generateCsv(dataCabecera)
        } else {
            swal({
                title: "Error",
                text: "No hay datos que exportar",
                icon: "error"
            })
        }
    }

    const csvPDF = (
        <div className="container-fluid" >
            <div className="btn btn-outline-info" onClick={exportCSV} >CSV</div>

            <button label="PDF" type="button" onClick={exportPagoPdf}
                className="btn btn-outline-primary mx-2" tooltip="PDF" >PDF</button>
        </div>
    )

    return (
        <div className="container-fluid" >
            <h2>Reportes por Proveedor</h2>
            <div className="container-fluid">
                <h6>Ingrese el DNI del proveedor</h6>
                <div className="input-group" >
                    <div className="input-group-prepend">
                        <span className="btn btn-success" onClick={getCabecera}
                        ><FontAwesomeIcon icon={faSearch} /></span>
                    </div>
                    <div className="col-3">
                        <input type="text" className="form-control" value={dni}
                            onChange={(e) => setDni(e.target.value)} required />
                    </div>
                    <div className="col d-flex">
                        {csvPDF}
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-3">
                <table className="table table-dark table-striped" >
                    <thead className="thead-dark" >
                        <tr>
                            <th>Id Cabecera</th>
                            <th>Descripcion de Pago</th>
                            <th>Proveedor DNI</th>
                            <th>Id Fuente de Pago</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!(dataCabecera === undefined) &&
                            dataCabecera.map((cabecera, index) => {
                                return (
                                    <tr key={index} >
                                        <td>{cabecera.idcabecera}</td>
                                        <td>{cabecera.descripcionpago}</td>
                                        <td>{cabecera.prov_dni}</td>
                                        <td>{cabecera.idfuente}</td>
                                        <td>{cambiarformatoFecha(cabecera.fechapago)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default ReportesProveedores
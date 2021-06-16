import React, { useState,useEffect } from 'react';
import axios from "axios";
import { ExportToCsv } from "export-to-csv"
import Logo from '../../images/img1.jpg'
import swal from 'sweetalert';


const ReportesFuentes = () => {
    const urlGet = "https://apirestcxp.herokuapp.com/cxp/fuentepago";

    const [fuentes, setFuentes] = useState([])

    const configCSV = {
        fieldSeparator: ',',
        filename: "Reporte de Fuentes de pago",
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true
    }

    const csvExporter = new ExportToCsv(configCSV)

    const cols = [
        { field: 'idfuente', header: 'Id Fuente' },
        { field: 'nombrepago', header: 'Tipo de pago' },
        { field: 'descripcionpago', header: 'Descripción Pago' },
        { field: 'cuentabancaria', header: 'Nª Cuenta Bancaria' }
    ];

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

    useEffect(() => {
        const getFuentePago = async () => {
            const consulta = await axios.get(urlGet)
            setFuentes(consulta.data)
        }
        getFuentePago()
    }, [])

    const exportPdf = () => {
        if (fuentes.length > 0) {
            var date = new Date();
            import('jspdf').then(jsPDF => {
                import('jspdf-autotable').then(() => {
                    const doc = new jsPDF.default(0, 0);
                    doc.setFont('Helvetica', 'bold')
                    doc.text(5, 8, 'Reporte de Fuentes de pago')
                    doc.addImage(Logo, 'JPG', 5, 10, 30, 30)
                    doc.setFontSize(10)
                    doc.setFont('Helvetica', 'normal')
                    doc.text(5, 60, 'Fecha de emision: ' + date.toLocaleDateString())
                    doc.autoTable(exportColumns, fuentes,
                        { margin: { top: 70 } });
                    doc.save('reportFP.pdf');
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

    const exportExcel = () => {
        if (fuentes.length > 0) {
            import('xlsx').then(xlsx => {
                const worksheet = xlsx.utils.json_to_sheet(fuentes);
                const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
                const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
                saveAsExcelFile(excelBuffer, 'reportFP');
            });
        } else {
            swal({
                title: "Error",
                text: "No hay datos que exportar",
                icon: "error"
            })
        }
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(FileSaver => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    }

    const exportCSV = () => {
        if (fuentes.length > 0) {
            csvExporter.generateCsv(fuentes)
        } else {
            swal({
                title: "Error",
                text: "No hay datos que exportar",
                icon: "error"
            })
        }
    }

    const csvPDF = (
        <div className="container-fluid my-4" >
            <div className="btn btn-outline-info" onClick={exportCSV} >CSV</div>
            <div className="btn btn-outline-success mx-2" onClick={exportExcel} >Excel</div>
            <button label="PDF" type="button" onClick={exportPdf}
                className="btn btn-outline-primary" tooltip="PDF" >PDF</button>
        </div>
    )

    return(
        <div className="container-fluid">
            <h1>Reportes de Fuentes de Pago</h1>
            {csvPDF}
            <div className="container-fluid">
                <table className="table table-dark table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Id Fuente</th>
                            <th>Nombre de Pago</th>
                            <th>Descripción del Pago</th>
                            <th>Cuenta Bancaria</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!(fuentes === undefined) &&
                            fuentes.map((fuente, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{fuente.idfuente}</td>
                                        <td>{fuente.nombrepago}</td>
                                        <td>{fuente.descripcionpago}</td>
                                        <td>{fuente.cuentabancaria}</td>
                                        <td>{fuente.estado.toString()}</td>
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

export default ReportesFuentes
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faListAlt } from "@fortawesome/free-solid-svg-icons"

const ReportesHome = () => {
    return (
        <div className="container-fluid row">
            <div className="col">
                <Link to="/reportes/fuentepago" className="aND">
                    <div className="card bg-dark" data-title="Click aqui" data-intro="Para ingresar al 
                        reporte de las Fuentes de Pago.">
                        <h1 className="centro m-5" > <FontAwesomeIcon icon={faCreditCard} /> </h1>
                        <div className="card-body">
                            <h3 className="card-title">Fuentes de Pago</h3>
                            <p className="card-text">Ver Reporte de las Fuentes de Pago</p>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="col">
                <Link to="/reportes/proveedores" className="aND">
                    <div className="card bg-dark" data-title="Click aqui" data-intro="Para ingresar al 
                        reporte de los Proovedores y sus pagos">
                        <h1 className="centro m-5" > <FontAwesomeIcon icon={faListAlt} /> </h1>
                        <div className="card-body">
                            <h3 className="card-title">Provedores y sus pagos</h3>
                            <p className="card-text">Ver los reportes por proveedor y sus pagos</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default ReportesHome
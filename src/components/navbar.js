import React, {Fragment} from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faFileAlt } from "@fortawesome/free-solid-svg-icons"

export const Navbar = () => {
    return(
        <Fragment>
            <nav className="navbar sticky-top navbar-expand-sm navbar-dark bg-dark">
                <div className="container-fluid">
                    <div className="col">
                        <Link to="/" className="aND">
                            <h1>Módulo de Cuentas por Pagar</h1>
                        </Link>
                    </div>
                    <div className="col-2 align-self-end">
                        <Link to="/cabecera" className="aND">
                            <p><FontAwesomeIcon icon={faTable} /> CRUD Cabecera</p>
                        </Link>
                    </div>
                    <div className="col-1 align-self-end">
                        <Link to="/reportes" className="aND">
                            <p><FontAwesomeIcon icon={faFileAlt} /> Reportes</p>
                        </Link>
                    </div>
                </div>
            </nav>
        </Fragment>
    )
}
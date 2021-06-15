import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable, faFileAlt, faMoneyBill } from "@fortawesome/free-solid-svg-icons"

export const Navbar = () => {
    return (
        <Fragment>
            <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand aND">
                        <h1>Módulo de Cuentas por Pagar</h1>
                    </Link>
                    <ul className="navbar-nav d-flex">
                        <li className="nav-item centro mx-3 nav-base">
                            <Link to="/cabecera" className="aND">
                                <FontAwesomeIcon icon={faTable} />
                                <p>CRUD Cabecera</p>
                            </Link>
                        </li>
                        <li className="nav-item centro mx-3 nav-base">
                            <Link to="/reportes" className="aND">
                                <FontAwesomeIcon icon={faFileAlt} />
                                <p>Reportes</p>
                            </Link>
                        </li>
                        <li className="nav-item centro mx-3 nav-base">
                            <Link to="/fuentepago" className="aND">
                                <FontAwesomeIcon icon={faMoneyBill} />
                                <p>Fuentes de Pago</p>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </Fragment>
    )
}
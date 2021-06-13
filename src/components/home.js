import { Link } from "react-router-dom"

const home = () => {
    return (
        <div className="container-fluid row">
            <div className="col">
                <Link to="/cabecera" className="aND">
                    <div className="card bg-dark" data-title="Click aqui" data-intro="Para ingresar al CRUD de CXP">
                        <img src="/images/crud.svg" className="card-img-top p-5" alt="CRUD" height="300vh" />
                        <div className="card-body">
                            <h3 className="card-title">CRUD</h3>
                            <p className="card-text">Ingresar al CRUD de Cuentas por Pagar</p>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="col">
                <Link to="/reportes" className="aND">
                    <div className="card bg-dark" data-title="Click aqui" data-intro="Para ver los reportes de CXP">
                        <img src="/images/reporte.svg" className="card-img-top p-5" alt="Reportes" height="300vh" />
                        <div className="card-body">
                            <h3 className="card-title">Reportes</h3>
                            <p className="card-text">Ver los reportes de Cuentas por Pagar</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default home
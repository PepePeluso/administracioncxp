import { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import axios from "axios"
import swal from "sweetalert"
import {stringify} from "querystring"


const CabeceraEdit = () => {
    const {cabecera} = useLocation()

    const url = "https://apirestcxp.herokuapp.com/cxp/cabecera/"
    const urlFuente = "https://apirestcxp.herokuapp.com/cxp/fuentepago/"
    const urlProv = "https://app-mod-com.herokuapp.com/compras/facturaProveedor"

    const history = useHistory()

    const [proveedores, setProveedores] = useState(["w","s"])
    const [fuente, setFuente] = useState([0])
    const [cuentaBancariaRO, setCuentabancariaRO] = useState("No se ha seleccionado una fuente de pago.")

    const cambiarformatoFecha = (date) => {
        var fecha = String(date)

        return fecha.replace("T00:00:00.000Z", "")
    }

    const [cabeceraForm, setCabeceraForm] = useState({
        idcabecera: cabecera.idcabecera,
        descripcionpago: cabecera.descripcionpago,
        prov_dni: cabecera.prov_dni,
        idfuente: cabecera.idfuente,
        fechapago: cambiarformatoFecha(cabecera.fechapago)
    })

    const { idcabecera ,descripcionpago, prov_dni, idfuente, fechapago } = cabeceraForm;

    useEffect(() => {
        const getProveedores = async () => {
            const consulta = await axios.get(urlProv)
            if (consulta.data.code === 0){}
            else {
                setProveedores(consulta.data || ["w","s"])
            }
        }
        getProveedores()
    }, [])

    useEffect(() => {
        const getFuentes = async () => {
            const consulta = await axios.get(urlFuente)
            if (consulta.data.code === 0){}
            else {
                setFuente(consulta.data || [0])
            }
        }
        getFuentes()
    }, [])

    const cuentaBancaria = (val) => {
        try {
            setCuentabancariaRO(fuente[val-1].cuentabancaria)
        } catch (error) {
            setCuentabancariaRO("No se ha seleccionado una fuente de pago.")
        }
    }

    const putCabecera = async () => {
        const stringifyCabecera = stringify(cabeceraForm)
        const post = await axios.put(url+"?"+stringifyCabecera)
        if (post.data.code) {
            swal({
                title: "Error",
                text: post.data.message,
                icon: "error"
            })
        } else {
            swal({
                text: "Cabecera actualizada con éxito",
                icon: "success"
            })
            history.push("/cabecera")
        } 
    }

    return (
        <div className="container-fluid">
            <h2>Editar Cabecera</h2>
            <div className="card mb-2">
                <div className="card-body">
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Id Cabecera</label>
                        <input type="text" className="form-control" value={idcabecera} readOnly/>
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Descripcion de Pago</label>
                        <input type="text" className="form-control" value={descripcionpago}
                            onChange={ (e) => setCabeceraForm({...cabeceraForm,descripcionpago: e.target.value}) }
                            required />
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Proveedor DNI</label>
                        <select className="form-select" value={prov_dni}
                            onChange={(e) => setCabeceraForm({...cabeceraForm,prov_dni: e.target.value})} >
                                <option>{prov_dni}</option>
                            {proveedores.map((prov,index) => {
                                return(
                                    <option key={index}>{prov.pro_dni}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Id Fuente de Pago</label>
                        <div className="col row bg-white">
                            <div className="col-2">
                                <select className="col form-select" value={idfuente}
                                    onChange={(e) => {
                                        setCabeceraForm({ ...cabeceraForm, idfuente: e.target.value })
                                        cuentaBancaria(e.target.value)
                                    }} >
                                        <option>0</option>
                                    {fuente.map((fuent, index) => {
                                        return (
                                            <option key={index}>{fuent.idfuente}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col">
                                <input className="col-2 form-control" value={cuentaBancariaRO} readOnly></input>
                            </div>
                        </div>
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Fecha</label>
                        <input type="date" className="form-control" value={fechapago} 
                            onChange={(e) => setCabeceraForm({...cabeceraForm,fechapago: e.target.value})}
                            required />
                    </div>
                </div>
            </div>
            <div>
                <button 
                    className="btn btn-primary" onClick={putCabecera}>Guardar</button>
            </div>
        </div>
    )

}

export default CabeceraEdit
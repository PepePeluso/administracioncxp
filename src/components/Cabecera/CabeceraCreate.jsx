import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import axios from "axios"
import swal from "sweetalert"
import {stringify} from "querystring"

const CabeceraCreate = () => {
    const url = "https://apirestcxp.herokuapp.com/cxp/cabecera/"
    const urlProv = "https://app-mod-com.herokuapp.com/compras/facturaProveedor"

    const history = useHistory()

    const [proveedores, setProveedores] = useState(["w","s"])

    const hoy = new Date()

    const [cabeceraForm, setCabeceraForm] = useState({
        descripcionpago: "",
        prov_dni: "Select a DNI...",
        idfuente: 0,
        fechapago: hoy.getFullYear() + "-" + (hoy.getMonth()+1).toString().padStart(2,0) 
            + "-" + hoy.getDate().toString().padStart(2,0)
    })

    const postCabecera = async () => {
        const stringifyCabecera = stringify(cabeceraForm)
        if (cabeceraForm.prov_dni === "Select a DNI..."){
            swal({
                title: "Error",
                text: "No se ha seleccionado un Proveedor DNI",
                icon: "error"
            })
        } else {
            const post = await axios.post(url+"?"+stringifyCabecera)
            if (post.data.code) {
                swal({
                    title: "Error",
                    text: post.data.message,
                    icon: "error"
                })
            } else {
                swal({
                    text: "Cabecera creada con éxito",
                    icon: "success"
                })
                history.push("/cabecera")
            } 
        }
    }

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

    const { descripcionpago, prov_dni, idfuente, fechapago } = cabeceraForm;

    return (
        <div className="container-fluid">
            <h2>Agregar Cabecera</h2>
            <div className="card mb-2">
                <div className="card-body">
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
                                <option>Select a DNI...</option>
                            {proveedores.map((prov,index) => {
                                return(
                                    <option key={index}>{prov.pro_dni}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Id Fuente de Pago</label>
                        <input className="form-control" value={idfuente} 
                            onChange={(e) => setCabeceraForm({...cabeceraForm,idfuente: e.target.value})}
                            required />
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
                <button onClick={postCabecera}
                    className="btn btn-primary" >Guardar</button>
            </div>
        </div>
    )

}

export default CabeceraCreate
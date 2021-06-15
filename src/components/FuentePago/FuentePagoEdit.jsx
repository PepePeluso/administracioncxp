import { useState, useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import axios from "axios"
import swal from "sweetalert"
import {stringify} from "querystring"

const FuentePagoEdit = () => {
    const {fuentePago} = useLocation()

    const url = "https://apirestcxp.herokuapp.com/cxp/fuentepago/";
    const urlTipo = "https://apirestcxp.herokuapp.com/cxp/tipopago";

    const history = useHistory()

    const [tipoPago, setTipoPago] = useState([])
    const [nombrepago, setNombrepago] = useState(fuentePago.nombrepago)

    const [fuenteForm, setFuenteForm] = useState({
        idfuente: fuentePago.idfuente,
        idpago: fuentePago.idpago,
        descripcionpago: fuentePago.descripcionpago,
        cuentabancaria: fuentePago.cuentabancaria,
        estado: fuentePago.estado
    })

    useEffect(() => {
        const getTipoPago = async () => {
            const consulta = await axios.get(urlTipo)
            if (consulta.data.code === 0) { }
            else {
                setTipoPago(consulta.data || [0])
            }
        }
        getTipoPago()
    }, [])

    useEffect(() => {
        const checkbox = document.getElementById("chkEstado")
        if (estado){
            checkbox.click()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (tipoPago.length > 0){
            const tpNum = tipoPago.find(tp => tp.nombrepago === fuentePago.nombrepago)
            setFuenteForm({ ...fuenteForm, idpago: tpNum.idpago })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipoPago])

    const namePago = (val) => {
        try {
            setNombrepago(tipoPago[val - 1].nombrepago)
        } catch (error) {
            setNombrepago("No se ha seleccionado una fuente de pago.")
        }
    }

    const estadoCheck = () => {
        const checkbox = document.getElementById("chkEstado")
        setFuenteForm({ ...fuenteForm, estado: checkbox.checked })
    }

    const { idfuente,idpago, descripcionpago, cuentabancaria, estado } = fuenteForm

    const putFuente = async (e) => {
        const stringifyFuente = stringify(fuenteForm)
        if (idpago === 0){
            swal({
                title: "Error",
                text: "No se ha seleccionado un Tipo de Pago.",
                icon: "error"
            })
        } else if (descripcionpago === "") {
            swal({
                title: "Error",
                text: "No se ha llenado la descripción del tipo de pago.",
                icon: "error"
            })
        } else if (cuentabancaria === "") {
            swal({
                title: "Error",
                text: "No se ha llenado la Cuenta Bancaria.",
                icon: "error"
            })
        } else {
            const post = await axios.put(url+"?"+stringifyFuente)
            if (post.data.code) {
                swal({
                    title: "Error",
                    text: post.data.message,
                    icon: "error"
                })
            } else {
                swal({
                    text: "Fuente de Pago editada con éxito",
                    icon: "success"
                })
                history.push("/fuentepago")
            } 
        }
    }

    return (
        <div className="container-fluid">
            <h2>Agregar Fuente de Pago</h2>
            <div className="card mb-2">
                <div className="card-body">
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Id Fuente</label>
                        <input type="text" className="form-control" value={idfuente} readOnly/>
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Id Tipo de Pago</label>
                        <div className="col row bg-white">
                            <div className="col-2">
                                <select className="col form-select" value={idpago}
                                    onChange={(e) => {
                                        setFuenteForm({ ...fuenteForm, idpago: e.target.value })
                                        namePago(e.target.value)
                                    }} >
                                    <option>0</option>
                                    {tipoPago.map((tipo, index) => {
                                        return (
                                            <option key={index}>{tipo.idpago}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col">
                                <input className="col-2 form-control" value={nombrepago} readOnly></input>
                            </div>
                        </div>
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Descripcion de Tipo de Pago</label>
                        <input type="text" className="form-control" value={descripcionpago}
                            onChange={(e) => setFuenteForm({ ...fuenteForm, descripcionpago: e.target.value })}
                            required />
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Cuenta Bancaria</label>
                        <input type="text" className="form-control" value={cuentabancaria}
                            onChange={(e) => setFuenteForm({ ...fuenteForm, cuentabancaria: e.target.value })}
                            required />
                    </div>
                    <div className="input-group mb-2 bg-dark">
                        <label className="col-2 align-self-center aND text-center m-2">Estado</label>
                        <div className="col row bg-white">
                            <input type="checkbox" className="form-check-input align-self-center m-2" value={estado}
                            id="chkEstado" onClick={estadoCheck}/>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <input type="submit" onClick={putFuente} className="btn btn-primary" value="Guardar" />
            </div>
        </div>
    )
}

export default FuentePagoEdit
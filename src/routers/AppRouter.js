import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CabeceraCreate from "../components/Cabecera/CabeceraCreate";
import CabeceraEdit from "../components/Cabecera/CabeceraEdit";
import CabeceraTable from "../components/Cabecera/CabeceraTable";
import DetalleTable from "../components/Detalle/DetalleTable";
import Error404 from "../components/Error404";
import home from "../components/home";
import { Navbar } from "../components/navbar";

export const AppRouter = () => {
    return (
        <Router >
            <Navbar />
            <div className="row m-3">
                <Switch >
                    <Route exact path="/cabecera/create" component={CabeceraCreate} />
                    <Route exact path="/cabecera/edit" component={CabeceraEdit} />
                    <Route exact path="/cabecera/detalle" component={DetalleTable} />
                    <Route exact path="/cabecera" component={CabeceraTable} />
                    <Route exact path="/" component={home} />
                    <Route path="*" component={Error404} />
                </Switch>
            </div>
        </Router>
    )
}